<template>
  <div class="create-box-form">
    <h4>Box</h4>
    <div class="form-group">
      <label for="velocity">Velocity (c)</label>
      <div class="input-with-select">
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
        <select v-model="velocityFrame" class="frame-select">
          <option value="lab">Lab Frame</option>
          <option value="current">Current Frame</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>Initial Conditions: x0 and t0</label>
      <div class="input-with-select">
        <input
          id="x0"
          v-model.number="x0"
          type="number"
          class="form-input"
          placeholder="x0"
        >
        <select v-model="positionFrame" class="frame-select">
          <option value="lab">Lab Frame</option>
          <option value="current">Current Frame</option>
        </select>
      </div>
      <div class="input-with-select">
        <input
          id="t0"
          v-model.number="t0"
          type="number"
          class="form-input"
          placeholder="t0"
        >
      </div>
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
const x0 = ref(0);
const t0 = ref(0);
const velocityFrame = ref('lab');
const positionFrame = ref('lab');
let nextId = 1;

function createBox(): void {
  let velocityLab = velocity.value;
  let x0Lab = x0.value;
  let t0Lab = t0.value;
  console.log('lab values:', { velocityLab, x0Lab, t0Lab });

  if (velocityFrame.value === 'current') {
    velocityLab = physics.transformVelocityToLab(velocity.value, props.currentReferenceFrame);
  }
  if (positionFrame.value === 'current') {
    x0Lab = physics.transformPositionToLab(x0.value, velocityLab, t0Lab);
    t0Lab = physics.transformTimeToLab(t0.value, velocityLab, x0Lab);
  }
  console.log('transformed values:', { velocityLab, x0Lab, t0Lab });

  const box = new Box(
    nextId++,
    x0Lab,
    t0Lab,
    velocityLab
  );
  emit('boxCreated', box);
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
  width: 100px;
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

.input-with-select {
  display: flex;
  gap: 8px;
}

.frame-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 100px;
}
</style>
