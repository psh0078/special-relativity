<template>
  <div class="create-box-form">
    <div class="form-group">
      <label for="velocity">Velocity (c)</label>
      <input
        id="velocity"
        v-model.number="velocity"
        type="number"
        step="0.1"
        min="-1"
        max="1"
        class="form-input"
        placeholder="Enter velocity"
      >
    </div>
    <div class="form-group">
      <label for="frame">Reference Frame</label>
      <select id="frame" v-model="selectedFrame" class="form-input">
        <option value="lab">Lab Frame</option>
        <option value="current">Current Frame</option>
      </select>
    </div>
    <button @click="createBox" class="create-button">
      Create Box
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Box, type Position } from '@/types/Objects';
import * as physics from '@/physics';

const props = defineProps<{
  origin: Position,
  currentReferenceFrame: number
}>()

const emit = defineEmits<{
  boxCreated: [box: Box]
}>();

const velocity = ref(0);
const selectedFrame = ref('lab');
let nextId = 1;

function createBox(): void {
  let velocityLab = velocity.value;
  const frameVelcity = props.currentReferenceFrame
  console.log('lab', velocityLab);

  if (selectedFrame.value === 'current') {
    velocityLab = physics.reverseTransformRelativeVelocity(velocity.value, frameVelcity);
  };

  const box = new Box(
    nextId++,
    props.origin.x,
    vscale(3, velocity.value, 200, props.origin.y * 2),
    velocityLab
  );
  emit('boxCreated', box);
}

function vscale(
  n: number,
  velocity: number,
  verticalStretchFactor: number,
  canvasHeight: number
): number {
  if (Math.abs(velocity) >= 1) {
    const edgeOffset = 20;
    return velocity > 0 ? edgeOffset : canvasHeight - edgeOffset;
  }
  const scaledValue = verticalStretchFactor *
                     Math.sign(velocity) *
                     (Math.exp(n * Math.abs(velocity)) - 1) /
                     (Math.exp(n) - 1);
  return (canvasHeight / 2) - scaledValue;
}
</script>

<style scoped>
.create-box-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.create-button {
  padding: 10px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: #2980b9;
}
</style>
