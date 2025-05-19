<template>
  <div class="relativity-simulator">
    <!-- <h1 class="title">Special Relativity Simulator</h1> -->
    <div class="layout">
      <ControlPanel
        :time="time"
        :objects="objects"
        :current-reference-frame="currentReferenceFrame"
        :origin="origin"
        @reset="time = 0"
        @update-time="time = $event"
        @frame-change="handleFrameChange"
        @object-created="addObject"
        @delete-object="deleteObject"
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
            <ObjectRenderer
              v-for="object in objects"
              :key="object.getProperties().id"
              :object="object"
              :current-time="time"
              :current-reference-frame="currentReferenceFrame"
              :origin="origin"
              @update-current-x="updateObjectCurrentX"
              @update-current-time="updateCurrentTime"
              @show-object-info="handleShowObjectInfo"
              @hide-object-info="handleHideObjectInfo"
            />
          </div>
        </CanvasNavigation>
      </div>
    </div>
    <ObjectInfoPanel
      :object-info="selectedObjectInfo"
      :visible="showObjectInfo"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import ObjectRenderer from './ObjectRenderer.vue';
import ControlPanel from './ControlPanel.vue';
import CoordinateSystem from './CoordinateSystem.vue';
import CanvasNavigation from './CanvasNavigation.vue';
import ObjectInfoPanel from './ObjectInfoPanel.vue';
import { type BaseObject } from '@/types/Objects';
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

const labFrameBoxY = computed(() => {
  const labFrameBox = objects.value.find(obj =>
    obj.getProperties().type === 'box' && obj.getProperties().velocityLab === 0
  );
  if (!labFrameBox) return null;
  const velocityInCurrentFrame = physics.transformVelocityToFrame(0, currentReferenceFrame.value);
  return physics.vscale(3, velocityInCurrentFrame, 150, origin.y * 2);
});

const selectedObjectInfo = ref<{
  id: number;
  x: number;
  time?: number;
  velocity: number;
  velocityLab?: number;
} | null>(null);
const showObjectInfo = ref(false);

function addObject(object: BaseObject) {
  console.log('Object added:', object.getProperties());
  objects.value.push(object);
}

function deleteObject(id: number) {
  objects.value = objects.value.filter(obj => obj.getProperties().id !== id);
  console.log(objects.value);
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

function handleShowObjectInfo(info: {
  id: number;
  x: number;
  time?: number;
  velocity: number;
  velocityLab?: number;
}) {
  selectedObjectInfo.value = info;
  showObjectInfo.value = true;
}

function handleHideObjectInfo() {
  showObjectInfo.value = false;
  selectedObjectInfo.value = null;
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
