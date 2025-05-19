<template>
  <div class="frame-selector">
    <select
      v-model="selectedObjectId"
      class="frame-select"
      @change="onFrameChange"
    >
      <option :value="null">Lab Frame (v = 0c)</option>
      <option
        v-for="obj in frameObjects"
        :key="obj.getProperties().id"
        :value="obj.getProperties().id"
      >
        {{ obj.getProperties().type === 'box' ? 'Box' : 'Clock' }} #{{ obj.getProperties().id }}
        (v = {{ formatVelocity(obj.getProperties().velocityLab) }})
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { BaseObject } from '@/types/Objects';
import * as physics from '@/physics';

const props = defineProps<{
  objects: BaseObject[];
  currentFrame: number;
  currentTime: number;
  currentReferenceFrame: number;
}>();

const emit = defineEmits<{
  'frame-change': [frameVelocity: number];
  'time-change': [time: number];
}>();

const selectedObjectId = ref<number | null>(null);

const frameObjects = computed(() =>
  props.objects.filter(obj =>
    obj.getProperties().type === 'box' || obj.getProperties().type === 'clock'
  )
);

const selectedFrame = computed(() => {
  if (selectedObjectId.value === null) return 0;
  const obj = frameObjects.value.find(
    obj => obj.getProperties().id === selectedObjectId.value
  );
  return obj?.getProperties().velocityLab ?? 0;
});

watch(() => props.currentFrame, (newValue) => {
  const obj = frameObjects.value.find(
    obj => obj.getProperties().velocityLab === newValue
  );
  selectedObjectId.value = obj?.getProperties().id ?? null;
});

function onFrameChange() {
  emit('frame-change', selectedFrame.value);
  const selectedObject = frameObjects.value.find(
    obj => obj.getProperties().id === selectedObjectId.value
  );
  const currentX = selectedObject?.getProperties().currentX ?? 0;
  const transformedTime = physics.transformTimeToFrame(
    props.currentTime,
    selectedObject?.getVelocityInCurrentFrame(props.currentReferenceFrame) ?? 0,
    currentX
  );
  emit('time-change', transformedTime);
}

function formatVelocity(v: number) {
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(6)}c`;
}
</script>

<style scoped>
.frame-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.frame-select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  min-width: 200px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.frame-select:focus {
  outline: none;
  border-color: #3498db;
}

.frame-select option {
  padding: 8px;
}
</style>
