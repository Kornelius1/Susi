<template>
  <div class="cards">
    <template v-if="cards.length">
      <article v-for="card in cards" :key="card.key" class="card" :class="`card--${card.status}`">
        <header class="card__head">
          <h3 class="card__title">{{ card.label }}</h3>
          <span class="card__window">{{ card.windowDays === 1 ? 'Today' : `Rolling ${card.windowDays} days` }}</span>
        </header>

        <p class="card__value">
          <span class="num">{{ formatHours(card.hours) }}</span>
          <small>h</small>
        </p>
        <p class="card__limit">of {{ card.limit.toLocaleString('en-US') }} h limit</p>

        <div
          class="card__track"
          role="progressbar"
          :aria-valuenow="Math.min(card.percent, 100)"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`${card.label}: ${card.percent}% of limit`"
        >
          <!-- Bar dibatasi 100% agar layout tidak pecah; angka aslinya tetap tampil di teks. -->
          <span class="card__fill" :style="{ width: `${Math.min(card.percent, 100)}%` }" />
        </div>

        <p class="card__foot">
          <span class="card__status">{{ statusLabel[card.status] }}</span>
          <span class="num">{{ card.percent }}%</span>
        </p>
      </article>
    </template>

    <template v-else>
      <SkeletonBlock v-for="n in 4" :key="n" :height="150" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CardStatus, LimitCard } from '~/types/api'

defineProps<{ cards: LimitCard[] }>()

const statusLabel: Record<CardStatus, string> = {
  safe: 'Within limit',
  warning: 'Near limit',
  over: 'Over limit',
}
</script>

<style scoped lang="scss">
.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.card {
  @include card;
  --tone: #{$success};
  --tone-text: #{$success-text};
  padding: 14px;
  min-width: 0;

  &--warning {
    --tone: #{$warning};
    --tone-text: #{$warning-text};
  }
  &--over {
    --tone: #{$danger};
    --tone-text: #{$danger-text};
  }

  &__head {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  &__title {
    font-size: 13px;
    font-weight: 700;
  }

  &__window {
    font-size: 11px;
    color: $text-2;
  }

  &__value {
    display: flex;
    align-items: baseline;
    gap: 3px;
    margin-top: 10px;

    .num {
      font-size: 28px;
      line-height: 1.1;
    }

    small {
      font-size: 13px;
      font-weight: 700;
      color: $text-2;
    }
  }

  &__limit {
    font-size: 12px;
    color: $text-2;
  }

  &__track {
    height: 8px;
    margin-top: 10px;
    border-radius: $radius-pill;
    background: #eceef2;
    overflow: hidden;
  }

  &__fill {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--tone);
    transition: width 0.4s ease;
  }

  &__foot {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 12px;
    font-weight: 700;
    color: var(--tone-text);
  }
}
</style>
