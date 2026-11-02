import type { SchedulesResponse } from '~/types/api'

export const useSchedulesStore = defineStore('schedules', () => {
  const { request } = useApi()

  const year = ref(0)
  const month = ref(0)
  const data = ref<SchedulesResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  let latestRequest = 0

  /** Setiap perubahan bulan memanggil /schedules?year=YYYY&month=MM. */
  async function load(targetYear: number, targetMonth: number) {
    year.value = targetYear
    month.value = targetMonth
    const requestId = ++latestRequest
    loading.value = true
    error.value = null
    try {
      const res = await request<SchedulesResponse>('/schedules', {
        query: { year: targetYear, month: targetMonth },
      })
      if (requestId !== latestRequest) return
      data.value = res
      useClockStore().setToday(res.today)
    } catch (e) {
      if (requestId !== latestRequest) return
      error.value = (e as Error).message
    } finally {
      if (requestId === latestRequest) loading.value = false
    }
  }

  /** Pertama kali dibuka: tampilkan bulan dari "hari ini" milik server. */
  async function init() {
    if (year.value) return load(year.value, month.value)
    try {
      const today = await useClockStore().ensureToday()
      const [y, m] = today.split('-').map(Number) as [number, number]
      await load(y, m)
    } catch (e) {
      error.value = (e as Error).message
    }
  }

  const goTo = (delta: number) => {
    const next = shiftMonth(year.value, month.value, delta)
    return load(next.year, next.month)
  }

  function reset() {
    latestRequest++
    year.value = 0
    month.value = 0
    data.value = null
    loading.value = false
    error.value = null
  }

  return { year, month, data, loading, error, init, load, next: () => goTo(1), prev: () => goTo(-1), reset }
})
