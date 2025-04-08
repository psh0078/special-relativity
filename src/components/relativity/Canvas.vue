<template>
  <div class="relativity-simulator">
    <div class="control-group">
      <CreateBox
        :origin="origin"
        :current-reference-frame="currentReferenceFrame"
        @box-created="addBox"
      />
      <TimeControls
        :time="time"
        @reset="time = 0"
        @update-time="time = $event"
      />
      <FrameSelector
        :box-objects="boxObjects"
        :current-frame="currentReferenceFrame"
        @frame-change="handleFrameChange"
      />
    </div>
    <div class="canvas-wrapper">
      <button
        class="nav-button left"
        @click="scrollLeft"
      >
        &lt;
      </button>
      <div
        ref="scrollContainer"
        class="scrollable-wrapper"
      >
        <div
          ref="canvasContainer"
          class="canvas-container"
        >
          <Box
            v-for="object in boxObjects"
            :id="object.getProperties().id"
            :key="object.getProperties().id"
            :initial-position="object.getProperties().position"
            :current-time="time"
            :velocity="object.getVelocityInCurrentFrame(currentReferenceFrame)"
            :velocity-lab="object.getProperties().velocityLab"
            :width="object.getProperties().width"
            :height="object.getProperties().height"
            :color="object.getProperties().color"
            :current-reference-frame="currentReferenceFrame"
          />
        </div>
      </div>
      <button
        class="nav-button right"
        @click="scrollRight"
      >
        &gt;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  shallowRef,
  reactive,
  computed,
} from 'vue';
import Two from 'two.js';
import Box from './Box.vue';
import CreateBox from './CreateBox.vue';
import TimeControls from './TimeControls.vue';
import FrameSelector from './FrameSelector.vue';
import { BaseObject, Box as BoxClass } from '@/types/Objects';
import type { Position } from '@/types/Objects';
// import * as physics from '@/physics';

const canvasContainer = ref(null);
const two = shallowRef<Two | null>(null);

// const canvasWidth = 2000; // wider for scrolling
const canvasWidth = 2000; // visible area
const visibleWidth = 700;
const height = 400;

const origin = reactive<Position>({
  x: canvasWidth / 2,
  y: height / 2
});

const time = ref<number>(0);
const currentReferenceFrame = ref<number>(0);

const objects = ref<BaseObject[]>([]);
const boxObjects = computed(() =>
  objects.value.filter(obj => obj.getProperties().type === 'box') as BoxClass[]
);

const scrollContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  initCanvas();
  // Scroll to center the origin
  if (scrollContainer.value) {
    scrollContainer.value.scrollLeft = (canvasWidth - visibleWidth) / 2; // (canvas width - visible width) / 2
  }
});

function initCanvas(): void {
  if (!canvasContainer.value) {
    console.warn('Canvas container not found');
    return;
  }

  try {
    two.value = new Two({
      width: canvasWidth,
      height: height,
      type: Two.Types.svg
    }).appendTo(canvasContainer.value);

    const background = two.value.makeRectangle(origin.x, origin.y, canvasWidth, height);
    background.fill = '#f0f0f0';
    background.noStroke();

    drawCoordinateSystem();

    two.value.update();

    console.log('Canvas initialized successfully');
  } catch (error) {
    console.error('Failed to initialize canvas:', error);
  }
}

function drawCoordinateSystem(): void {
  if (!two.value) return;


  const xAxisOrigin = two.value.makeLine(0, origin.y, canvasWidth, origin.y);
  xAxisOrigin.stroke = '#000000';

  // const margin = 50;
  // const yAxis = two.value.makeLine(margin, 0, margin, height);
  // yAxis.stroke = '#FF0000';

}

function addBox(box: BaseObject) {
  console.log('Box added:', box.getProperties());
  objects.value.push(box);
}

function handleFrameChange(frameVelocity: number) {
  currentReferenceFrame.value = frameVelocity;
  console.log('Reference Frame changed to ', frameVelocity);
}

function scrollLeft() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: -100,
      behavior: 'smooth'
    });
  }
}

function scrollRight() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: 100,
      behavior: 'smooth'
    });
  }
}
</script>

<style scoped>
.canvas-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px auto;
  max-width: 800px;
}

.scrollable-wrapper {
  width: 700px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  border: 1px solid #ccc;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.scrollable-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.canvas-container {
  width: 2000px; /* Match the width of the canvas */
  height: 400px;
  position: relative;
}

.nav-button {
  padding: 10px 15px;
  font-size: 20px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background-color: #e0e0e0;
}

.control-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}
</style>
