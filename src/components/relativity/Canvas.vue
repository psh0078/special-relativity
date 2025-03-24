<template>
  <div class="relativity-simulator">
    <div class="control-group">
      <CreateBox
        :origin="origin"
        @box-created="addBox"
      />
      <TimeControls
        :time="time"
        @reset="time = 0"
        @update-time="time = $event"
      />
      <FrameSelector
        :objects="objects"
        :current-frame="currentReferenceFrame"
      />
    </div>
    <div
      ref="canvasContainer"
      class="canvas-container"
    >
      <Box
        v-for="object in objects"
        :id="object.getProperties().id"
        :key="object.getProperties().id"
        :initial-position="object.getProperties().position"
        :current-time="time"
        :velocity="object.getProperties().velocity"
        :width="object.getProperties().width"
        :height="object.getProperties().height"
        :color="object.getProperties().color"
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
  provide,
} from 'vue';
import Two from 'two.js';
import Box from './Box.vue';
import CreateBox from './CreateBox.vue';
import TimeControls from './TimeControls.vue';
import FrameSelector from './FrameSelector.vue';
import { BaseObject } from '@/types/Objects';
import type { Position } from '@/types/Objects';

const canvasContainer = ref(null);
const two = shallowRef<Two | null>(null);

const width = 700;
const height = 400;

const origin = reactive<Position>({
  x: width / 2,
  y: height / 2
});

const time = ref<number>(0);
const currentReferenceFrame = ref<number | null>(0);
provide('currentReferenceFrame', currentReferenceFrame);

const objects = ref<BaseObject[]>([]);

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

function jumpToFrame(objectVelocity: number): void {
  currentReferenceFrame.value = objectVelocity;

  objects.value.forEach(object => {
    const props = object.getProperties();

    const relativeVelocity = (props.veloctiy - objectVelocity) /
                             (1 - props.velocity * objectVelocity);

    object.updateProperties({ velocity: relativeVelocity });
  });
}

function handleFrameChange()

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
