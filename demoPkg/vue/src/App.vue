<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { MonacoEditor } from '../../../src/vue/index'
import { ref } from 'vue'
import { NInput } from 'naive-ui'
import "./useWorker"

const input =ref('const a = 123;')
const width = ref('300')
const handleUpdateValue = (newValue: string) => {
  console.log('App newValue', newValue)
  input.value = newValue
}
</script>

<template>
  <div>
    <NInput v-model:value="width" />
    <MonacoEditor
      :value="input"
      @update:value="handleUpdateValue"
      :width="width"
      height="600px"
    />
  </div>
</template>

<style>

</style>
