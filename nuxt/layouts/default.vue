<template>
  <div class="shell">
    <main class="shell__main">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>

<style scoped lang="scss">
.shell {
  max-width: $shell-width;
  min-height: 100dvh;
  margin: 0 auto;
  background: $bg;

  &__main {
    // Ruang agar konten terakhir tidak tertutup navigasi bawah.
    padding-bottom: calc(#{$nav-height} + 24px + env(safe-area-inset-bottom));
  }
}
</style>
