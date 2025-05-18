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
        :clock-objects="clockObjects"
        :current-frame="currentReferenceFrame"
        :current-time="time"
        :current-reference-frame="currentReferenceFrame"
        @frame-change="emit('frame-change', $event)"
        @time-change="emit('update-time', $event)"
      />
    </div>

    <div class="control-section object-controls">
      <h2>Create Objects</h2>
      <CreateObject
        :origin="origin"
        :current-reference-frame="currentReferenceFrame"
        @object-created="emit('object-created', $event)"
      />
      <DeleteObject
        :objects="objects"
        @delete-object="emit('delete-object', $event)"
      />
    </div>

    <div class="control-section save-controls">
      <h2>Save Event</h2>
      <SaveEvent
        :objects="objects"
        :current-time="time"
        :current-reference-frame="currentReferenceFrame"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Box as BoxClass, type BaseObject, Clock as ClockClass } from '@/types/Objects';
import type { Position } from '@/types/Objects';
import TimeControls from './TimeControls.vue';
import FrameSelector from './FrameSelector.vue';
import CreateObject from './CreateObject.vue';
import DeleteObject from './DeleteObject.vue';
import SaveEvent from './SaveEvent.vue';

defineProps<{
  time: number;
  objects: BaseObject[];
  boxObjects: BoxClass[];
  clockObjects: ClockClass[];
  currentReferenceFrame: number;
  origin: Position;
}>();

const emit = defineEmits<{
  'reset': [];
  'update-time': [time: number];
  'frame-change': [frameVelocity: number];
  'object-created': [box: BaseObject];
  'delete-object': [objectId: number];
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
