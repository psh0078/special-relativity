<template>
  <div
    ref="objectContainer"
    class="object-container"
    :style="objectPositionStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
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
  (e: 'showObjectInfo', info: { id: number; x: number; time?: number; velocity: number; velocityLab?: number }): void;
  (e: 'hideObjectInfo'): void;
}>();

const objectContainer = ref<HTMLElement | null>(null);

const currentPosition = computed(() => {
  const t0prime = physics.transformTimeToFrame(props.initialConditions.t0, props.currentReferenceFrame, props.initialConditions.x0);
  const x0prime = physics.transformPositionToFrame(props.initialConditions.x0, props.currentReferenceFrame, props.initialConditions.t0);
  const currentX = x0prime + props.velocity * (props.currentTime - t0prime);
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

function handleMouseEnter() {
  emit('showObjectInfo', {
    id: props.id,
    x: props.currentX,
    time: props.showTime ? currentTimeInFrame.value : undefined,
    velocity: props.velocity,
    velocityLab: props.showLabVelocity ? props.velocityLab : undefined
  });
}

function handleMouseLeave() {
  emit('hideObjectInfo');
}

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
</style>
