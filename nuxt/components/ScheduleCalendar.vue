<template>
  <div class="cal" :class="{ 'cal--busy': busy }">
    <div class="cal__week" aria-hidden="true">
      <span v-for="d in WEEKDAYS" :key="d">{{ d }}</span>
    </div>

    <div class="cal__grid">
      <template v-for="(date, i) in cells" :key="date ?? `blank-${i}`">
        <span v-if="!date" class="cal__blank" />

        <button
          v-else
          type="button"
          class="day"
          :class="{ 'day--empty': !byDate.get(date), 'day--today': date === today }"
          :style="dayStyle(date)"
          :aria-label="ariaLabel(date)"
          :aria-current="date === today ? 'date' : undefined"
          @click="$emit('select', date)"
        >
          <span class="day__num">{{ Number(date.slice(8)) }}</span>

          <template v-if="byDate.get(date)">
            <!-- Centang jika semua tugas tercatat, selain itu jumlah tugas tersisa -->
            <span v-if="byDate.get(date)!.is_complete" class="day__badge day__badge--done" aria-hidden="true">
              <Check :size="12" :stroke-width="3.5" />
            </span>
            <span v-else class="day__badge num" aria-hidden="true">{{ byDate.get(date)!.count_remaining }}</span>

            <span class="day__base">{{ byDate.get(date)!.base_name }}</span>
          </template>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import type { LegendItem, ScheduleEntry } from '~/types/api'

const props = defineProps<{
  year: number
  month: number
  entries: ScheduleEntry[]
  legend: LegendItem[]
  today: string | null
  busy?: boolean
}>()

defineEmits<{ select: [date: string] }>()

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const cells = computed(() => buildMonthGrid(props.year, props.month))
const byDate = computed(() => new Map(props.entries.map((e) => [e.duty_date, e])))
const legendByCode = computed(() => new Map(props.legend.map((l) => [l.code, l.label])))

function dayStyle(date: string) {
  const entry = byDate.value.get(date)
  if (!entry) return undefined
  // Warna sel langsung dari base_color API; warna teks dipilih agar tetap terbaca.
  return { backgroundColor: entry.base_color, color: readableTextColor(entry.base_color) }
}

function ariaLabel(date: string): string {
  const entry = byDate.value.get(date)
  if (!entry) return `${formatLongDate(date)}, no duty`
  const type = legendByCode.value.get(entry.duty_type) ?? entry.duty_type
  const progress = entry.is_complete
    ? 'all logged'
    : `${entry.count_remaining} of ${entry.count_schedules} remaining`
  return `${formatLongDate(date)}, ${type} at ${entry.base_name}, ${progress}`
}
</script>

<style scoped lang="scss">
.cal {
  @include card;
  padding: 14px 12px 12px;
  transition: opacity 0.15s ease;

  &--busy {
    opacity: 0.55;
    pointer-events: none;
  }

  &__week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    margin-bottom: 8px;
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    color: $text-2;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
  }
}

.day {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  aspect-ratio: 1 / 1.18;
  min-width: 0;
  padding: 5px 4px 4px 5px;
  border-radius: 10px;
  text-align: left;
  @include focus-ring;

  &--empty {
    background: $bg;
    color: $text-2;
  }

  &--today {
    box-shadow:
      0 0 0 2px $surface,
      0 0 0 4px $navy;
  }

  &__num {
    font-size: 12px;
    font-weight: 800;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  &__badge {
    position: absolute;
    top: 3px;
    right: 3px;
    display: grid;
    place-items: center;
    min-width: 16px;
    height: 16px;
    padding: 0 3px;
    border-radius: 8px;
    background: #fff;
    color: $navy;
    font-size: 10.5px;
    line-height: 1;

    &--done {
      padding: 0;
      width: 16px;
      color: $success-text;
    }
  }

  &__base {
    position: absolute;
    right: 0;
    bottom: 5px;
    left: 0;
    text-align: center;
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.04em;
  }
}

// Layar sangat kecil (mis. 320px): rapatkan grid agar angka tanggal dan badge tidak bertabrakan.
@media (max-width: 359px) {
  .cal {
    padding: 12px 8px 8px;

    &__week,
    &__grid {
      gap: 4px;
    }
  }

  .day {
    padding: 4px 3px 3px 4px;
    border-radius: 8px;

    &__num {
      font-size: 10.5px;
    }

    &__badge {
      top: 2px;
      right: 2px;
      min-width: 13px;
      height: 13px;
      padding: 0 2px;
      border-radius: 7px;
      font-size: 9px;

      &--done {
        width: 13px;
      }
    }

    &__base {
      font-size: 8.5px;
      letter-spacing: 0.02em;
    }
  }
}
</style>
