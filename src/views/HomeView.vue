<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase.js'
import SpinnerComponent from '../components/SpinnerComponent.vue'

const session = ref(null)
const totalCounter = ref(0)
const secondCounter = ref(0)
const minuteCounter = ref(0)
const hourCounter = ref(0)
const intervalId = ref(null)
const buttonText = ref('Start')
const laps = ref([])
const isMenuOpen = ref(false)

const isLoading = ref(false)

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})

const formattedSecond = computed(() => secondCounter.value.toString().padStart(2, '0'))
const formattedMinute = computed(() => minuteCounter.value.toString().padStart(2, '0'))
const formattedHour = computed(() => hourCounter.value.toString().padStart(2, '0'))

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const formattedLaps = (index) => {
  const lap = laps.value[index]
  const hours = Math.floor(lap / 3600)
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((lap % 3600) / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (lap % 60).toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

const startButton = () => {
  if (intervalId.value !== null) {
    secondCounter.value = 0
    minuteCounter.value = 0
    hourCounter.value = 0
    clearInterval(intervalId.value)
    intervalId.value = null
    buttonText.value = 'Start'
    laps.value.push(totalCounter.value)
    totalCounter.value = 0
  } else {
    buttonText.value = 'Reset and Lap'
    intervalId.value = setInterval(() => {
      secondCounter.value += 1
      totalCounter.value += 1
      if (secondCounter.value === 60) {
        secondCounter.value = 0
        minuteCounter.value += 1
      }
      if (minuteCounter.value === 60) {
        minuteCounter.value = 0
        hourCounter.value += 1
      }
    }, 1000)
  }
}

const router = useRouter()
const goToSignIn = () => {
  router.push({ name: 'SignIn' })
}

async function signOut() {
  isLoading.value = true
  try {
    let { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex flex-col items-center justify-center w-screen mt-4">
      <div class="flex-col w-9/12">
        <div class="flex items-center justify-between h-12 bg-slate-100">
          <h1 class="ml-4 flex-start">focusStopwatch.com</h1>
          <ul class="flex mr-4">
            <li class="relative sm:hidden">
              <button @click="toggleMenu">
                <svg
                  class="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
              <div
                v-if="isMenuOpen"
                class="absolute right-0 w-48 py-2 mt-2 bg-white rounded-lg shadow-xl"
              >
                <ul>
                  <li
                    class="block px-4 py-2 text-sm text-center text-gray-700 cursor-pointer hover:bg-blue-500 hover:text-white"
                  >
                    Report
                  </li>
                  <li
                    class="block text-sm text-gray-700 cursor-pointer hover:bg-blue-500 hover:text-white"
                  >
                    <SpinnerComponent v-if="isLoading" :is-loading="isLoading" />
                    <button class="w-full h-full px-4 py-2" v-else-if="session" @click="signOut">
                      <span class="text-left">Sign Out</span>
                    </button>
                    <button class="w-full h-full px-4 py-2" v-else @click="goToSignIn">
                      <span class="text-left">Sign In</span>
                    </button>
                  </li>
                </ul>
              </div>
            </li>
            <li
              class="hidden w-20 text-sm text-gray-700 cursor-pointer hover:bg-blue-500 hover:text-white sm:block h-9"
            >
              <div class="flex flex-col items-center justify-center h-full">
                <button class="w-full h-full">Report</button>
              </div>
            </li>
            <li
              class="hidden w-20 text-sm text-gray-700 cursor-pointer hover:bg-blue-500 hover:text-white sm:block h-9"
            >
              <div class="flex flex-col items-center justify-center h-full" v-if="isLoading">
                <SpinnerComponent :is-loading="isLoading" />
              </div>
              <button class="w-full h-full px-4 py-2" v-else-if="session" @click="signOut">
                <span>Sign Out</span>
              </button>
              <button class="w-full h-full px-4 py-2" v-else @click="goToSignIn">
                <span>Sign In</span>
              </button>
            </li>
          </ul>
        </div>
        <div class="flex flex-col items-center justify-center py-20 space-y-5 bg-blue-500">
          <div class="flex justify-center space-x-5">
            <div class="p-5 text-white bg-black rounded-lg">{{ formattedHour }}</div>
            <div class="p-5 text-white bg-black rounded-lg">{{ formattedMinute }}</div>
            <div class="p-5 text-white bg-black rounded-lg">{{ formattedSecond }}</div>
          </div>
          <button class="bg-red-500" @click="startButton">{{ buttonText }}</button>
          <ul v-if="laps.length > 0">
            <div class="p-2 my-2 bg-white border border-gray-500 rounded">
              <li v-for="(lap, index) in laps" :key="index">
                <div class="flex flex-row p-2 my-2 border border-gray-500 rounded">
                  <div class="w-14">Lap {{ index + 1 }}</div>
                  <div class="separator" />
                  <div>
                    {{ formattedLaps(index) }}
                  </div>
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.separator {
  border-left: 1px solid black;
  margin: 0 8px;
}

.pop-out {
  transform: translateX(0.5rem);
  transition: transform 0.3s ease;
}
</style>
