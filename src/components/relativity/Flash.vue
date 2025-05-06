<template>
  <div
    ref="flashContainer"
    class="flash-container"
    :style="flashPositionStyle"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <div v-if="showTooltip" class="tooltip">
      <div class="tooltip-content">
        <div>ID: #{{ id }}</div>
        <div>x: (current frame): {{ currentX.toFixed(2) }}</div>
        <div>v' (current frame): {{ velocity.toFixed(1) }}c</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, computed } from 'vue'
import Two from 'two.js'
import type { Circle } from 'two.js/src/shapes/circle';
import * as physics from '@/physics';
import { VELOCITY_SCALE_FACTOR, VELOCITY_VERTICAL_STRETCH_FACTOR, DEFAULT_OBJECT_DIMENSIONS } from '@/constants';

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

const flashContainer = ref<HTMLElement | null>(null)
const two = shallowRef<Two | null>(null);
let flash: Circle | null = null
const showTooltip = ref(false);

const flashSize = computed(() => props.width ?? DEFAULT_OBJECT_DIMENSIONS.FLASH.width);

const currentPosition = computed(() => {
  if (props.currentReferenceFrame === 0 && props.initialConditions.x0 !== 0) {
    return {
      x: props.origin.x + props.initialConditions.x0 * VELOCITY_SCALE_FACTOR,
      y: physics.vscale(1, 1, VELOCITY_VERTICAL_STRETCH_FACTOR, props.origin.y * 2)
    }
  } else {
    const t0prime = physics.transformTimeToFrame(props.initialConditions.t0, props.velocity, props.initialConditions.x0);
    const x0prime = physics.transformPositionToFrame(props.initialConditions.x0, props.velocity, t0prime);
    const currentX = x0prime + props.velocity * (props.currentTime - t0prime);
    const x = currentX * VELOCITY_SCALE_FACTOR + props.origin.x;
    emit('updateCurrentX', props.id, currentX);
    return {
      x,
      y: physics.vscale(1, 1, VELOCITY_VERTICAL_STRETCH_FACTOR, props.origin.y * 2)
    };
  }
});

const flashPositionStyle = computed(() => {
  return {
    left: `${currentPosition.value.x - flashSize.value/2}px`,
    top: `${currentPosition.value.y - flashSize.value/2}px`,
    width: `${flashSize.value}px`,
    height: `${flashSize.value}px`
  };
});

onMounted(() => {
  if (!flashContainer.value) return;

  two.value = new Two({
    width: flashSize.value,
    height: flashSize.value,
    autostart: true
  }).appendTo(flashContainer.value);

  flash = two.value.makeCircle(
    flashSize.value/2,
    flashSize.value/2,
    flashSize.value/2 - 2
  );

  const color = props.color || '#FF0000';
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  flash.fill = `rgba(${r}, ${g}, ${b}, 0.8)`;
  flash.stroke = '#000000';
  flash.linewidth = 1;
});
</script>

<style scoped>
.flash-container {
  position: absolute;
  pointer-events: auto;
  mix-blend-mode: multiply;
}

.tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  margin-top: 5px;
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 5px 5px;
  border-style: solid;
  border-color: transparent transparent rgba(0, 0, 0, 0.8);
}
</style>
