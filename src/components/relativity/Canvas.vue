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

const width = 700;
const height = 400;

const origin = reactive<Position>({
  x: width / 2,
  y: height / 2
});

const time = ref<number>(0);
const currentReferenceFrame = ref<number>(0);
// provide('currentReferenceFrame', currentReferenceFrame);

const objects = ref<BaseObject[]>([]);
const boxObjects = computed(() =>
  objects.value.filter(obj => obj.getProperties().type === 'box') as BoxClass[]
);

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

function addBox(box: BaseObject) {
  console.log('Box added:', box.getProperties());
  objects.value.push(box);
}

function handleFrameChange(frameVelocity: number) {
  currentReferenceFrame.value = frameVelocity;
  console.log('Reference Frame changed to ', frameVelocity);
}
</script>

<style scoped>
.canvas-container {
  width: 700px;
  height: 400px;
  margin: 20px auto;
  position: relative;
}

.control-group {
  display: flex;
  flex-direction: row;
}
</style>
