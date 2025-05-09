<template>
  <BaseObject
    :id="id"
    :initial-conditions="initialConditions"
    :current-time="currentTime"
    :velocity="velocity"
    :velocity-lab="velocityLab"
    :width="clockSize"
    :height="clockSize"
    :current-reference-frame="currentReferenceFrame"
    :origin="origin"
    :current-x="currentX"
    :show-time="true"
    :show-lab-velocity="true"
    @update-current-x="(id: number, x: number) => emit('updateCurrentX', id, x)"
    @update-current-time="(tprime: number) => emit('updateCurrentTime', tprime)"
  >
    <div
      ref="clockContainer"
      class="clock-container"
    />
  </BaseObject>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, computed, watch } from 'vue'
import Two from 'two.js'
import type { Circle } from 'two.js/src/shapes/circle';
import type { Text } from 'two.js/src/text';
import BaseObject from './BaseObject.vue';
import * as physics from '@/physics';
import { DEFAULT_OBJECT_DIMENSIONS } from '@/constants';

const props = defineProps<{
  id: number
  initialConditions: { x0: number; t0: number }
  currentTime: number
  velocity: number
  velocityLab: number
  width?: number
  height?: number
  color?: string
  currentReferenceFrame: number
  origin: { x: number; y: number }
  currentX: number
}>()

const emit = defineEmits<{
  (e: 'updateCurrentX', id: number, x: number): void;
  (e: 'updateCurrentTime', tprime: number): void;
}>();

const clockContainer = ref<HTMLElement | null>(null)
const two = shallowRef<Two | null>(null);
let clockFace: Circle | null = null
let timeText: Text | null = null

const clockSize = DEFAULT_OBJECT_DIMENSIONS.CLOCK.width

const currentTimeInFrame = computed(() => {
  return physics.transformTimeToFrame(
    props.currentTime,
    props.velocity,
    props.currentX
  );
});

watch(() => props.currentReferenceFrame, (newFrame) => {
  if (newFrame === props.velocityLab) {
    const currentVelocity = physics.calculateVelocityFromPosition(props.currentX, props.initialConditions.x0, props.currentTime, props.initialConditions.t0);
    const tprime = physics.transformTimeToFrame(props.currentTime, currentVelocity, props.currentX);
    emit('updateCurrentTime', tprime);
  }
}, { immediate: true });

// Add watch for currentTimeInFrame to update the time display
watch(currentTimeInFrame, (newTime) => {
  if (timeText && two.value) {
    timeText.value = newTime.toFixed(2);
    two.value.update();
  }
}, { immediate: true });

onMounted(() => {
  if (!clockContainer.value) return;

  two.value = new Two({
    width: clockSize,
    height: clockSize,
    autostart: true
  }).appendTo(clockContainer.value);

  clockFace = two.value.makeCircle(
    clockSize/2,
    clockSize/2,
    clockSize/2 - 2
  );

  const color = props.color || '#808080';
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  clockFace.fill = `rgba(${r}, ${g}, ${b}, 0.8)`;
  clockFace.stroke = '#000000';
  clockFace.linewidth = 1;

  // Create time text
  timeText = two.value.makeText(
    currentTimeInFrame.value.toFixed(2),
    clockSize/2,
    clockSize/2
  );
  timeText.fill = '#000000';
  timeText.size = 10;
  timeText.alignment = 'center';
  timeText.baseline = 'middle';
});
</script>

<style scoped>
.clock-container {
  position: absolute;
  pointer-events: auto;
  mix-blend-mode: multiply;
}

.tooltip {
  position: absolute;
  top: -130px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tooltip::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px 5px 0;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.8) transparent transparent;
}
</style>
