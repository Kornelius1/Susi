<template>
  <div class="page">
    <NuxtLink to="/schedule" class="back"><ArrowLeft :size="18" aria-hidden="true" /> Back to schedule</NuxtLink>

    <section class="card">
      <CalendarDays :size="32" aria-hidden="true" />
      <h1 class="card__date">{{ valid ? formatLongDate(date) : 'Invalid date' }}</h1>
      <p class="card__text">{{ valid ? 'Detail page coming soon' : 'This date is not valid.' }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, CalendarDays } from 'lucide-vue-next'

const route = useRoute()
const date = computed(() => String(route.params.date))
const valid = computed(() => isIsoDate(date.value))

useHead({ title: 'Duty detail · Susi Air Pilot Hub' })
</script>

<style scoped lang="scss">
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 16px 0;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  font-weight: 700;
  font-size: 14px;
  @include focus-ring;
}

.card {
  @include card;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 20px;
  text-align: center;
  color: $text-2;

  &__date {
    font-size: 18px;
    font-weight: 800;
    color: $text;
  }

  &__text {
    font-weight: 600;
  }
}
</style>
