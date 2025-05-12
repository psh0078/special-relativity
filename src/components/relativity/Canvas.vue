<template>
  <div class="relativity-simulator">
    <h1 class="title">Special Relativity Simulator</h1>
    <div class="layout">
      <ControlPanel
        :time="time"
        :box-objects="boxObjects"
        :clock-objects="clockObjects"
        :current-reference-frame="currentReferenceFrame"
        :origin="origin"
        @reset="time = 0"
        @update-time="time = $event"
        @frame-change="handleFrameChange"
        @object-created="addObject"
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
              :lab-frame-box-y="labFrameBoxY"
            />
            /**
            * TODO: Refactoring Opportunity: make this a component
            */
            <Box
              v-for="object in boxObjects"
              :id="object.getProperties().id"
              :key="object.getProperties().id"
              :initial-conditions="object.getProperties().initialConditions"
              :current-time="time"
              :velocity="object.getVelocityInCurrentFrame(currentReferenceFrame)"
              :velocity-lab="object.getProperties().velocityLab"
              :width="object.getProperties().width"
              :height="object.getProperties().height"
              :color="object.getProperties().color"
              :current-reference-frame="currentReferenceFrame"
              :origin="origin"
              :current-x="object.getProperties().currentX!"
              @update-current-x="(id, x) => updateObjectCurrentX(id, x)"
              @update-current-time="updateCurrentTime"
            />
            <Clock
              v-for="object in clockObjects"
              :id="object.getProperties().id"
              :key="object.getProperties().id"
              :initial-conditions="object.getProperties().initialConditions"
              :current-time="time"
              :velocity="object.getVelocityInCurrentFrame(currentReferenceFrame)"
              :velocity-lab="object.getProperties().velocityLab"
              :width="object.getProperties().width"
              :height="object.getProperties().height"
              :color="object.getProperties().color"
              :current-reference-frame="currentReferenceFrame"
              :origin="origin"
              :current-x="object.getProperties().currentX!"
              @update-current-x="(id, x) => updateObjectCurrentX(id, x)"
            />
            <Flash
              v-for="object in flashObjects"
              :id="object.getProperties().id"
              :key="object.getProperties().id"
              :initial-conditions="object.getProperties().initialConditions"
              :current-time="time"
              :velocity="object.getVelocityInCurrentFrame(currentReferenceFrame)"
              :velocity-lab="object.getProperties().velocityLab"
              :width="object.getProperties().width"
              :height="object.getProperties().height"
              :color="object.getProperties().color"
              :current-reference-frame="currentReferenceFrame"
              :origin="origin"
              :current-x="object.getProperties().currentX!"
              @update-current-x="(id, x) => updateObjectCurrentX(id, x)"
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
import Clock from './Clock.vue';
import Flash from './Flash.vue';
import ControlPanel from './ControlPanel.vue';
import CoordinateSystem from './CoordinateSystem.vue';
import CanvasNavigation from './CanvasNavigation.vue';
import { BaseObject, Box as BoxClass, Clock as ClockClass, Flash as FlashClass } from '@/types/Objects';
import type { Position } from '@/types/Objects';
import * as physics from '@/physics';

/**
 * TODO: make these constants configurable and move them to constants.ts
 */
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

const clockObjects = computed(() =>
  objects.value.filter(obj => obj.getProperties().type === 'clock') as ClockClass[]
);

const flashObjects = computed(() =>
  objects.value.filter(obj => obj.getProperties().type === 'flash') as FlashClass[]
);

const labFrameBoxY = computed(() => {
  const labFrameBox = boxObjects.value.find(box => box.getProperties().velocityLab === 0);
  if (!labFrameBox) return null;
  const velocityInCurrentFrame = physics.transformVelocityToFrame(0, currentReferenceFrame.value);
  return physics.vscale(3, velocityInCurrentFrame, 150, origin.y * 2);
});

function addObject(object: BaseObject) {
  console.log('Object added:', object.getProperties());
  objects.value.push(object);
}

function handleFrameChange(frameVelocity: number) {
  currentReferenceFrame.value = frameVelocity;
  console.log('Reference Frame changed to ', frameVelocity);
}

function updateObjectCurrentX(id: number, x: number) {
  const object = objects.value.find(obj => obj.getProperties().id === id);
  if (object) {
    object.updateProperties({ currentX: x });
  }
}

function updateCurrentTime(tprime: number) {
  time.value = tprime;
  console.log('Current time changed to ', time.value);
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
