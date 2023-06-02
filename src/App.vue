// eslint-disable-next-line eslint-comments/no-unused-disable
<template>
  <div class="flex flex-col items-center justify-center w-screen mt-4">
    <div class="flex-col w-9/12">
      <div class="flex items-center justify-between h-12 bg-slate-100">
        <h1 class="ml-4 flex-start">focusStopwatch.com</h1>

        <ul class="flex mr-4 space-x-6">
          <li>Report</li>
          <li>Login</li>
        </ul>
      </div>
      <div class="flex flex-col items-center justify-center py-20 space-y-5 bg-blue-500 min-h-1/2">
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
</template>

<script>
export default {
  data() {
    return {
      totalCounter: 0,
      secondCounter: 0,
      minuteCounter: 0,
      hourCounter: 0,
      intervalId: null,
      buttonText: 'Start',
      laps: []
    }
  },

  computed: {
    formattedSecond() {
      return this.secondCounter.toString().padStart(2, '0')
    },
    formattedMinute() {
      return this.minuteCounter.toString().padStart(2, '0')
    },

    formattedHour() {
      return this.hourCounter.toString().padStart(2, '0')
    },

    formattedLaps() {
      return (index) => {
        const lap = this.laps[index]
        const hours = Math.floor(lap / 3600)
          .toString()
          .padStart(2, '0')
        const minutes = Math.floor((lap % 3600) / 60)
          .toString()
          .padStart(2, '0')
        const seconds = (lap % 60).toString().padStart(2, '0')
        return `${hours}:${minutes}:${seconds}`
      }
    }
  },

  methods: {
    startButton() {
      if (this.intervalId !== null) {
        this.secondCounter = 0
        this.minuteCounter = 0
        this.hourCounter = 0
        this.isStopwatchRunning = false
        clearInterval(this.intervalId)
        this.intervalId = null
        this.buttonText = 'Start'
        this.laps.push(this.totalCounter)
        this.totalCounter = 0
      } else {
        this.isStopwatchRunning = true
        this.buttonText = 'Reset and Lap'
        this.intervalId = setInterval(() => {
          this.secondCounter += 1
          this.totalCounter += 1
          if (this.secondCounter === 60) {
            this.secondCounter = 0
            this.minuteCounter += 1
          }
          if (this.minuteCounter === 60) {
            this.minuteCounter = 0
            this.hourCounter += 1
          }
        }, 1000)
      }
    }
  }
}
</script>

<style scoped>
.separator {
  border-left: 1px solid black;
  margin: 0 8px;
}
</style>
