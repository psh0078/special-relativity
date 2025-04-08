<template>
  <div
    ref="boxContainer"
    class="box-container"
    :style="boxPositionStyle"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, computed } from 'vue'
import Two from 'two.js'
import type { Rectangle } from 'two.js/src/shapes/rectangle';
import * as physics from '@/physics';

const props = defineProps<{
  id: number
  initialPosition: { x: number; y: number }
  currentTime: number
  velocity: number
  velocityLab: number // velocity wrt. lab
  width?: number
  height?: number
  color?: string
  currentReferenceFrame: number
}>()

const boxContainer = ref<HTMLElement | null>(null)
const two = shallowRef<Two | null>(null);
let box: Rectangle | null = null

const velocityInCurrentFrame = computed(() => {
  return physics.forwardTransformRelativeVelocity(props.velocityLab, props.currentReferenceFrame);
});

const currentPosition = computed(() => {
  if (velocityInCurrentFrame.value === props.currentReferenceFrame) {
    return {
      x: props.initialPosition.x,
      y: props.initialPosition.y
    };
  }

  return {
    x: props.initialPosition.x + props.velocity * 100 * props.currentTime,
    y: props.initialPosition.y
  };
});

const boxPositionStyle = computed(() => {
  const boxWidth = props.width || 50;
  const boxHeight = props.height || 25;

  return {
    left: `${currentPosition.value.x - boxWidth/2}px`,
    top: `${currentPosition.value.y - boxHeight/2}px`,
    width: `${boxWidth}px`,
    height: `${boxHeight}px`
  };
});

onMounted(() => {
  if (!boxContainer.value) return

  two.value = new Two({
    width: props.width || 50,
    height: props.height || 25,
    autostart: true
  }).appendTo(boxContainer.value)

  const boxWidth = props.width || 50;
  const boxHeight = props.height || 25;

  box = two.value.makeRectangle(
    boxWidth/2,
    boxHeight/2,
    boxWidth,
    boxHeight
  )

  const color = props.color || '#FFA500';
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  box.fill = `rgba(${r}, ${g}, ${b}, 0.8)`;
  box.stroke = '#000000'
  box.linewidth = 2
})
</script>

<style scoped>
.box-container {
  position: absolute;
  pointer-events: none;
  mix-blend-mode: multiply;
}
</style>
