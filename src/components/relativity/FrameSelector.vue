<template>
  <div class="frame-selector">
    <h3>Frame Selector</h3>
    <!--
    <div class="frame-option">
      <input
        type="radio"
        id="lab-frame"
        name="reference-frame"
        :value="0"
        v-model="selectedFrame"
        @change="onFrameChange"
      />
      <label for="lab-frame">Lab Frame (v = 0c)</label>
    </div>
    -->
    <div
      v-for="obj in objects"
      :key="obj.getProperties().id"
      class="frame-option"
    >
      <input
        type="radio"
        :id="`object-${obj.getProperties().id}`"
        name="reference-frame"
        :value="obj.getProperties().velocity"
        v-model="selectedFrame"
        @change="onFrameChange"
      />
      <label :for="`object-${obj.getProperties().id}`">
        Object #{{ obj.getProperties().id }}
        (v = {{ formatVelocity(obj.getProperties().velocity) }})
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  objects: {
    type:Array,
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

function formatVelocity(v) {
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(1)}c`;
}
</script>

<style scoped>
.frame-selector {
  margin-bottom: 1rem;
}

.frame-option {
  margin-bottom: 0.5rem;
}

label {
  margin-left: 0.5rem;
}
</style>
