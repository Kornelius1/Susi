<template>
  <ul v-if="items.length" class="docs">
    <li v-for="doc in items" :key="doc.id" class="doc">
      <span class="doc__icon" :class="`doc__icon--${doc.status}`" aria-hidden="true">
        <FileText :size="20" />
      </span>

      <div class="doc__main">
        <p class="doc__label">{{ doc.label }}</p>
        <p class="doc__date">
          {{ formatLongDate(doc.expiryDate) }}
          <template v-if="doc.status === 'expired' && doc.daysRemaining < 0"> · {{ -doc.daysRemaining }} days ago</template>
        </p>
      </div>

      <span class="badge" :class="`badge--${doc.status}`">
        <span class="badge__dot" aria-hidden="true" />
        {{ badgeText(doc) }}
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { FileText } from 'lucide-vue-next'
import type { DocumentItem } from '~/types/api'

defineProps<{ items: DocumentItem[] }>()

// Status (warna badge) datang dari API; frontend hanya memilih teksnya.
function badgeText(doc: DocumentItem): string {
  if (doc.status === 'expired') return 'Expired'
  if (doc.status === 'soon') return `${doc.daysRemaining} ${doc.daysRemaining === 1 ? 'day' : 'days'} left`
  return 'Valid'
}
</script>

<style scoped lang="scss">
.docs {
  @include card;
  margin: 0;
  padding: 4px 0;
  list-style: none;
}

.doc {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;

  & + & {
    border-top: 1px solid $border;
  }

  &__icon {
    flex: none;
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: $radius-md;

    &--safe {
      background: rgba($success, 0.14);
      color: $success-text;
    }
    &--soon {
      background: rgba($warning, 0.16);
      color: $warning-text;
    }
    &--expired {
      background: rgba($danger, 0.12);
      color: $danger-text;
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__label {
    font-weight: 700;
    font-size: 13.5px;
    line-height: 1.3;
  }

  &__date {
    font-size: 12px;
    color: $text-2;
  }
}

.badge {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px;
  border-radius: $radius-pill;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
  }

  &--safe {
    background: rgba($success, 0.14);
    color: $success-text;
  }
  &--soon {
    background: rgba($warning, 0.16);
    color: $warning-text;
  }
  &--expired {
    background: rgba($danger, 0.12);
    color: $danger-text;
  }
}
</style>
