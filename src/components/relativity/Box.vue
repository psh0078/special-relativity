<template>
  <div
    ref="boxContainer"
    class="box-container"
    :style="boxPositionStyle"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, computed, watch } from 'vue'
import Two from 'two.js'
import type { Rectangle } from 'two.js/src/shapes/rectangle';
import type { Text } from 'two.js/src/text';
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
  origin: { x: number; y: number }
}>()

const boxContainer = ref<HTMLElement | null>(null)
const two = shallowRef<Two | null>(null);
let box: Rectangle | null = null
let text: Text | null = null

const boxHeight = props.height ?? 20;
const boxWidth = computed(() => {
  const baseWidth = props.width ?? 80;
  if (props.currentReferenceFrame === props.velocityLab) {
    return baseWidth;
  }
  return physics.lengthContraction(baseWidth, props.velocity);
});

const currentPosition = computed(() => {
  if (props.currentReferenceFrame === props.velocityLab) {
    return {
      x: props.origin.x,
      y: props.origin.y
    };
  } else {
    return {
      x: props.initialPosition.x + props.velocity * 100 * props.currentTime,
      y: physics.vscale(3, props.velocity, 200, props.origin.y * 2)
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

  text = two.value.makeText(
    `#${props.id}`,
    boxWidth.value/2,
    boxHeight/2
  );
  text.fill = '#000000';
  text.size = 12;
  text.alignment = 'center';
  text.baseline = 'middle';
})

watch(boxWidth, (newWidth) => {
  if (box && two.value && text) {
    box.width = newWidth;
    box.position.x = newWidth/2;
    two.value.width = newWidth;
    text.position.x = newWidth/2;

    two.value.update();
  }
}, { immediate: true });
</script>

<style scoped>
.box-container {
  position: absolute;
  pointer-events: none;
  mix-blend-mode: multiply;
}
</style>
