import type { DocumentsResponse } from '~/types/api'

export const useDocumentsStore = defineStore('documents', () => {
  const { request } = useApi()
  const data = ref<DocumentsResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      data.value = await request<DocumentsResponse>('/documents')
      useClockStore().setToday(data.value.asOf)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  function reset() {
    data.value = null
    loading.value = false
    error.value = null
  }

  return { data, loading, error, load, reset }
})
