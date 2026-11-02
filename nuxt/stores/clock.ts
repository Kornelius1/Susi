/**
 * "Hari ini" versi server (APP_TODAY). Frontend tidak pernah memakai jam
 * browser untuk menentukan hari ini; nilainya selalu dari respons API.
 */
export const useClockStore = defineStore('clock', () => {
  const today = ref<string | null>(null)

  function setToday(value: string) {
    today.value = value
  }

  /** Memastikan "hari ini" diketahui (mis. saat membuka /schedule langsung). */
  async function ensureToday(): Promise<string> {
    if (!today.value) await useDocumentsStore().load()
    if (!today.value) throw new ApiError('Could not determine the current date.', null)
    return today.value
  }

  function reset() {
    today.value = null
  }

  return { today, setToday, ensureToday, reset }
})
