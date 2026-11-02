<template>
  <div class="login">
    <div class="login__brand">
      <AppLogo :height="44" />
      <p class="login__tag">Pilot Hub</p>
    </div>

    <form class="login__card" novalidate @submit.prevent="submit">
      <h1 class="login__title">Sign in</h1>
      <p class="login__lead">Use your pilot account to view hours, documents and schedule.</p>

      <p v-if="expired && !error" class="notice" role="status">Your session has expired. Please sign in again.</p>

      <div class="field">
        <label for="username">Username</label>
        <input
          id="username"
          v-model="username"
          type="text"
          autocomplete="username"
          autocapitalize="none"
          spellcheck="false"
          :disabled="submitting"
          :aria-invalid="!!error"
          :aria-describedby="error ? 'login-error' : undefined"
        />
      </div>

      <div class="field">
        <label for="password">Password</label>
        <div class="field__wrap">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            :disabled="submitting"
            :aria-invalid="!!error"
            :aria-describedby="error ? 'login-error' : undefined"
          />
          <button
            type="button"
            class="field__toggle"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            :aria-pressed="showPassword"
            @click="showPassword = !showPassword"
          >
            <EyeOff v-if="showPassword" :size="18" />
            <Eye v-else :size="18" />
          </button>
        </div>
      </div>

      <p v-if="error" id="login-error" class="login__error" role="alert">
        <CircleAlert :size="16" aria-hidden="true" /> {{ error }}
      </p>

      <ColdStartHint v-if="slow" />

      <button class="login__submit" type="submit" :disabled="submitting">
        <LoaderCircle v-if="submitting" class="spin" :size="18" aria-hidden="true" />
        {{ submitting ? 'Signing in…' : 'Sign in' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { CircleAlert, Eye, EyeOff, LoaderCircle } from 'lucide-vue-next'

definePageMeta({ layout: 'blank' })
useHead({ title: 'Sign in · Susi Air Pilot Hub' })

const auth = useAuthStore()
const route = useRoute()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const submitting = ref(false)
const error = ref('')
const slow = useSlowLoading(submitting)

const expired = computed(() => route.query.expired === '1')

async function submit() {
  error.value = ''
  if (!username.value.trim() || !password.value) {
    error.value = 'Please enter your username and password.'
    return
  }

  submitting.value = true
  try {
    await auth.login(username.value.trim(), password.value)
    await navigateTo('/')
  } catch (e) {
    const err = e as ApiError
    error.value =
      err.status === 401
        ? 'Incorrect username or password. Please check your details and try again.'
        : err.message
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100dvh;
  padding: 24px 20px;
  gap: 28px;

  &__brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  &__tag {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: $text-2;
  }

  &__card {
    @include card;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px 20px;
  }

  &__title {
    font-size: 22px;
    font-weight: 800;
  }

  &__lead {
    margin-top: -10px;
    color: $text-2;
    font-size: 13px;
  }

  &__error {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px;
    border-radius: $radius-md;
    background: rgba($danger, 0.1);
    color: $danger-text;
    font-weight: 600;
    font-size: 13px;

    svg {
      flex: none;
      margin-top: 2px;
    }
  }

  &__submit {
    @include pill-button;
    @include focus-ring;
    margin-top: 4px;
    background: $red;
    color: #fff;
    width: 100%;
  }
}

.notice {
  padding: 10px 12px;
  border-radius: $radius-md;
  background: rgba($warning, 0.14);
  color: $warning-text;
  font-size: 13px;
  font-weight: 600;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    font-weight: 700;
  }

  input {
    width: 100%;
    padding: 13px 14px;
    border: 1.5px solid $border;
    border-radius: $radius-md;
    background: $surface;
    font-size: 16px; // 16px mencegah zoom otomatis di iOS
    transition: border-color 0.15s ease;

    &:focus {
      outline: none;
      border-color: $navy;
      box-shadow: 0 0 0 3px rgba($chart, 0.35);
    }

    &[aria-invalid='true'] {
      border-color: $danger;
    }
  }

  &__wrap {
    position: relative;

    input {
      padding-right: 46px;
    }
  }

  &__toggle {
    position: absolute;
    top: 50%;
    right: 6px;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    transform: translateY(-50%);
    color: $text-2;
    border-radius: 50%;
    @include focus-ring;
  }
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
