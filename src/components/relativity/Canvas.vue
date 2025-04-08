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
    <CanvasNavigation
      :canvas-width="canvasWidth"
      :visible-width="visibleWidth"
    >
      <div class="canvas-container">
        <CoordinateSystem
          :width="canvasWidth"
          :height="height"
          :origin="origin"
        />
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
    </CanvasNavigation>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import Box from './Box.vue';
import CreateBox from './CreateBox.vue';
import TimeControls from './TimeControls.vue';
import FrameSelector from './FrameSelector.vue';
import CoordinateSystem from './CoordinateSystem.vue';
import CanvasNavigation from './CanvasNavigation.vue';
import { BaseObject, Box as BoxClass } from '@/types/Objects';
import type { Position } from '@/types/Objects';

const canvasWidth = 2000;
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
.control-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.canvas-container {
  width: 2000px;
  height: 400px;
  position: relative;
}
</style>
