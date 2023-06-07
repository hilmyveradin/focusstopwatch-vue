<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import SpinnerComponent from '../components/SpinnerComponent.vue'
import SuccessAlertComponent from '../components/SuccessAlertComponent.vue';

const isLoading = ref(false)
const isShowSuccessAlert = ref(true)
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
  <div class="fixed bottom-0 flex items-center justify-center w-full p-4">
    <SuccessAlertComponent v-if="isShowSuccessAlert" title="Email Sent!" body="Please check your email"/>
    <!-- <transition
enter-active-class="transition duration-300 ease-out transform" enter-class="translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-300 ease-in transform"
      leave-class="translate-y-0 opacity-100" leave-to-class="translate-y-4 opacity-0">
      <SuccessAlertComponent v-if="isShowSuccessAlert" title="Email Sent!" body="Please check your email" />
    </transition> -->
  </div>

</template>
