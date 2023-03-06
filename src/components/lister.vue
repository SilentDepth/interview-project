<script lang="ts" setup>
import { watch, nextTick } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['submit'])

let localData = $ref<any>()
let hasChanged = $ref(false)

async function restore () {
  localData = JSON.parse(JSON.stringify(props.data))
  await nextTick()
  hasChanged = false
}

watch(() => props.data, () => {
  restore()
}, { immediate: true, deep: true })

watch($$(localData), () => {
  hasChanged = true
}, { deep: true })
</script>

<template>
  <div class="border border-gray-400 rounded">
    <h1 class="px-3 py-2 mb-2 text-xl">
      <slot name="title">Edit</slot>
    </h1>
    <div class="px-3 space-y-4">
      <div v-for="(it, idx) of localData" class="">
        <div class="mb-2 flex">
          <h2 class="text-gray-600 uppercase">
            <slot name="item-title" :index="idx">Item {{ idx + 1 }}</slot>
          </h2>
          <button type="button" class="ml-auto text-red-600" @click="localData.splice(idx, 1)">Remove</button>
        </div>
        <slot :data="it"/>
      </div>
      <button type="button" class="text-blue-600" @click="localData.push({})">
        <slot name="add-item">Add an item</slot>
      </button>
    </div>
    <footer class="px-3 py-2 mt-4 flex justify-end space-x-2">
      <button :disabled="!hasChanged" type="button" class="px-2 py-1 border border-gray-400 rounded disabled:opacity-50 disabled:cursor-default" @click="restore">Restore</button>
      <button type="button" class="px-2 py-1 bg-blue-600 text-white border border-blue-700 rounded" @click="$emit('submit', localData)">Submit</button>
    </footer>
  </div>
</template>
