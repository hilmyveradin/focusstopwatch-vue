<script setup>
import { ref, watch } from 'vue'
import { supabase } from '../supabase'
import SpinnerComponent from '../components/SpinnerComponent.vue'
import SuccessAlertComponent from '../components/SuccessAlertComponent.vue'
import ErrorAlertComponent from '../components/ErrorAlertComponnet.vue'

const isLoading = ref(false)
const isShowSuccessAlert = ref(false)
const isShowErrorAlert = ref(false)
const email = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    console.log(email.value)
    isLoading.value = true
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value
    })
    if (error) throw error
    isShowSuccessAlert.value = true
  } catch (error) {
    if (error instanceof Error) {
      isShowErrorAlert.value = true
      errorMessage.value = error.message
    }
  } finally {
    isLoading.value = false
  }
}

watch([isShowSuccessAlert, isShowErrorAlert], ([success, error]) => {
  if (success || error) {
    setTimeout(() => {
      isShowSuccessAlert.value = false
      isShowErrorAlert.value = false
    }, 2000)
  }
})
</script>

<template>
  <div class="flex items-center justify-center w-screen px-4 pt-12">
    <div
      class="flex flex-col items-center justify-center p-4 space-y-4 rounded-lg bg-astral-200 max-w-96"
    >
      <h1 class="text-xl font-bold text-astral-950">Sign In Using Email</h1>
      <h3 class="justify-center text-astral-800">
        Sign in will be done using verification link that will be sent to your email
      </h3>
      <input
        required
        type="email"
        class="w-full px-2 py-1 border border-gray-300 rounded"
        v-model="email"
      />
      <button
        class="w-40 h-12 p-2 text-center rounded-lg bg-astral-500 hover:bg-astral-400 text-astral-50"
        :disabled="isLoading"
        @click="handleLogin"
      >
        <SpinnerComponent v-if="isLoading" :is-loading="isLoading" />
        <span v-else>Send me email!</span>
      </button>
    </div>
  </div>
  <div class="fixed bottom-0 flex items-center justify-center w-full p-4 -translate-y-6">
    <div
      :class="{
        'translate-y-0': !isShowSuccessAlert || !isShowErrorAlert,
        'animate-bounce-once': isShowSuccessAlert || isShowErrorAlert
      }"
      class="transition-transform duration-100"
    >
      <SuccessAlertComponent
        v-if="isShowSuccessAlert"
        title="Email Sent!"
        body="Please check your email"
      />
      <ErrorAlertComponent v-if="isShowErrorAlert" title="Error!" :body="errorMessage" />
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce-once {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-bounce-once {
  animation-name: bounce-once;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
}
</style>
