import type { PilotProfile } from '~/types/api'

export const usePilotStore = defineStore('pilot', () => {
  const { request } = useApi()
  const profile = ref<PilotProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      profile.value = await request<PilotProfile>('/pilot/me')
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  function reset() {
    profile.value = null
    loading.value = false
    error.value = null
  }

  return { profile, loading, error, load, reset }
})
