<script lang="ts" setup>
import { watch, type PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  options: {
    type: Array as PropType<SelectOption[]>,
    default: () => [],
  },
  optionFilter: {
    type: Function as PropType<(keyword: string) => Promise<SelectOption[]>>,
    default: null,
  },
})

let optionCache = $ref<SelectOption | null>(null)
const currLabel = $computed(() => {
  return optionCache && optionCache.value === props.modelValue
    ? optionCache.label
    : props.options.find(it => it.value === props.modelValue)?.label ?? props.modelValue
})

const emit = defineEmits(['update:modelValue'])

let $el = $ref<HTMLElement>(null as any)
let open = $ref(false)
let keyword = $ref('')
let fetching = $ref(false)
let optionsFiltered = $ref<SelectOption[]>([])
const currOptions = $computed(() => keyword ? optionsFiltered : props.options)

function handleClickOption (opt: SelectOption) {
  emit('update:modelValue', opt.value)
  optionCache = opt
  open = false
}

function handleClickOutside (ev: MouseEvent) {
  if (!ev.composedPath().includes($el)) {
    open = false
  }
}

watch($$(open), open => {
  if (open) {
    document.addEventListener('click', handleClickOutside)
  } else {
    keyword = ''
    document.removeEventListener('click', handleClickOutside)
  }
})

let fetchKey: number

watch($$(keyword), async keyword => {
  if (keyword) {
    const key = fetchKey = Date.now()
    if (props.optionFilter) {
      fetching = true
      const result = await props.optionFilter(keyword)
      if (fetchKey === key) {
        optionsFiltered = result
        fetching = false
      }
    } else {
      optionsFiltered = props.options.filter(opt => opt.label.toLowerCase().includes(keyword.toLowerCase()))
    }
  }
})
</script>

<template>
  <div ref="$el" class="relative" style="width: 240px">
    <label class="flex items-center border border-gray-400 rounded focus-within:ring">
      <input
        :value="currLabel"
        type="text"
        readonly
        class="flex-1 self-stretch px-2 py-1 bg-transparent outline-none cursor-default"
        @click="open = true"
      />
      <span class="flex-none pr-2">▼</span>
    </label>
    <ul v-if="open" class="absolute top-full left-0 mt-1 min-w-full overflow-hidden bg-white border border-gray-400 rounded shadow-xl">
      <li class="p-1 border-b border-gray-400 flex">
        <input v-model="keyword" type="text" class="w-full px-2 border border-gray-400 rounded-sm">
      </li>
      <li v-if="fetching" class="p-1 text-center text-gray-600">Loading</li>
      <li v-if="!fetching && currOptions.length === 0" class="p-1 text-center text-gray-600">No data</li>
      <li
        v-for="(opt, idx) of currOptions"
        :key="`${idx}-${opt.value}`"
        class="p-1 flex items-center hover:bg-gray-100 cursor-pointer"
        @click="handleClickOption(opt)"
      >
        {{ opt.label }}
        <span v-if="modelValue === opt.value" class="ml-auto">✔️</span>
      </li>
    </ul>
  </div>
</template>
