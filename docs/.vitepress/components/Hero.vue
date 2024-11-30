<script lang="ts" setup>
import { useData } from 'vitepress'
const { site } = useData()
</script>

<template>
  <div class="flex justify-center flex-col gap-4 items-center p-4 md:p-10">
    <h1 class="!text-4xl font-bold">{{ site.title }}</h1>
    <p class="text-xl">{{ site.description }}</p>
  </div>
</template>
