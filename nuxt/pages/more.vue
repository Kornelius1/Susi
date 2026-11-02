<template>
  <div class="page">
    <h1 class="title">More</h1>

    <section class="card">
      <AppAvatar v-if="pilot.profile" :name="pilot.profile.name" :src="pilot.profile.avatarUrl" :size="48" />
      <div class="card__who">
        <p class="card__name">{{ pilot.profile?.name ?? 'Pilot' }}</p>
        <p class="card__sub">Signed in</p>
      </div>
    </section>

    <button type="button" class="out" @click="signOut">
      <LogOut :size="18" aria-hidden="true" />
      Sign out
    </button>
  </div>
</template>

<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'

useHead({ title: 'More · Susi Air Pilot Hub' })

const auth = useAuthStore()
const pilot = usePilotStore()

// Profil dibutuhkan di sini jika halaman dibuka langsung.
if (!pilot.profile) pilot.load()

async function signOut() {
  auth.logout()
  await navigateTo('/login')
}
</script>

<style scoped lang="scss">
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 16px 0;
}

.title {
  font-size: 22px;
  font-weight: 800;
}

.card {
  @include card;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;

  &__name {
    font-weight: 800;
  }

  &__sub {
    font-size: 12px;
    color: $text-2;
  }
}

.out {
  @include pill-button;
  @include focus-ring;
  background: $surface;
  color: $danger-text;
  box-shadow: $shadow-card;
}
</style>
