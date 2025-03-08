<template>
  <div>
    <TimeControls
      :time="time"
      @reset="time = 0"
      @update-time="time = $event"
    />
    <div
      ref="canvasContainer"
      class="canvas-container"
    >
      <Box
        :id="1"
        :initial-position="{x: origin.x, y: origin.y}"
        :current-time="time"
        :velocity="0.5"
        :width="100"
        :height="50"
        color="#FFA500"
      />
      <Box
        :id="2"
        :initial-position="{x: origin.x, y: origin.y - 45}"
        :current-time="time"
        :velocity="0.8"
        :width="80"
        :height="40"
        color="#FFA500"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  shallowRef,
  reactive,
  provide} from 'vue';
import Two from 'two.js';
import Box from './Box.vue';
import TimeControls from './TimeControls.vue'

const canvasContainer = ref(null);
const two = shallowRef<Two | null>(null);

const width = 1000;
const height = 700;

const origin = reactive({
  x: width / 2,
  y: height / 2
});

const time = ref<number>(0);

const currentReferenceFrame = ref<number | null>(0.5);
provide('currentReferenceFrame', currentReferenceFrame);

onMounted(() => {
  initCanvas();
});

function initCanvas(): void {
  if (!canvasContainer.value) {
    console.warn('Canvas container not found');
    return;
  }

  try {
    two.value = new Two({
      width: width,
      height: height,
      type: Two.Types.svg
    }).appendTo(canvasContainer.value);

    const rect = two.value.makeRectangle(origin.x, origin.y, width, height);
    rect.fill = '#f0f0f0';
    rect.stroke = '#000000';

    drawCoordinateSystem();

    two.value.update();

    console.log('Canvas initialized successfully');
  } catch (error) {
    console.error('Failed to initialize canvas:', error);
  }
}

function drawCoordinateSystem(): void {
  if (!two.value) return;

  const margin = 50;

  const xAxisOrigin = two.value.makeLine(0, origin.y, width, origin.y);
  xAxisOrigin.stroke = '#000000';

  const yAxisOrigin = two.value.makeLine(origin.x, 0, origin.x, height);
  yAxisOrigin.stroke = '#000000';

  const yAxis = two.value.makeLine(margin, 0, margin, height);
  yAxis.stroke = '#FF0000';

}

// function drawTicks(origin: {x: number, y: number}): void {
//   if (!two.value) return;


// }
</script>

<style scoped>
.canvas-container {
  width: 1000px;
  height: 700px;
  margin: 20px auto;
  position: relative;
}
</style>
