<template>
  <p class="hint" role="status">
    <LoaderCircle class="hint__spin" :size="16" aria-hidden="true" />
    Waking up the server. The free hosting tier can take up to a minute on the first request.
  </p>
</template>

<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'
</script>

<style scoped lang="scss">
.hint {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border-radius: $radius-md;
  background: rgba($warning, 0.12);
  color: $warning-text;
  font-size: 12.5px;
  font-weight: 500;

  &__spin {
    flex: none;
    margin-top: 2px;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
