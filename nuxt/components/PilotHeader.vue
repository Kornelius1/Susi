<template>
  <header class="head">
    <div class="head__bar">
      <AppLogo :height="30" />
    </div>

    <div class="head__card">
      <template v-if="profile">
        <AppAvatar :name="profile.name" :src="profile.avatarUrl" :size="56" />
        <div class="head__who">
          <p class="head__greeting">Welcome back,</p>
          <h1 class="head__name">{{ profile.name }}</h1>
        </div>
        <div class="head__hours">
          <span class="head__hours-label">Total flight hours</span>
          <span class="head__hours-value num">{{ formatHours(profile.totalFlightHours) }}<small> h</small></span>
        </div>
      </template>
      <template v-else-if="error">
        <p class="head__error" role="alert">{{ error }}</p>
      </template>
      <template v-else>
        <SkeletonBlock :height="56" class="head__skeleton" />
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { PilotProfile } from '~/types/api'

defineProps<{ profile: PilotProfile | null; error?: string | null }>()
</script>

<style scoped lang="scss">
.head {
  &__bar {
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 20px;
    background: $surface;
    border-bottom: 1px solid $border;
  }

  &__card {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 4px 14px;
    padding: 20px;
    background: $navy;
    color: #fff;
    border-radius: 0 0 24px 24px;
  }

  &__who {
    min-width: 0;
  }

  &__greeting {
    font-size: 13px;
    color: rgba(#fff, 0.7);
  }

  &__name {
    font-size: 20px;
    font-weight: 800;
    line-height: 1.2;
    overflow-wrap: anywhere;
  }

  &__hours {
    grid-column: 1 / -1;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-top: 14px;
    padding: 12px 14px;
    border-radius: $radius-md;
    background: rgba(#fff, 0.08);
  }

  &__hours-label {
    font-size: 12.5px;
    color: rgba(#fff, 0.75);
    font-weight: 500;
  }

  &__hours-value {
    font-size: 24px;
    color: #fff;

    small {
      font-size: 13px;
      font-weight: 600;
      color: rgba(#fff, 0.7);
    }
  }

  &__error {
    grid-column: 1 / -1;
    color: #ffd0d8;
  }

  &__skeleton {
    grid-column: 1 / -1;
    opacity: 0.25;
  }
}
</style>
