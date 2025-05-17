<template>
  <BaseObject
    :id="id"
    :initial-conditions="initialConditions"
    :current-time="currentTime"
    :velocity="velocity"
    :velocity-lab="velocityLab"
    :width="boxWidth"
    :height="boxHeight"
    :current-reference-frame="currentReferenceFrame"
    :origin="origin"
    :current-x="currentX"
    :show-time="false"
    @update-current-x="(id, x) => emit('updateCurrentX', id, x)"
  >
    <div
      ref="boxContainer"
      class="box-container"
    />
  </BaseObject>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, computed, watch } from 'vue'
import Two from 'two.js'
import type { Rectangle } from 'two.js/src/shapes/rectangle';
import * as physics from '@/physics';
import BaseObject from './BaseObject.vue';
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
}>();

const boxContainer = ref<HTMLElement | null>(null)
const two = shallowRef<Two | null>(null);
let box: Rectangle | null = null

const boxHeight = props.height ?? DEFAULT_OBJECT_DIMENSIONS.BOX.height;
const boxWidth = computed(() => {
  const baseWidth = props.width ?? DEFAULT_OBJECT_DIMENSIONS.BOX.width;
  if (props.currentReferenceFrame === props.velocityLab) {
    return baseWidth;
  }
  return physics.lengthContraction(baseWidth, props.velocity);
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
})

watch(boxWidth, (newWidth) => {
  if (box && two.value) {
    box.width = newWidth;
    box.position.x = newWidth/2;
    two.value.width = newWidth;
    two.value.update();
  }
}, { immediate: true });
</script>

<style scoped>
.box-container {
  width: 100%;
  height: 100%;
}
</style>
