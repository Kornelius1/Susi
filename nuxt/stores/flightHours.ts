import type { LimitCard, RangeKey, SummaryResponse } from '~/types/api'

export const RANGE_OPTIONS: RangeKey[] = ['1w', '1m', '3m', '6m', '1y']

export const useFlightHoursStore = defineStore('flightHours', () => {
  const { request } = useApi()

  const range = ref<RangeKey>('1w') // default sesuai brief
  const summary = ref<SummaryResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Kartu tidak bergantung pada range, jadi disimpan terpisah agar tidak
  // berkedip saat pengguna berpindah toggle.
  const cards = ref<LimitCard[]>([])

  let latestRequest = 0

  async function load(next: RangeKey = range.value) {
    range.value = next
    const requestId = ++latestRequest
    loading.value = true
    error.value = null
    try {
      const res = await request<SummaryResponse>('/flight-hours/summary', { query: { range: next } })
      if (requestId !== latestRequest) return // sudah ada permintaan yang lebih baru
      summary.value = res
      cards.value = res.cards
      useClockStore().setToday(res.asOf)
    } catch (e) {
      if (requestId !== latestRequest) return
      error.value = (e as Error).message
    } finally {
      if (requestId === latestRequest) loading.value = false
    }
  }

  function reset() {
    latestRequest++
    range.value = '1w'
    summary.value = null
    cards.value = []
    loading.value = false
    error.value = null
  }

  return { range, summary, cards, loading, error, load, reset }
})
