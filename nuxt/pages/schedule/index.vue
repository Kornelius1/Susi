<template>
  <div class="page">
    <header class="head">
      <h1 class="head__title">Schedule</h1>
    </header>

    <div class="month">
      <button
        type="button"
        class="month__btn"
        aria-label="Previous month"
        :disabled="!schedules.year || schedules.loading"
        @click="schedules.prev()"
      >
        <ChevronLeft :size="20" />
      </button>
      <h2 class="month__label" aria-live="polite">
        {{ schedules.year ? formatMonthYear(schedules.year, schedules.month) : '…' }}
      </h2>
      <button
        type="button"
        class="month__btn"
        aria-label="Next month"
        :disabled="!schedules.year || schedules.loading"
        @click="schedules.next()"
      >
        <ChevronRight :size="20" />
      </button>
    </div>

    <ColdStartHint v-if="slow" />

    <StateMessage
      v-if="schedules.error"
      :message="schedules.error"
      retry
      @retry="schedules.year ? schedules.load(schedules.year, schedules.month) : schedules.init()"
    />

    <template v-else-if="schedules.data">
      <ScheduleCalendar
        :year="schedules.year"
        :month="schedules.month"
        :entries="schedules.data.entries"
        :legend="schedules.data.legend"
        :today="schedules.data.today"
        :busy="schedules.loading"
        @select="openDay"
      />

      <p v-if="!schedules.loading && !schedules.data.entries.length" class="empty">
        No duties scheduled for this month.
      </p>

      <ScheduleLegend :items="schedules.data.legend" />
    </template>

    <SkeletonBlock v-else :height="380" />
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

useHead({ title: 'Schedule · Susi Air Pilot Hub' })

const schedules = useSchedulesStore()
const loadingFirst = computed(() => schedules.loading && !schedules.data)
const slow = useSlowLoading(loadingFirst)

// Selalu mulai dari bulan "hari ini" milik server.
schedules.init()

// Tap tanggal -> halaman detail (placeholder).
const openDay = (date: string) => navigateTo(`/schedule/${date}`)
</script>

<style scoped lang="scss">
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 16px 0;
}

.head__title {
  font-size: 22px;
  font-weight: 800;
}

.month {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  gap: 8px;

  &__label {
    text-align: center;
    font-size: 17px;
    font-weight: 800;
  }

  &__btn {
    @include card;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    @include focus-ring;

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  }
}

.empty {
  text-align: center;
  color: $text-2;
  font-size: 13px;
}
</style>
