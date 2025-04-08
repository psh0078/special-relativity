<template>
  <div class="control-panel">
    <div class="control-section simulation-controls">
      <h2>Simulation</h2>
      <TimeControls
        :time="time"
        @reset="emit('reset')"
        @update-time="emit('update-time', $event)"
      />
    </div>

    <div class="control-section frame-controls">
      <h2>Reference Frame</h2>
      <FrameSelector
        :box-objects="boxObjects"
        :current-frame="currentReferenceFrame"
        @frame-change="emit('frame-change', $event)"
      />
    </div>

    <div class="control-section object-controls">
      <h2>Create Objects</h2>
      <CreateBox
        :origin="origin"
        :current-reference-frame="currentReferenceFrame"
        @box-created="emit('box-created', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Box as BoxClass } from '@/types/Objects';
import type { Position } from '@/types/Objects';
import TimeControls from './TimeControls.vue';
import FrameSelector from './FrameSelector.vue';
import CreateBox from './CreateBox.vue';

defineProps<{
  time: number;
  boxObjects: BoxClass[];
  currentReferenceFrame: number;
  origin: Position;
}>();

const emit = defineEmits<{
  'reset': [];
  'update-time': [time: number];
  'frame-change': [frameVelocity: number];
  'box-created': [box: BoxClass];
}>();
</script>

<style scoped>
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 300px;
}

.control-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}
</style>
