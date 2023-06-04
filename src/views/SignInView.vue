<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import SpinnerComponent from '../components/SpinnerComponent.vue'

const isLoading = ref(false)
const email = ref('')

const handleLogin = async () => {
  try {
    console.log(email.value)
    isLoading.value = true
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value
    })
    if (error) throw error
    alert('Check your email for the login link!')
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center w-screen px-4 mt-12">
    <div
      class="flex flex-col items-center justify-center p-4 space-y-4 bg-blue-100 rounded-lg max-w-96"
    >
      <h1 class="text-xl font-bold">Sign In Using Email</h1>
      <h3 class="justify-center">
        Sign in will be done using verification link that will be sent to your email
      </h3>
      <input
        required
        type="email"
        class="w-full px-2 py-1 border border-gray-300 rounded"
        v-model="email"
      />
      <button
        class="w-40 h-12 p-2 text-center bg-red-100 rounded-lg"
        :disabled="isLoading"
        @click="handleLogin"
      >
        <SpinnerComponent v-if="isLoading" :is-loading="isLoading" />
        <span v-else>Send me email!</span>
      </button>
    </div>
  </div>
</template>
