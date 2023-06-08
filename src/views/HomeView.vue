<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase.js'
import SpinnerComponent from '../components/SpinnerComponent.vue'
import WarningAlertComponent from '../components/WarningAlertComponent.vue'

const isMenuOpen = ref(false)
const isShowWarningAlert = ref(false)
const isLoading = ref(false)

const session = ref(null)
const totalCounter = ref(0)
const secondCounter = ref(0)
const minuteCounter = ref(0)
const hourCounter = ref(0)
const intervalId = ref(null)
const buttonText = ref('Start')
const laps = ref([])


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

const reportClicked = () =>  {
  isShowWarningAlert.value = true
}

watch([isShowWarningAlert], ([success, error]) => {
  if (success || error) {
    setTimeout(() => {
      isShowWarningAlert.value = false;
    }, 2000);
  }
});
</script>

<template>
  <div>
    <div class="flex flex-col items-center justify-center w-screen pt-4">
      <div class="flex-col w-9/12 rounded-xl">
        <div class="flex items-center justify-between h-12 bg-astral-500 rounded-t-xl">
          <h1 class="ml-4 text-astral-50 flex-start">FocusStopwatch.com</h1>
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
                    class="block px-4 py-2 text-sm text-center rounded-md cursor-pointer text-astral-50 hover:bg-astral-400 hover:text-white" @click="reportClicked"
                  >
                    Report
                  </li>
                  <li
                    class="block text-sm rounded-md cursor-pointer text-astral-50 hover:bg-astral-400 hover:text-white"
                  >
                    <SpinnerComponent v-if="isLoading" :is-loading="isLoading" />
                    <button class="w-full h-full px-4 py-2" v-else-if="session" @click="signOut">
                      <span class="text-left text-astral-50">Sign Out</span>
                    </button>
                    <button class="w-full h-full px-4 py-2" v-else @click="goToSignIn">
                      <span class="text-left text-astral-50">Sign In</span>
                    </button>
                  </li>
                </ul>
              </div>
            </li>
            <li
              class="hidden w-20 text-sm rounded-md cursor-pointer text-astral-50 hover:bg-astral-400 hover:text-white sm:block h-9" @click="reportClicked"
            >
              <div class="flex flex-col items-center justify-center h-full">
                <button class="w-full h-full">Report</button>
              </div>
            </li>
            <li
              class="hidden w-20 text-sm rounded-md cursor-pointer text-astral-50 hover:bg-astral-400 hover:text-white sm:block h-9"
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
        <div class="flex flex-col items-center justify-center py-20 space-y-5 rounded-b-lg bg-astral-200">
          <div class="flex justify-center space-x-5">
            <div class="flex items-center justify-center w-16 h-20 text-xl text-white rounded-lg bg-astral-800 sm:h-24 sm:w-22 sm:text-4xl">{{ formattedHour }}</div>
            <div class="flex items-center justify-center w-16 h-20 text-xl text-white rounded-lg bg-astral-800 sm:h-24 sm:w-22 sm:text-4xl">{{ formattedMinute }}</div>
            <div class="flex items-center justify-center w-16 h-20 text-xl text-white rounded-lg bg-astral-800 sm:h-24 sm:w-22 sm:text-4xl">{{ formattedSecond }}</div>
          </div>
          <button class="px-16 py-2 rounded-lg bg-astral-500 text-astral-50 hover:bg-astral-400" @click="startButton">{{ buttonText }}</button>
          <ul v-if="laps.length > 0">
            <div class="p-2 my-2 border rounded bg-astral-50 border-astral-700">
              <li v-for="(lap, index) in laps" :key="index">
                <div class="flex flex-row p-2 my-2 border rounded border-astral-700">
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
  <div class="fixed bottom-0 flex items-center justify-center w-full p-4 -translate-y-6">
    <div
:class="{ 'translate-y-0': !isShowWarningAlert, 'animate-bounce-once': isShowWarningAlert }"
      class="transition-transform duration-100">
    <WarningAlertComponent v-if="isShowWarningAlert" title="Coming Soon!" body="This feature is still under construction 😉" />
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
