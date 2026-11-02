/** Penjaga rute: halaman selain /login butuh token, dan /login ditutup jika sudah masuk. */
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  if (!auth.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }
  if (auth.isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})
