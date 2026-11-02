<template>
  <section class="legend" aria-labelledby="legend-title">
    <h2 id="legend-title" class="legend__title">Legend</h2>
    <ul class="legend__list">
      <li v-for="item in items" :key="item.code" class="legend__item">
        <span class="legend__swatch" :style="{ backgroundColor: item.color }" aria-hidden="true" />
        <span class="legend__code">{{ item.code }}</span>
        <span class="legend__label">{{ item.label }}</span>
      </li>
    </ul>
    <p class="legend__hint">
      <Check :size="13" :stroke-width="3" aria-hidden="true" /> all duties logged &nbsp;·&nbsp; number = duties still to log
    </p>
  </section>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import type { LegendItem } from '~/types/api'

defineProps<{ items: LegendItem[] }>()
</script>

<style scoped lang="scss">
.legend {
  @include card;
  padding: 16px;

  &__title {
    font-size: 14px;
    font-weight: 800;
    margin-bottom: 10px;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 12px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    min-width: 0;
    font-size: 12px;
  }

  &__swatch {
    flex: none;
    width: 14px;
    height: 14px;
    margin-top: 2px;
    border-radius: 4px;
  }

  &__code {
    font-weight: 800;
    flex: none;
    min-width: 30px;
  }

  &__label {
    color: $text-2;
    overflow-wrap: anywhere;
  }

  &__hint {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid $border;
    font-size: 11.5px;
    color: $text-2;
  }
}
</style>
