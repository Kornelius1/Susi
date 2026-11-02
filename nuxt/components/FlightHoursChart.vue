<template>
  <div class="chart">
    <div class="chart__plot" tabindex="0" aria-label="Flight hours chart. Use left and right arrow keys to inspect each day." @keydown.left.prevent="move(-1)" @keydown.right.prevent="move(1)">
      <svg :viewBox="`0 0 ${W} ${H}`" class="chart__svg" role="img" :aria-label="ariaLabel">
        <!-- Area "projected" (setelah hari ini) diberi latar tipis -->
        <rect
          v-if="todayIdx < n - 1"
          :x="x(todayIdx)"
          :y="MT"
          :width="x(n - 1) - x(todayIdx)"
          :height="plotH"
          class="chart__future"
        />

        <!-- Grid dan label sumbu Y -->
        <g>
          <template v-for="t in ticks" :key="t">
            <line :x1="ML" :x2="W - MR" :y1="y(t)" :y2="y(t)" class="chart__grid" />
            <text :x="ML - 8" :y="y(t) + 3.5" text-anchor="end" class="chart__tick">{{ t }}</text>
          </template>
        </g>

        <path v-if="areaPath" :d="areaPath" class="chart__area" />

        <!-- Garis limit (merah) -->
        <line :x1="ML" :x2="W - MR" :y1="limitY" :y2="limitY" class="chart__limit" />
        <text :x="limitLabelX" :y="limitY - 5" :text-anchor="limitLabelAnchor" class="chart__limit-label">Limit {{ summary.limit }} h</text>

        <!-- Penanda hari ini -->
        <line :x1="x(todayIdx)" :x2="x(todayIdx)" :y1="MT - 6" :y2="baseline" class="chart__today" />
        <text :x="x(todayIdx)" :y="MT - 10" text-anchor="middle" class="chart__today-label">Today</text>

        <!-- Garis data: solid = sudah lewat, putus-putus = proyeksi -->
        <path :d="pastPath" class="chart__line" />
        <path v-if="futurePath" :d="futurePath" class="chart__line chart__line--future" />

        <!-- Titik data -->
        <circle
          v-for="(p, i) in points"
          :key="p.date"
          :cx="x(i)"
          :cy="y(p.rollingSum)"
          :r="i === active ? 6 : p.isToday ? 5 : 3.4"
          class="chart__dot"
          :class="{
            'chart__dot--over': p.overLimit,
            'chart__dot--today': p.isToday,
            'chart__dot--active': i === active,
          }"
        />

        <!-- Label sumbu X -->
        <g>
          <template v-for="(p, i) in points" :key="`x-${p.date}`">
            <text :x="x(i)" :y="baseline + 16" text-anchor="middle" class="chart__x" :class="{ 'chart__x--today': p.isToday }">
              {{ Number(p.date.slice(8)) }}
            </text>
            <text v-if="i === 0 || p.date.endsWith('-01')" :x="x(i)" :y="baseline + 29" text-anchor="middle" class="chart__month">
              {{ monthName(p.date) }}
            </text>
          </template>
        </g>

        <!-- Area sentuh tiap hari -->
        <rect
          v-for="(p, i) in points"
          :key="`hit-${p.date}`"
          :x="x(i) - colW / 2"
          :y="MT - 6"
          :width="colW"
          :height="plotH + 6"
          class="chart__hit"
          @click="active = i"
        />
      </svg>
    </div>

    <ul class="chart__legend" aria-hidden="true">
      <li><span class="chart__key chart__key--actual" />Actual</li>
      <li><span class="chart__key chart__key--projected" />Projected</li>
      <li><span class="chart__key chart__key--limit" />Limit</li>
    </ul>

    <!-- Detail hari yang dipilih -->
    <div v-if="selected" class="detail" aria-live="polite">
      <div>
        <p class="detail__date">{{ formatLongDate(selected.date) }}</p>
        <p class="detail__sub">
          Flown that day <strong class="num">{{ formatHours(selected.hours) }} h</strong>
        </p>
      </div>
      <div class="detail__right">
        <p class="detail__value num" :class="{ 'detail__value--over': selected.overLimit }">
          {{ formatHours(selected.rollingSum) }} h
        </p>
        <p class="detail__sub">{{ summary.windowDays }}-day total</p>
      </div>
      <p v-if="tags.length" class="detail__tags">
        <span v-for="tag in tags" :key="tag.text" class="tag" :class="`tag--${tag.tone}`">{{ tag.text }}</span>
      </p>
    </div>

    <!-- Alternatif teks untuk pembaca layar -->
    <!-- Dibungkus div: elemen <table> mengabaikan width/overflow sehingga tidak bisa disembunyikan langsung. -->
    <div class="sr-only">
    <table>
      <caption>
        Rolling {{ summary.windowDays }}-day flight hours, limit {{ summary.limit }} hours
      </caption>
      <thead>
        <tr><th>Date</th><th>Hours flown</th><th>Rolling total</th><th>Status</th></tr>
      </thead>
      <tbody>
        <tr v-for="p in points" :key="p.date">
          <td>{{ p.date }}</td>
          <td>{{ p.hours }}</td>
          <td>{{ p.rollingSum }}</td>
          <td>{{ [p.isToday && 'today', p.isFuture && 'projected', p.overLimit && 'over limit'].filter(Boolean).join(', ') || 'normal' }}</td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SummaryResponse } from '~/types/api'

const props = defineProps<{ summary: SummaryResponse }>()

// ---- Geometri (satuan viewBox) ----
const W = 340
const H = 240
const ML = 38
const MR = 14
const MT = 28
const MB = 40
const plotW = W - ML - MR
const plotH = H - MT - MB
const baseline = MT + plotH

const points = computed(() => props.summary.points)
const n = computed(() => points.value.length)
const colW = computed(() => (n.value > 1 ? plotW / (n.value - 1) : plotW))

const x = (i: number) => (n.value <= 1 ? ML + plotW / 2 : ML + (i * plotW) / (n.value - 1))
// yMax dari API sudah melebar jika ada nilai di atas batas; min() hanya pengaman.
const y = (v: number) => MT + plotH - (Math.min(v, props.summary.yMax) / props.summary.yMax) * plotH

const todayIdx = computed(() => {
  const i = points.value.findIndex((p) => p.isToday)
  return i < 0 ? n.value - 1 : i
})

// ---- Sumbu Y ----
const STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000]
const ticks = computed(() => {
  const max = props.summary.yMax
  const step = STEPS.find((s) => max / s <= 5) ?? max
  const out: number[] = []
  for (let v = 0; v <= max; v += step) out.push(v)
  return out
})

const limitY = computed(() => y(props.summary.limit))

// Label limit ditaruh di sisi (kiri/kanan) yang lebih jauh dari data,
// supaya tidak menimpa titik yang mendekati garis limit.
const limitLabelAnchor = computed<'start' | 'end'>(() => {
  const gap = (slice: typeof points.value) =>
    Math.min(...slice.map((p) => Math.abs(p.rollingSum - props.summary.limit)))
  const left = gap(points.value.slice(0, 4))
  const right = gap(points.value.slice(-4))
  return right >= left ? 'end' : 'start'
})
const limitLabelX = computed(() => (limitLabelAnchor.value === 'end' ? W - MR : ML + 4))

// ---- Jalur ----
const linePath = (from: number, to: number) =>
  points.value
    .slice(from, to + 1)
    .map((p, k) => `${k ? 'L' : 'M'}${x(from + k).toFixed(1)} ${y(p.rollingSum).toFixed(1)}`)
    .join(' ')

const pastPath = computed(() => linePath(0, todayIdx.value))
const futurePath = computed(() => (todayIdx.value < n.value - 1 ? linePath(todayIdx.value, n.value - 1) : ''))
const areaPath = computed(() =>
  n.value > 1 ? `${pastPath.value} L${x(todayIdx.value).toFixed(1)} ${baseline} L${x(0).toFixed(1)} ${baseline} Z` : '',
)

// ---- Interaksi ----
const active = ref(todayIdx.value)
watch(
  () => props.summary,
  () => (active.value = todayIdx.value),
)

const move = (delta: number) => {
  active.value = Math.min(n.value - 1, Math.max(0, active.value + delta))
}

const selected = computed(() => points.value[active.value])

const tags = computed(() => {
  const p = selected.value
  if (!p) return []
  const out: { text: string; tone: 'navy' | 'muted' | 'danger' }[] = []
  if (p.isToday) out.push({ text: 'Today', tone: 'navy' })
  if (p.isFuture) out.push({ text: 'Projected', tone: 'muted' })
  if (p.overLimit) out.push({ text: `Over ${props.summary.limit} h limit`, tone: 'danger' })
  return out
})

const monthName = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' })

const ariaLabel = computed(() => {
  const peak = Math.max(...points.value.map((p) => p.rollingSum))
  const over = points.value.filter((p) => p.overLimit).length
  return (
    `Rolling ${props.summary.windowDays}-day flight hours from ${points.value[0]?.date} to ${points.value[n.value - 1]?.date}. ` +
    `Limit ${props.summary.limit} hours, peak ${peak} hours` +
    (over ? `, ${over} day${over > 1 ? 's' : ''} over the limit.` : '.')
  )
})
</script>

<style scoped lang="scss">
.chart {
  &__plot {
    border-radius: $radius-md;
    @include focus-ring;
  }

  &__svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
    -webkit-tap-highlight-color: transparent;
  }

  &__future {
    fill: rgba($navy, 0.035);
  }

  &__grid {
    stroke: #eceef2;
    stroke-width: 1;
  }

  &__tick,
  &__x,
  &__month {
    fill: $text-2;
    font-size: 10px;
    font-variant-numeric: tabular-nums;
  }

  &__x--today {
    fill: $navy;
    font-weight: 800;
  }

  &__month {
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
  }

  &__area {
    fill: rgba($chart, 0.14);
  }

  &__line {
    fill: none;
    stroke: $chart;
    stroke-width: 2.75;
    stroke-linecap: round;
    stroke-linejoin: round;

    &--future {
      stroke-dasharray: 2 6;
      opacity: 0.9;
    }
  }

  &__limit {
    stroke: $red;
    stroke-width: 1.5;
  }

  &__limit-label {
    fill: $danger-text;
    font-size: 10px;
    font-weight: 700;
    // Garis tepi putih agar label tetap terbaca di atas garis/titik lain.
    paint-order: stroke;
    stroke: #fff;
    stroke-width: 3px;
    stroke-linejoin: round;
  }

  &__today {
    stroke: $navy;
    stroke-width: 1;
    stroke-dasharray: 3 3;
    opacity: 0.45;
  }

  &__today-label {
    fill: $navy;
    font-size: 10px;
    font-weight: 700;
  }

  &__dot {
    fill: #fff;
    stroke: $chart;
    stroke-width: 2;
    transition: r 0.12s ease;

    &--over {
      fill: $danger;
      stroke: $danger;
    }
    &--today {
      stroke: $navy;
    }
    &--active {
      stroke: $navy;
      stroke-width: 2.5;
    }
  }

  &__hit {
    fill: transparent;
    cursor: pointer;
  }

  &__legend {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin: 6px 0 0;
    padding: 0;
    list-style: none;
    font-size: 11.5px;
    color: $text-2;

    li {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }

  &__key {
    display: inline-block;
    width: 18px;
    height: 0;
    border-top: 3px solid $chart;
    border-radius: 2px;

    &--projected {
      border-top-style: dotted;
    }
    &--limit {
      border-top: 2px solid $red;
    }
  }
}

.detail {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 12px;
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: $radius-md;
  background: $bg;

  &__date {
    font-weight: 700;
    font-size: 13.5px;
  }

  &__sub {
    font-size: 12px;
    color: $text-2;

    strong {
      color: $text;
    }
  }

  &__right {
    text-align: right;
  }

  &__value {
    font-size: 22px;
    line-height: 1.15;

    &--over {
      color: $danger-text;
    }
  }

  &__tags {
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
}

.tag {
  padding: 2px 10px;
  border-radius: $radius-pill;
  font-size: 11px;
  font-weight: 700;

  &--navy {
    background: $navy;
    color: #fff;
  }
  &--muted {
    background: #e2e5ea;
    color: $text-2;
  }
  &--danger {
    background: rgba($danger, 0.12);
    color: $danger-text;
  }
}
</style>
