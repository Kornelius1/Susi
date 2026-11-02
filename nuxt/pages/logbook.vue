<template>
  <div class="page">
    <h1 class="title">Logbook</h1>
    <section class="card">
      <BookOpen :size="32" aria-hidden="true" />
      <p>Logbook is coming soon.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next'

useHead({ title: 'Logbook · Susi Air Pilot Hub' })
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
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 20px;
  color: $text-2;
  font-weight: 600;
}
</style>
