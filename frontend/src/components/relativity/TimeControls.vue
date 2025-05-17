<template>
  <div class="time-controls">
    <div class="time-controls-header">
      <h3>Time Controls</h3>
      <div class="time-display-group">
        <span class="time-display">t = {{ displayTime.toFixed(5) }}</span>
        <div class="time-params-dropdown">
          <button class="params-button" @click="showParams = !showParams">
            ⚙️
          </button>
          <div v-if="showParams" class="params-menu">
            <div class="range-input">
              <label for="tMin">t_min:</label>
              <input
                id="tMin"
                v-model.number="tMin"
                type="number"
                step="0.1"
                class="form-input"
              >
            </div>
            <div class="range-input">
              <label for="tMax">t_max:</label>
              <input
                id="tMax"
                v-model.number="tMax"
                type="number"
                step="0.1"
                class="form-input"
              >
            </div>
            <div class="range-input">
              <label for="tStep">t_step:</label>
              <select
                id="tStep"
                v-model.number="tStep"
                class="form-input"
              >
                <option :value="0.001">0.001</option>
                <option :value="0.01">0.01</option>
                <option :value="0.1">0.1</option>
                <option :value="1">1</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="button-group">
      <button class="control-button step" @click="stepTime(-tStep)">
        <span class="button-icon">⏪</span>
      </button>
      <button
        class="control-button play-pause"
        :class="{ 'is-playing': isAnimating }"
        @click="toggleAnimation"
      >
        <span class="button-icon">{{ isAnimating ? '⏸️' : '▶️' }}</span>
        <span class="button-text">{{ isAnimating ? 'Pause' : 'Play' }}</span>
      </button>
      <button class="control-button step" @click="stepTime(tStep)">
        <span class="button-icon">⏩</span>
      </button>
      <button
        class="control-button reset"
        @click="resetSimulation"
      >
        <span class="button-icon">↺</span>
        <span class="button-text">Reset</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
});

const props = defineProps<{
  time: number;
}>();

const emit = defineEmits(['reset', 'updateTime']);

const isAnimating = ref<boolean>(false);
const lastTimestamp = ref(0);
let animationFrameId: number | null = null;

const tMin = ref(-10);
const tMax = ref(10);
const tStep = ref(0.01);
const showParams = ref(false);

const displayTime = computed(() => props.time);

function toggleAnimation(): void {
  isAnimating.value = !isAnimating.value;

  if (isAnimating.value) {
    lastTimestamp.value = 0;
    animationFrameId = requestAnimationFrame(animate);
  }
}

function resetSimulation(): void {
  isAnimating.value = false;
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
  emit('reset');
}

function animate(): void {
  if (!isAnimating.value) return;

  const deltaTime = tStep.value;
  const currentTime = Number((props.time + deltaTime).toFixed(5));
  if (currentTime > tMax.value) {
    isAnimating.value = false;
    return;
  }
  emit('updateTime', currentTime);

  animationFrameId = requestAnimationFrame(animate);
}

function stepTime(amount: number): void {
  const newTime = props.time + amount;
  if (newTime >= tMin.value && newTime <= tMax.value) {
    emit('updateTime', Number(newTime.toFixed(5)));
  }
}
</script>

<style scoped>
.time-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-controls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.time-display-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-params-dropdown {
  position: relative;
}

.params-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  font-size: 16px;
  color: #666;
  transition: color 0.2s;
}

.params-button:hover {
  color: #333;
}

.params-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  margin-top: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 200px;
}

.range-input {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.range-input:last-child {
  margin-bottom: 0;
}

.range-input label {
  min-width: 50px;
  font-size: 14px;
  color: #666;
}

.form-input {
  width: 80px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.button-group {
  display: flex;
  gap: 8px;
}

.control-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f0f0f0;
  color: #333;
}

.control-button:hover {
  background-color: #e0e0e0;
}

.control-button.play-pause {
  background-color: #3498db;
  color: white;
}

.control-button.play-pause:hover {
  background-color: #2980b9;
}

.control-button.reset {
  background-color: #f0f0f0;
  color: #666;
}

.control-button.reset:hover {
  background-color: #e0e0e0;
}

.control-button.step {
  background-color: #f0f0f0;
  color: #333;
}

.control-button.step:hover {
  background-color: #e0e0e0;
}

.button-icon {
  font-size: 16px;
}

.button-text {
  font-weight: 500;
}
</style>
