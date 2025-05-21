<template>
  <div class="create-object">
    <button
      class="open-dialog-btn"
      @click="showDialog = true"
    >
      Create Object
    </button>

    <div
      v-if="showDialog"
      class="create-dialog-wrapper"
    >
      <div class="create-dialog">
        <div class="dialog-header">
          <h2>Create Object</h2>
          <button
            class="close-btn"
            @click="showDialog = false"
          >
            ×
          </button>
        </div>

        <div class="dialog-content">
          <div class="form-group">
            <label for="objectType">Object Type</label>
            <select
              id="objectType"
              v-model="selectedObjectType"
              class="frame-select"
              @change="handleObjectTypeChange"
            >
              <option value="box">📦 Box</option>
              <option value="clock">⏰ Clock</option>
              <option value="flash">⚡️ Flash</option>
            </select>
          </div>
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
                :class="{ 'error-input': isInvalidFlashVelocity }"
                placeholder="Enter velocity"
              >
              <select v-model="velocityFrame" class="frame-select">
                <option value="lab">Lab Frame</option>
                <option value="current">Current Frame</option>
              </select>
            </div>
            <div v-if="isInvalidFlashVelocity" class="error-message">
              Flash velocity must be either 1 or -1
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
              <select v-model="initialConditionsFrame" class="frame-select">
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
        </div>

        <div class="dialog-footer">
          <button
            class="cancel-btn"
            @click="showDialog = false"
          >
            Cancel
          </button>
          <button
            @click="handleCreate"
            class="create-button"
            :disabled="isInvalidFlashVelocity"
          >
            Create {{ selectedObjectType.charAt(0).toUpperCase() + selectedObjectType.slice(1) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Box, Clock, Flash, type Position, type BaseObject } from '@/types/Objects';
import * as physics from '@/physics';

const props = defineProps<{
  origin: Position,
  currentReferenceFrame: number
}>()

const emit = defineEmits<{
  objectCreated: [object: BaseObject]
}>();

const selectedObjectType = ref('box');
const velocity = ref(0);
const x0 = ref<number>(0);
const t0 = ref<number>(0);
const velocityFrame = ref('current');
const initialConditionsFrame = ref('current');

const isInvalidFlashVelocity = computed(() => {
  return selectedObjectType.value === 'flash' && Math.abs(velocity.value) !== 1;
});

let nextId = 1;

const showDialog = ref(false);

function createObject(): void {
  if (isInvalidFlashVelocity.value) {
    return;
  }

  let velocityLab = velocity.value;
  let x0Lab = Number(x0.value);
  let t0Lab = Number(t0.value);
  if (velocityFrame.value === 'current') {
    velocityLab = physics.transformVelocityToLab(velocity.value, props.currentReferenceFrame);
  }
  if (initialConditionsFrame.value === 'current') {
    x0Lab = physics.transformPositionToLab(x0.value, props.currentReferenceFrame, t0.value);
    t0Lab = physics.transformTimeToLab(t0.value, props.currentReferenceFrame, x0.value);
  }
  console.log('Stored lab values:', { velocityLab, x0Lab, t0Lab });

  let object: BaseObject;
  switch (selectedObjectType.value) {
    case 'box':
      object = new Box(
        nextId++,
        x0Lab,
        t0Lab,
        velocityLab
      );
      break;
    case 'clock':
      object = new Clock(
        nextId++,
        x0Lab,
        t0Lab,
        velocityLab
      );
      break;
    case 'flash':
      object = new Flash(
        nextId++,
        x0Lab,
        t0Lab,
        velocityLab
      );
      break;
    default:
      throw new Error(`Unsupported object type: ${selectedObjectType.value}`);
  }

  emit('objectCreated', object);
}

function handleObjectTypeChange(): void {
  if (selectedObjectType.value === 'flash') {
    velocity.value = 1;
  } else {
    velocity.value = 0;
  }
}

function handleCreate(): void {
  createObject();
  showDialog.value = false;
  // Reset form
  velocity.value = selectedObjectType.value === 'flash' ? 1 : 0;
  x0.value = 0;
  t0.value = 0;
}
</script>

<style scoped>
.create-object {
  display: inline-block;
  position: relative;
}

.open-dialog-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.open-dialog-btn:hover {
  background-color: #2980b9;
}

.create-dialog-wrapper {
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 8px;
  z-index: 1000;
}

.create-dialog {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  min-width: 300px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
}

.create-dialog-wrapper::before {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid white;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
}

.dialog-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.dialog-content {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dialog-footer {
  padding: 16px 24px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.create-object-form {
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

.error-message {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
}

.error-input {
  border-color: #e74c3c !important;
}

.error-input:focus {
  border-color: #e74c3c !important;
}

.create-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background: #5a6268;
}
</style>
