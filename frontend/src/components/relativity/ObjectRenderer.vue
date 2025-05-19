<template>
  <component
    :is="objectComponent"
    :id="object.getProperties().id"
    :initial-conditions="object.getProperties().initialConditions"
    :current-time="currentTime"
    :velocity="object.getVelocityInCurrentFrame(currentReferenceFrame)"
    :velocity-lab="object.getProperties().velocityLab"
    :width="object.getProperties().width"
    :height="object.getProperties().height"
    :color="object.getProperties().color"
    :current-reference-frame="currentReferenceFrame"
    :origin="origin"
    :current-x="object.getProperties().currentX!"
    :show-time="object.getProperties().type === 'clock'"
    :show-lab-velocity="object.getProperties().type === 'box'"
    @update-current-x="(id, x) => $emit('update-current-x', id, x)"
    @update-current-time="(time) => $emit('update-current-time', time)"
    @show-object-info="(info) => $emit('show-object-info', info)"
    @hide-object-info="$emit('hide-object-info')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BaseObject } from '@/types/Objects';
import type { Position } from '@/types/Objects';
import Box from './Box.vue';
import Clock from './Clock.vue';
import Flash from './Flash.vue';

const props = defineProps<{
  object: BaseObject;
  currentTime: number;
  currentReferenceFrame: number;
  origin: Position;
}>();

defineEmits<{
  (e: 'update-current-x', id: number, x: number): void;
  (e: 'update-current-time', time: number): void;
  (e: 'show-object-info', info: { id: number; x: number; time?: number; velocity: number; velocityLab?: number }): void;
  (e: 'hide-object-info'): void;
}>();

const objectComponent = computed(() => {
  switch (props.object.getProperties().type) {
    case 'box':
      return Box;
    case 'clock':
      return Clock;
    case 'flash':
      return Flash;
    default:
      throw new Error(`Unknown object type: ${props.object.getProperties().type}`);
  }
});
</script>
