<template>
  <div class="blank">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.blank {
  min-height: 100dvh;
  max-width: $shell-width;
  margin: 0 auto;
  background: $bg;
}
</style>
