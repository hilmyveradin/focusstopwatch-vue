<script>
export default {
  emits: ['foobar'],
  props: {
    dialyFocusTime: {
      type: Number,
      default: 0
    },
    weeklyFocusTime: {
      type: Number,
      default: 0
    },
    monthlyFocusTime: {
      type: Number,
      default: 0
    },
  }
}
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center">
    <div class="absolute inset-0 bg-gray-500 bg-opacity-50" @click="$emit('foobar')"></div>
    <div class="z-10 p-6 bg-white rounded-lg shadow-md">
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <div class="p-4 text-center bg-astral-200">
            <h1> Your Dialy Focus Time </h1>
            <h1 class="text-xl font-bold text-black"> {{ dialyFocusTime }} minutes </h1>
          </div>
        </div>
        <div>
          <div class="p-4 text-center bg-astral-200">
            <h1> Your Weekly Focus Time </h1>
            <h1 class="text-xl font-bold text-black"> {{ weeklyFocusTime }} minutes </h1>
          </div>
        </div>
        <div>
          <div class="p-4 text-center bg-astral-200">
            <h1> Your Monthly Focus Time </h1>
            <h1 class="text-xl font-bold text-black"> {{ monthlyFocusTime }} minutes </h1>
          </div>
        </div>
        <div/>
        <div class="flex justify-center col-span-2">
          <!-- Button -->
          <button class="px-4 py-2 text-white rounded bg-astral-500" @click="$emit('foobar')">Back To Stopwatch</button>
        </div>
      </div>
    </div>
  </div>
</template>
