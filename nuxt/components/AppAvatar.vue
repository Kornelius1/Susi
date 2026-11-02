<template>
  <span class="avatar" :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.38}px` }">
    <img v-if="src && !failed" :src="src" :alt="`${name} avatar`" @error="failed = true" />
    <span v-else aria-hidden="true">{{ initials(name) }}</span>
  </span>
</template>

<script setup lang="ts">
// Jika gambar gagal dimuat, tampilkan inisial nama sebagai cadangan.
const props = withDefaults(defineProps<{ name: string; src?: string; size?: number }>(), { size: 48 })
const failed = ref(false)
watch(() => props.src, () => (failed.value = false))
</script>

<style scoped lang="scss">
.avatar {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  background: $navy;
  color: #fff;
  font-weight: 700;
  border: 2px solid #fff;
  box-shadow: $shadow-card;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
