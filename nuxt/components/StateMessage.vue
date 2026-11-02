<template>
  <div class="state" role="alert">
    <TriangleAlert :size="20" aria-hidden="true" />
    <p class="state__text">{{ message }}</p>
    <button v-if="retry" class="state__btn" type="button" @click="$emit('retry')">Try again</button>
  </div>
</template>

<script setup lang="ts">
import { TriangleAlert } from 'lucide-vue-next'

defineProps<{ message: string; retry?: boolean }>()
defineEmits<{ retry: [] }>()
</script>

<style scoped lang="scss">
.state {
  @include card;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  text-align: center;
  color: $danger-text;

  &__text {
    color: $text;
    font-weight: 500;
  }

  &__btn {
    margin-top: 4px;
    padding: 8px 18px;
    border-radius: $radius-pill;
    background: $navy;
    color: #fff;
    font-weight: 700;
    font-size: 13px;
    @include focus-ring;
  }
}
</style>
