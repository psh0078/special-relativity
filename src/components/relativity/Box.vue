<template>
  <div
    ref="boxContainer"
    class="box-container"
    :style="boxPositionStyle"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <div v-if="showTooltip" class="tooltip">
      <div class="tooltip-content">
        <div>ID: #{{ id }}</div>
        <div>x: {{ currentX.toFixed(2) }}</div>
        <div>v' (current frame): {{ velocity.toFixed(6) }}c</div>
        <div>v (lab frame): {{ velocityLab.toFixed(2) }}c</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, computed, watch } from 'vue'
import Two from 'two.js'
import type { Rectangle } from 'two.js/src/shapes/rectangle';
// import type { Text } from 'two.js/src/text';
import * as physics from '@/physics';
import { VELOCITY_SCALE_FACTOR, VELOCITY_VERTICAL_STRETCH_FACTOR } from '@/constants';

const props = defineProps<{
  id: number
  initialConditions: { x0: number; t0: number }
  currentTime: number
  velocity: number
  velocityLab: number // velocity wrt. lab
  width?: number
  height?: number
  color?: string
  currentReferenceFrame: number
  origin: { x: number; y: number }
  currentX: number
}>()

const emit = defineEmits<{
  updateCurrentX: [id: number, x: number]
  updateCurrentTime: [tprime: number]
}>();

const boxContainer = ref<HTMLElement | null>(null)
const two = shallowRef<Two | null>(null);
let box: Rectangle | null = null
// let text: Text | null = null

const boxHeight = props.height ?? 20;
const boxWidth = computed(() => {
  const baseWidth = props.width ?? 80;
  if (props.currentReferenceFrame === props.velocityLab) {
    return baseWidth;
  }
  return physics.lengthContraction(baseWidth, props.velocity);
});

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

const boxPositionStyle = computed(() => {
  return {
    left: `${currentPosition.value.x - boxWidth.value/2}px`,
    top: `${currentPosition.value.y - boxHeight/2}px`,
    width: `${boxWidth.value}px`,
    height: `${boxHeight}px`
  };
});

const showTooltip = ref(false);

onMounted(() => {
  if (!boxContainer.value) return

  two.value = new Two({
    width: boxWidth.value,
    height: boxHeight,
    autostart: true
  }).appendTo(boxContainer.value)

  box = two.value.makeRectangle(
    boxWidth.value/2,
    boxHeight/2,
    boxWidth.value,
    boxHeight
  )

  const color = props.color || '#FFA500';
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  box.fill = `rgba(${r}, ${g}, ${b}, 0.8)`;
  box.stroke = '#000000'
  box.linewidth = 2

  // text = two.value.makeText(
  //   `#${props.id}`,
  //   boxWidth.value/2,
  //   boxHeight/2
  // );
  // text.fill = '#000000';
  // text.size = 12;
  // text.alignment = 'center';
  // text.baseline = 'middle';
})

watch(boxWidth, (newWidth) => {
  if (box && two.value) {
    box.width = newWidth;
    box.position.x = newWidth/2;
    two.value.width = newWidth;
    // text.position.x = newWidth/2;
    two.value.update();
  }
}, { immediate: true });

watch(() => props.currentReferenceFrame, (newFrame) => {
  if (newFrame === props.velocityLab) {
    const currentVelocity = physics.calculateVelocityFromPosition(props.currentX, props.initialConditions.x0, props.currentTime, props.initialConditions.t0);
    const tprime = physics.transformTimeToFrame(props.currentTime, currentVelocity, props.currentX);
    emit('updateCurrentTime', tprime);
  }
}, { immediate: true });
</script>

<style scoped>
.box-container {
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
