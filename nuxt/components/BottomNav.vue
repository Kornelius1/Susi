<template>
  <nav class="nav" aria-label="Main navigation">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="nav__item"
      :class="{ 'nav__item--active': isActive(item.to) }"
      :aria-current="isActive(item.to) ? 'page' : undefined"
    >
      <component :is="item.icon" :size="22" :stroke-width="isActive(item.to) ? 2.4 : 2" />
      <span>{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { BookOpen, CalendarDays, Ellipsis, House } from 'lucide-vue-next'

const route = useRoute()

const items = [
  { to: '/', label: 'Home', icon: House },
  { to: '/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/logbook', label: 'Logbook', icon: BookOpen },
  { to: '/more', label: 'More', icon: Ellipsis },
]

const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
</script>

<style scoped lang="scss">
.nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: min(100%, #{$shell-width});
  height: calc(#{$nav-height} + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  transform: translateX(-50%);
  background: $surface;
  border-top: 1px solid $border;
  box-shadow: 0 -4px 16px rgba($navy, 0.06);

  &__item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: $text-2;
    font-size: 11px;
    font-weight: 600;
    @include focus-ring;

    &--active {
      color: $navy;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        width: 28px;
        height: 3px;
        border-radius: 0 0 4px 4px;
        background: $red;
      }
    }
  }
}
</style>
