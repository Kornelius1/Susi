<template>
  <div class="toggle" role="group" aria-label="Chart range">
    <button
      v-for="option in options"
      :key="option"
      type="button"
      class="toggle__btn"
      :class="{ 'toggle__btn--active': option === modelValue }"
      :aria-pressed="option === modelValue"
      @click="$emit('update:modelValue', option)"
    >
      {{ option }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { RangeKey } from '~/types/api'

defineProps<{ modelValue: RangeKey; options: RangeKey[] }>()
defineEmits<{ 'update:modelValue': [value: RangeKey] }>()
</script>

<style scoped lang="scss">
.toggle {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 4px;
  padding: 4px;
  border-radius: $radius-pill;
  background: #e9ecf1;

  &__btn {
    padding: 8px 0;
    border-radius: $radius-pill;
    font-size: 13px;
    font-weight: 700;
    color: $text-2;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;
    @include focus-ring;

    &--active {
      background: $navy;
      color: #fff;
      box-shadow: 0 2px 6px rgba($navy, 0.25);
    }
  }
}
</style>
