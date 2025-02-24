<script lang="ts" setup>
import { useTemplateRef } from 'vue';

const modelValue = ref('')
const inputRef = useTemplateRef('inputRef'   )

function handleChange () {
  console.log(inputRef.value.value)
}
</script>

<template>
  <ElInput @change="handleChange" v-model.trim="modelValue" ref="inputRef" placeholder="Enter to search" clearable />
</template>
