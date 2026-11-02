import type { ApiErrorBody } from '~/types/api'

interface RequestOptions {
  method?: 'GET' | 'POST'
  body?: Record<string, unknown>
  query?: Record<string, string | number>
  /** false = tanpa token (hanya untuk login). */
  auth?: boolean
}

/**
 * Satu-satunya pintu keluar ke backend.
 * - Menambahkan token Bearer.
 * - Mengubah semua kegagalan menjadi ApiError yang seragam.
 * - Mencoba ulang saat server gratis sedang "bangun" (502/503/504 atau jaringan).
 * - Jika token ditolak (401) saat sedang login, sesi dibersihkan dan kembali ke /login.
 */
export function useApi() {
  const baseURL = useRuntimeConfig().public.apiBase

  async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const auth = useAuthStore()
    const useToken = options.auth !== false

    try {
      return await $fetch<T>(path, {
        baseURL,
        method: options.method ?? 'GET',
        body: options.body,
        query: options.query,
        headers: useToken && auth.token ? { Authorization: `Bearer ${auth.token}` } : undefined,
        // Server gratis butuh sekitar 1 menit untuk bangun, jadi timeout dibuat panjang.
        timeout: 90_000,
        retry: 3,
        retryDelay: 4_000,
        retryStatusCodes: [502, 503, 504],
      })
    } catch (error) {
      const apiError = toApiError(error)

      // Sesi berakhir atau token tidak valid: bersihkan dan kembali ke login.
      if (apiError.status === 401 && useToken && auth.token) {
        auth.logout()
        await navigateTo({ path: '/login', query: { expired: '1' } })
      }
      throw apiError
    }
  }

  return { request }
}

function toApiError(error: unknown): ApiError {
  const e = error as { response?: { status: number; _data?: Partial<ApiErrorBody> }; data?: Partial<ApiErrorBody> }
  const status = e.response?.status ?? null

  if (status === null) {
    return new ApiError(
      'Cannot reach the server. Check your connection and try again.',
      null,
    )
  }

  const body = e.response?._data ?? e.data
  const message = body?.message || 'Something went wrong. Please try again.'
  return new ApiError(message, status, body?.details ?? [])
}
