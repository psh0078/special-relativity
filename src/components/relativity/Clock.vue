<template>
  <div
    ref="clockContainer"
    class="clock-container"
    :style="clockPositionStyle"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <div v-if="showTooltip" class="tooltip">
      <div class="tooltip-content">
        <div>ID: #{{ id }}</div>
        <div>x: {{ currentX.toFixed(2) }}</div>
        <div>t': {{ currentTimeInFrame.toFixed(2) }}</div>
        <div>v' (current frame): {{ velocity.toFixed(6) }}c</div>
        <div>v (lab frame): {{ velocityLab.toFixed(2) }}c</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, computed, watch } from 'vue'
import Two from 'two.js'
import type { Circle } from 'two.js/src/shapes/circle';
import type { Text } from 'two.js/src/text';
import * as physics from '@/physics';
import { VELOCITY_SCALE_FACTOR, VELOCITY_VERTICAL_STRETCH_FACTOR } from '@/constants';

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
  updateCurrentX: [id: number, x: number]
}>();

const clockContainer = ref<HTMLElement | null>(null)
const two = shallowRef<Two | null>(null);
let clockFace: Circle | null = null
let timeText: Text | null = null
const showTooltip = ref(false);

const clockSize = computed(() => props.width ?? 30);

const currentPosition = computed(() => {
  if (props.currentReferenceFrame === 0 && props.initialConditions.x0 !== 0) {
    return {
      x: props.origin.x + props.initialConditions.x0 * VELOCITY_SCALE_FACTOR,
      y: props.origin.y
    }
  } else {
    const t0prime = physics.transformTimeToFrame(props.initialConditions.t0, props.velocity, props.initialConditions.x0);
    const x0prime = physics.transformPositionToFrame(props.initialConditions.x0, props.velocity, t0prime);
    const currentX = x0prime + props.velocity * (props.currentTime - t0prime);
    const x = currentX * VELOCITY_SCALE_FACTOR + props.origin.x;
    emit('updateCurrentX', props.id, currentX);
    return {
      x,
      y: physics.vscale(3, props.velocity, VELOCITY_VERTICAL_STRETCH_FACTOR, props.origin.y * 2)
    };
  }
});

const clockPositionStyle = computed(() => {
  return {
    left: `${currentPosition.value.x - clockSize.value/2}px`,
    top: `${currentPosition.value.y - clockSize.value/2}px`,
    width: `${clockSize.value}px`,
    height: `${clockSize.value}px`
  };
});

const currentTimeInFrame = computed(() => {
  return physics.transformTimeToFrame(
    props.currentTime,
    props.velocity,
    props.currentX
  );
});

onMounted(() => {
  if (!clockContainer.value) return;

  two.value = new Two({
    width: clockSize.value,
    height: clockSize.value,
    autostart: true
  }).appendTo(clockContainer.value);

  clockFace = two.value.makeCircle(
    clockSize.value/2,
    clockSize.value/2,
    clockSize.value/2 - 2
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
    clockSize.value/2,
    clockSize.value/2
  );
  timeText.fill = '#000000';
  timeText.size = 10;
  timeText.alignment = 'center';
  timeText.baseline = 'middle';
});

watch(currentTimeInFrame, (newTime) => {
  if (timeText) {
    timeText.value = newTime.toFixed(2);
    two.value?.update();
  }
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
