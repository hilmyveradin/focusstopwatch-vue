<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase.js'
import moment from 'moment'
import SpinnerComponent from '../components/SpinnerComponent.vue'
import WarningAlertComponent from '../components/WarningAlertComponent.vue'
import ReportComponent from '../components/ReportComponent.vue'

const isMenuOpen = ref(false)
const isShowWarningAlert = ref(false)
const isLoading = ref(false)
const isShowPopUp = ref(false)

const dialyFocusTime = ref(0)
const weeklyFocusTime = ref(0)
const monthlyFocusTime = ref(0)

const session = ref(null)
const totalCounter = ref(0)
const secondCounter = ref(0)
const minuteCounter = ref(0)
const hourCounter = ref(0)
const intervalId = ref(null)
const buttonText = ref('Start')
const laps = ref([])
const lapCounter = ref(0)

const sessionName = ref('')

const startTimeStamp = ref(null)

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

const formattedLaps = (value) => {
  const hours = Math.floor(value / 3600)
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((value % 3600) / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (value % 60).toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

let startTime = null
let elapsedTime = 0

const startButton = () => {
  if (intervalId.value !== null) {
    buttonText.value = 'Start'
    if (laps.value.length === 0) {
      startTimeStamp.value = new Date()
    }
    elapsedTime = Date.now() - Date.now()
    secondCounter.value = Math.floor((elapsedTime / 1000) % 60)
    minuteCounter.value = Math.floor((elapsedTime / 1000 / 60) % 60)
    hourCounter.value = Math.floor(elapsedTime / 1000 / 60 / 60)
    clearInterval(intervalId.value)
    intervalId.value = null
    const tempDictionary = {
      key: sessionName.value === '' ? `Laps ${lapCounter.value}` : sessionName.value,
      value: totalCounter.value
    };    
    laps.value.push(tempDictionary)
    totalCounter.value = 0
    sessionName.value = ''
  } else {
    lapCounter.value += 1
    buttonText.value = 'Reset and Lap'
    startTime = Date.now() - elapsedTime
    intervalId.value = setInterval(() => {
      elapsedTime = Date.now() - startTime
      secondCounter.value = Math.floor((elapsedTime / 1000) % 60)
      minuteCounter.value = Math.floor((elapsedTime / 1000 / 60) % 60)
      hourCounter.value = Math.floor(elapsedTime / 1000 / 60 / 60)
      totalCounter.value = hourCounter.value * 3600 + minuteCounter.value * 60 + secondCounter.value
    }, 1000)
  }
}

// async functions

async function getTotalMinutesToday(userId) {
    const today = moment().startOf('day').toISOString();
    const tomorrow = moment().startOf('day').add(1, 'days').toISOString();
    
    const { data, error } = await supabase
        .from('time_entries')
        .select('duration')
        .eq('user_id', userId)
        .gte('start_time', today)
        .lt('start_time', tomorrow);

    if (error) {
        console.error(`Error fetching total minutes today:`, error);
        return null;
    } else {
        const totalMinutes = data.reduce((a, b) => a + (b['duration'] || 0), 0);
        console.log(`Total minutes today:`, totalMinutes);
        return totalMinutes;
    }
}

async function getTotalMinutesThisWeek(userId) {
    const startOfWeek = moment().startOf('week').toISOString();
    const startOfNextWeek = moment().startOf('week').add(1, 'weeks').toISOString();
    
    const { data, error } = await supabase
        .from('time_entries')
        .select('duration')
        .eq('user_id', userId)
        .gte('start_time', startOfWeek)
        .lt('start_time', startOfNextWeek);

    if (error) {
        console.error(`Error fetching total minutes this week:`, error);
        return null;
    } else {
        const totalMinutes = data.reduce((a, b) => a + (b['duration'] || 0), 0);
        console.log(`Total minutes this week:`, totalMinutes);
        return totalMinutes;
    }
}

async function getTotalMinutesThisMonth(userId) {
    const startOfMonth = moment().startOf('month').toISOString();
    const startOfNextMonth = moment().startOf('month').add(1, 'months').toISOString();
    
    const { data, error } = await supabase
        .from('time_entries')
        .select('duration')
        .eq('user_id', userId)
        .gte('start_time', startOfMonth)
        .lt('start_time', startOfNextMonth);

    if (error) {
        console.error(`Error fetching total minutes this month:`, error);
        return null;
    } else {
        const totalMinutes = data.reduce((a, b) => a + (b['duration'] || 0), 0);
        console.log(`Total minutes this month:`, totalMinutes);
        return totalMinutes;
    }
}

async function saveTimeEntry(userId, startTime, duration) {
    const { data, error } = await supabase
        .from('time_entries')
        .insert([
            {
                user_id: userId,
                start_time: startTime,
                duration: duration,
            },
        ])

    if (error) {
        console.error('Error saving time entry:', error)
    } else {
        console.log('Saved time entry:', data)
    }
}

const finishButton = () => {
  let totalDuration = 0
  for (const lap of laps.value) {
    totalDuration += lap.value
  }
  totalDuration = ((totalDuration % 3600) / 60).toFixed(1);
  console.log(totalDuration)
  console.log(startTimeStamp.value)
  console.log(session.value.user.id)

  saveTimeEntry(session.value.user.id, startTimeStamp.value ,totalDuration)
  // reset laps and other things
  laps.value = []
  lapCounter.value = 0
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

const togglePopUp = async () => {
  if (session.value !== null && isShowPopUp.value === false) {
    dialyFocusTime.value = await getTotalMinutesToday(session.value.user.id)
    weeklyFocusTime.value = await getTotalMinutesThisWeek(session.value.user.id)
    monthlyFocusTime.value = await getTotalMinutesThisMonth(session.value.user.id)
  }
  
  if (session.value !== null) {
    isShowPopUp.value = !isShowPopUp.value
  } else {
    isShowWarningAlert.value = true
  }
}

watch([isShowWarningAlert], ([success, error]) => {
  if (success || error) {
    setTimeout(() => {
      isShowWarningAlert.value = false
    }, 2000)
  }
})
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
                  class="w-6 h-6 text-white"
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
                class="absolute right-0 w-48 py-2 mt-2 rounded-lg shadow-xl bg-astral-500"
              >
                <ul>
                  <li
                    class="block px-2 py-2 text-sm text-center rounded-md cursor-pointer text-astral-50 hover:bg-astral-400 hover:text-white"
                    @click="togglePopUp"
                  >
                    Report
                  </li>
                  <li
                    class="block text-sm rounded-md cursor-pointer text-astral-50 hover:bg-astral-400 hover:text-white"
                  >
                    <SpinnerComponent v-if="isLoading" :is-loading="isLoading" />
                    <button class="w-full h-full px-2 py-2" v-else-if="session" @click="signOut">
                      <span class="text-left text-astral-50">Sign Out</span>
                    </button>
                    <button class="w-full h-full px-2 py-2" v-else @click="goToSignIn">
                      <span class="text-left text-astral-50">Sign In</span>
                    </button>
                  </li>
                </ul>
              </div>
            </li>
            <li
              class="hidden w-20 text-sm rounded-md cursor-pointer text-astral-50 hover:bg-astral-400 hover:text-white sm:block h-9"
              @click="togglePopUp"
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
              <button class="w-full h-full px-2 py-2" v-else-if="session" @click="signOut">
                <span>Sign Out</span>
              </button>
              <button class="w-full h-full px-2 py-2" v-else @click="goToSignIn">
                <span>Sign In</span>
              </button>
            </li>
          </ul>
        </div>
        <div
          class="flex flex-col items-center justify-center py-20 space-y-5 rounded-b-lg bg-astral-200"
        >
          <div class="flex justify-center space-x-5">
            <div
              class="flex items-center justify-center w-16 h-20 text-xl text-white rounded-lg bg-astral-800 sm:h-24 sm:w-22 sm:text-4xl"
            >
              {{ formattedHour }}
            </div>
            <div
              class="flex items-center justify-center w-16 h-20 text-xl text-white rounded-lg bg-astral-800 sm:h-24 sm:w-22 sm:text-4xl"
            >
              {{ formattedMinute }}
            </div>
            <div
              class="flex items-center justify-center w-16 h-20 text-xl text-white rounded-lg bg-astral-800 sm:h-24 sm:w-22 sm:text-4xl"
            >
              {{ formattedSecond }}
            </div>
          </div>
          <input 
            class="px-2 py-1 text-sm text-center border border-gray-300 rounded w-60 sm:w-80 sm:text-base"
            placeholder="Enter your session name (optional)"
            v-model="sessionName"
            :disabled="intervalId !== null"
          />
          <div class="flex flex-col space-y-2">
          <button
            class="py-2 rounded-lg w-60 bg-astral-500 text-astral-50 hover:bg-astral-400"
            @click="startButton"
          >
            {{ buttonText }}
          </button>
          <button
            v-if="laps.length > 0 && intervalId === null"
            class="py-2 bg-red-500 rounded-lg w-60 text-astral-50 hover:bg-red-400"
            @click="finishButton"
          >
            Finish Stopwatch
          </button>
        </div>
          <ul v-if="laps.length > 0">
            <div class="p-2 my-2 border rounded bg-astral-50 border-astral-700">
              <li v-for="(lap, index) in laps" :key="index">
                <div class="flex flex-row p-2 my-2 border rounded border-astral-700">
                  <div class="w-32">{{ lap.key }}</div>
                  <div class="separator" />
                  <div>
                    {{ formattedLaps(lap.value) }}
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
      class="transition-transform duration-100"
    >
      <WarningAlertComponent
        v-if="isShowWarningAlert"
        title="Sign In first!"
        body="Please sign in first to see this report 😉"
      />
    </div>
  </div>
  <div>
    <ReportComponent 
      :dialy-focus-time="dialyFocusTime"
      :weekly-focus-time="weeklyFocusTime"
      :monthly-focus-time="monthlyFocusTime"
      @foobar="togglePopUp"
      v-if="isShowPopUp"
    />
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
