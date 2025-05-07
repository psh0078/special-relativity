<template>
  <div
    ref="objectContainer"
    class="object-container"
    :style="objectPositionStyle"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <div
      v-if="showTooltip"
      class="tooltip"
    >
      <div class="tooltip-content">
        <div>ID: #{{ id }}</div>
        <div>x (current frame): {{ currentX.toFixed(5) }}</div>
        <div v-if="showTime">
          t' (current frame): {{ currentTimeInFrame.toFixed(2) }}
        </div>
        <div>v' (current frame): {{ velocity.toFixed(6) }}c</div>
        <div v-if="showLabVelocity">
          v (lab frame): {{ velocityLab.toFixed(2) }}c
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import * as physics from '@/physics';
import { VELOCITY_SCALE_FACTOR, VELOCITY_VERTICAL_STRETCH_FACTOR } from '@/constants';

const props = defineProps<{
  id: number
  initialConditions: { x0: number; t0: number }
  currentTime: number
  velocity: number
  velocityLab: number
  width: number
  height: number
  currentReferenceFrame: number
  origin: { x: number; y: number }
  currentX: number
  showTime?: boolean
  showLabVelocity?: boolean
}>()

const emit = defineEmits<{
  (e: 'updateCurrentX', id: number, x: number): void;
}>();

const objectContainer = ref<HTMLElement | null>(null)
const showTooltip = ref(false);

const currentPosition = computed(() => {
  const t0prime = physics.transformTimeToFrame(props.initialConditions.t0, props.currentReferenceFrame, props.initialConditions.x0);
  const x0prime = physics.transformPositionToFrame(props.initialConditions.x0, props.currentReferenceFrame, props.initialConditions.t0);
  const currentX = x0prime + props.velocity * (props.currentTime - t0prime);
  // console.log('props', props.initialConditions, props.velocity, props.currentTime);
  // console.log('currentX', currentX);
  // console.log('x0prime', x0prime);
  // console.log('t0prime', t0prime);
  return {
    x: currentX * VELOCITY_SCALE_FACTOR + props.origin.x,
    y: physics.vscale(3, props.velocity, VELOCITY_VERTICAL_STRETCH_FACTOR, props.origin.y * 2)
  };
});

const objectPositionStyle = computed(() => {
  return {
    left: `${currentPosition.value.x - props.width/2}px`,
    top: `${currentPosition.value.y - props.height/2}px`,
    width: `${props.width}px`,
    height: `${props.height}px`
  };
});

const currentTimeInFrame = computed(() => {
  return physics.transformTimeToFrame(
    props.currentTime,
    props.velocity,
    props.currentX
  );
});

watch(() => currentPosition.value.x, (newX) => {
  const currentX = (newX - props.origin.x) / VELOCITY_SCALE_FACTOR;
  emit('updateCurrentX', props.id, currentX);
}, { immediate: true });
</script>

<style scoped>
.object-container {
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
