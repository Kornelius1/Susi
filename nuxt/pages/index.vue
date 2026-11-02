<template>
  <div>
    <PilotHeader :profile="pilot.profile" :error="pilot.error" />

    <div class="page">
      <ColdStartHint v-if="slow" />

      <!-- Hours to Limit -->
      <section class="section" aria-labelledby="limit-title">
        <h2 id="limit-title" class="section__title">Hours to Limit</h2>

        <StateMessage
          v-if="flight.error && !flight.cards.length"
          :message="flight.error"
          retry
          @retry="flight.load()"
        />
        <template v-else>
          <LimitCards :cards="flight.cards" />

          <div class="trend">
            <div class="trend__head">
              <div>
                <h3 class="trend__title">Flight hours trend</h3>
                <p class="trend__sub">
                  <template v-if="flight.summary">
                    Rolling {{ flight.summary.windowDays }}-day total · limit {{ flight.summary.limit }} h
                  </template>
                  <template v-else>Loading…</template>
                </p>
              </div>
            </div>

            <RangeToggle
              :model-value="flight.range"
              :options="RANGE_OPTIONS"
              @update:model-value="flight.load($event)"
            />

            <div class="trend__body" :class="{ 'trend__body--busy': flight.loading && flight.summary }">
              <StateMessage v-if="flight.error" :message="flight.error" retry @retry="flight.load()" />
              <FlightHoursChart v-else-if="flight.summary" :summary="flight.summary" />
              <SkeletonBlock v-else :height="300" />
            </div>
          </div>
        </template>
      </section>

      <!-- My Documents -->
      <section class="section" aria-labelledby="docs-title">
        <h2 id="docs-title" class="section__title">My Documents</h2>

        <StateMessage v-if="documents.error" :message="documents.error" retry @retry="documents.load()" />
        <DocumentList v-else-if="documents.data" :items="documents.data.documents" />
        <SkeletonBlock v-else :height="260" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Home · Susi Air Pilot Hub' })

const pilot = usePilotStore()
const flight = useFlightHoursStore()
const documents = useDocumentsStore()

// Tiga bagian dimuat paralel dan gagal/berhasil sendiri-sendiri.
pilot.load()
flight.load()
documents.load()

const initialLoading = computed(
  () => (pilot.loading && !pilot.profile) || (flight.loading && !flight.summary) || (documents.loading && !documents.data),
)
const slow = useSlowLoading(initialLoading)
</script>

<style scoped lang="scss">
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px 16px 0;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__title {
    font-size: 17px;
    font-weight: 800;
  }
}

.trend {
  @include card;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 14px 14px;

  &__title {
    font-size: 15px;
    font-weight: 800;
  }

  &__sub {
    font-size: 12px;
    color: $text-2;
  }

  &__body {
    transition: opacity 0.15s ease;

    &--busy {
      opacity: 0.5;
    }
  }
}
</style>
