/**
 * Menjadi true jika `loading` berlangsung lebih lama dari `delayMs`.
 * Dipakai untuk menjelaskan bahwa server gratis mungkin sedang bangun.
 */
export function useSlowLoading(loading: Ref<boolean>, delayMs = 4000) {
  const slow = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(
    loading,
    (isLoading) => {
      clearTimeout(timer)
      slow.value = false
      if (isLoading) timer = setTimeout(() => (slow.value = true), delayMs)
    },
    { immediate: true },
  )

  onScopeDispose(() => clearTimeout(timer))
  return slow
}
