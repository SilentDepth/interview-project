<script setup lang="ts">
import TheSelect from './components/select.vue'
import TheLister from './components/lister.vue'
import { fetchSelectOptions } from './api'

let selectValue = $ref<string>('222')
const selectOptions = [
  { value: '111', label: 'One' },
  { value: '222', label: 'Two' },
  { value: '333', label: 'Three' },
]
const optionFilter = (keyword: string) => fetchSelectOptions(keyword)

let listerData = $ref([
  { name: 'One', gender: 'M' },
  { name: 'Two', gender: 'F' },
  { name: 'Three', gender: 'M' },
])
</script>

<template>
  <div class="min-h-screen grid grid-cols-[auto_auto] gap-10 place-content-center">
    <TheSelect v-model="selectValue" :options="selectOptions" :option-filter="optionFilter"/>
    <pre class="text-sm">value: {{ JSON.stringify(selectValue, null, 2) }}</pre>
    <hr class="col-span-full">
    <TheLister :data="listerData" @submit="listerData = $event">
      <template #title>Edit List</template>
      <template #item-title="{ index }">User {{ index + 1 }}</template>
      <template #add-item>Add a user</template>
      <template #default="{ data: it }">
        <div class="p-1 flex space-x-1 bg-gray-50 border border-dashed border-gray-400">
          <label class="flex flex-col">
            <span class="mb-1">Name</span>
            <input v-model="it.name" type="text" class="h-6 px-1 border border-gray-400">
          </label>
          <label class="flex flex-col">
            <span class="mb-1">Gender</span>
            <select v-model="it.gender" class="h-6 px-1 border border-gray-400">
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </label>
        </div>
      </template>
    </TheLister>
    <pre class="text-sm">{{ JSON.stringify(listerData, null, 2) }}</pre>
  </div>
</template>
