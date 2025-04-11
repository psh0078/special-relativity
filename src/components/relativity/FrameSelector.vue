<template>
  <div class="frame-selector">
    <select
      v-model="selectedFrame"
      class="frame-select"
      @change="onFrameChange"
    >
      <option :value="0">Lab Frame (v = 0c)</option>
      <option
        v-for="obj in boxObjects"
        :key="obj.getProperties().id"
        :value="obj.getProperties().velocityLab"
      >
        Object #{{ obj.getProperties().id }}
        (v = {{ formatVelocity(obj.getProperties().velocityLab) }})
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Box as BoxClass } from '@/types/Objects';

const props = defineProps({
  boxObjects: {
    type: Array as () => BoxClass[],
    default: () => []
  },
  currentFrame: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['frame-change']);

const selectedFrame = ref(props.currentFrame);

watch(() => props.currentFrame, (newValue) => {
  selectedFrame.value = newValue;
});

function onFrameChange() {
  emit('frame-change', selectedFrame.value);
}

function formatVelocity(v: number) {
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(1)}c`;
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
