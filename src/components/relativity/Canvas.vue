<template>
  <div ref="canvasContainer" class="canvas-container">
    <Box
      :position="{x: origin.x, y: origin.y}"
      :velocity="0.5"
      :width="100"
      :height="50"
      color="#FFA500"
    />
    <Box
      :position="{x: origin.x, y: origin.y - 45}"
      :velocity="0.8"
      :width="80"
      :height="40"
      color="#FFA500"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, reactive } from 'vue';
import Two from 'two.js';
import Box from './Box.vue';

const canvasContainer = ref(null);
const two = shallowRef<Two | null>(null);

const width = 800;
const height = 400;

const origin = reactive({
  x: width / 2,
  y: height / 2
});

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
  width: 800px;
  height: 500px;
  margin: 20px auto;
  position: relative;
}
</style>
