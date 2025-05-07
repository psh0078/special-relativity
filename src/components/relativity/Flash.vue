<template>
  <BaseObject
    :id="id"
    :initial-conditions="initialConditions"
    :current-time="currentTime"
    :velocity="velocity"
    :velocity-lab="velocityLab"
    :width="flashSize"
    :height="flashSize"
    :current-reference-frame="currentReferenceFrame"
    :origin="origin"
    :current-x="currentX"
    :show-lab-velocity="false"
    @update-current-x="(id, x) => emit('updateCurrentX', id, x)"
  >
    <div
      ref="flashContainer"
      class="flash-container"
    />
  </BaseObject>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, computed } from 'vue'
import Two from 'two.js'
import type { Circle } from 'two.js/src/shapes/circle';
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
  updateCurrentX: [id: number, x: number]
}>();

const flashContainer = ref<HTMLElement | null>(null)
const two = shallowRef<Two | null>(null);
let flash: Circle | null = null

const flashSize = computed(() => props.width ?? DEFAULT_OBJECT_DIMENSIONS.FLASH.width);

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
  width: 100%;
  height: 100%;
}
</style>
