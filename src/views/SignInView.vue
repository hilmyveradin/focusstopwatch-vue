<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const loading = ref(false)
const email = ref('')

const handleLogin = async () => {
  try {
    console.log(email.value);
    loading.value = true
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
    })
    if (error) throw error
    alert('Check your email for the login link!')
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center w-screen mt-12">
    <div class="flex flex-col items-center justify-center p-4 space-y-4 bg-blue-100 rounded-lg w-96">
      <h1 class="text-xl font-bold">Sign In Using Email</h1>
      <h3 clsss="jusitfy-center"> Sign in will be done using verivication link that will be sent to your email</h3>
      <input required type="email" class="w-full px-2 py-1 border border-gray-300 rounded" v-model="email"/>
      <button class="p-2 text-center bg-red-100 rounded-lg" @click="handleLogin"> Send me email! </button>
    </div>
  </div>
</template>
