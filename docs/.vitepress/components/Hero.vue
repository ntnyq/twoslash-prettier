<script lang="ts" setup>
import { useData } from 'vitepress'

const { site } = useData()
</script>

<template>
  <div
    class="flex justify-center text-center flex-col gap-2 items-center p-4 md:p-8"
  >
    <h1 class="!text-4xl font-bold">{{ site.title }}</h1>
    <p class="text-xl op-75">{{ site.description }}</p>
  </div>
</template>
