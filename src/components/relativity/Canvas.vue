<template>
  <div class="relativity-simulator">
    <h1 class="title">Special Relativity Lab</h1>
    <div class="layout">
      <ControlPanel
        :time="time"
        :box-objects="boxObjects"
        :current-reference-frame="currentReferenceFrame"
        :origin="origin"
        @reset="time = 0"
        @update-time="time = $event"
        @frame-change="handleFrameChange"
        @box-created="addBox"
      />
      <div class="canvas-area">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import Box from './Box.vue';
import ControlPanel from './ControlPanel.vue';
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
.relativity-simulator {
  padding: 24px;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.layout {
  display: flex;
  gap: 24px;
  max-width: 1200px;
  margin: 70px auto 0;
  width: 100%;
  justify-content: center;
}

.canvas-area {
  flex: 1;
  min-width: 0; /* Prevents flex item from overflowing */
}

.canvas-container {
  width: 2000px;
  height: 400px;
  position: relative;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
