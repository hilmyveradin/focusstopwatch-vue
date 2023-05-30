<template>
  <div class="flex flex-col items-center justify-center w-screen mt-4">
    <div class="flex-col w-9/12">
      <div class="flex items-center justify-between h-12 bg-slate-100">
        <h1 class="ml-4 flex-start">focusStopwatch.com</h1>

        <ul class="flex mr-4 space-x-6">
          <li>Report</li>
          <li>{{ counter }}</li>
        </ul>
      </div>
      <div class="flex flex-col items-center justify-center space-y-5 bg-blue-500 min-h-1/2">
        <div class="flex justify-center space-x-5">
          <div class="p-5 text-white bg-black rounded-lg">{{ formatedHour }}</div>
          <div class="p-5 text-white bg-black rounded-lg">{{ formatedMinute }}</div>
          <div class="p-5 text-white bg-black rounded-lg">{{ formatedSecond }}</div>
        </div>
        <button class="bg-red-500" @click="startButton">{{ buttonText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isStopwatchRunning: false,
      secondCounter: 0,
      minuteCounter: 0,
      hourCounter: 0,
      intervalId: null,
      buttonText: 'Start'
    }
  },

  computed: {
    formatedSecond() {
      return this.secondCounter.toString().padStart(2, '0')
    },
    formatedMinute() {
      return this.minuteCounter.toString().padStart(2, '0')
    },

    formatedHour() {
      return this.hourCounter.toString().padStart(2, '0')
    }
  },

  methods: {
    startButton() {
      // action buat calculate the numbers
      if (this.isStopwatchRunning) {
        this.secondCounter = 0
        this.minuteCounter = 0
        this.hourCounter = 0
        this.isStopwatchRunning = false
        clearInterval(this.intervalId)
        this.intervalId = null
        this.buttonText = 'Start'
      } else {
        this.isStopwatchRunning = true
        this.buttonText = 'Reset and Lap'
        this.intervalId = setInterval(() => {
          this.secondCounter += 1
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
