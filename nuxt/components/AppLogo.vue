<template>
  <img class="logo" src="/susiair-logo.png" alt="Susi Air" :style="{ height: `${height}px` }" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{ height?: number }>(), { height: 32 })
</script>

<style scoped lang="scss">
.logo {
  display: block;
  width: auto;
  max-width: 100%;
  object-fit: contain;
}
</style>
