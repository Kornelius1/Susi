import type { LoginResponse } from '~/types/api'

export const useAuthStore = defineStore('auth', () => {
  // Token disimpan di cookie supaya bertahan saat halaman di-refresh.
  const token = useCookie<string | null>('susiair_token', {
    default: () => null,
    sameSite: 'lax',
    maxAge: 60 * 60, // selaras dengan masa berlaku token backend (1 jam)
    secure: import.meta.client && location.protocol === 'https:',
  })

  const isAuthenticated = computed(() => !!token.value)

  async function login(username: string, password: string) {
    const { request } = useApi()
    const res = await request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { username, password },
      auth: false,
    })
    token.value = res.accessToken
  }

  function logout() {
    token.value = null
    // Kosongkan data sesi agar tidak bocor ke pengguna berikutnya.
    usePilotStore().reset()
    useFlightHoursStore().reset()
    useDocumentsStore().reset()
    useSchedulesStore().reset()
    useClockStore().reset()
  }

  return { token, isAuthenticated, login, logout }
})
