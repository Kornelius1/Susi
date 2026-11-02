<template>
  <div class="skeleton" :style="{ height: `${height}px` }" aria-hidden="true" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{ height?: number }>(), { height: 80 })
</script>

<style scoped lang="scss">
.skeleton {
  border-radius: $radius-card;
  background: linear-gradient(90deg, #e9ecf1 25%, #f4f5f8 50%, #e9ecf1 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
</style>
