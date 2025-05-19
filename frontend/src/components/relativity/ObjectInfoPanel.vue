<template>
  <div
    v-if="visible"
    class="object-info"
  >
    <div>ID: #{{ objectInfo?.id }}</div>
    <div>x (current frame): {{ objectInfo?.x.toFixed(5) }}</div>
    <div
      v-if="objectInfo?.time !== undefined"
    >
      t' (current frame): {{ objectInfo.time.toFixed(2) }}
    </div>
    <div>v' (current frame): {{ objectInfo?.velocity.toFixed(6) }}c</div>
    <div
      v-if="objectInfo?.velocityLab !== undefined"
    >
      v (lab frame): {{ objectInfo.velocityLab.toFixed(2) }}c
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

type ObjectInfo = {
  id: number;
  x: number;
  time?: number;
  velocity: number;
  velocityLab?: number;
};

defineProps<{
  objectInfo: ObjectInfo | null;
  visible: boolean;
}>();
</script>

<style scoped>
.object-info {
  position: fixed;
  bottom: 20px;
  right: 20px;
  color: #333;
  font-size: 14px;
  font-family: monospace;
  text-align: right;
  line-height: 1.4;
  z-index: 1000;
  pointer-events: none;
  text-shadow:
    -1px -1px 0 white,
    1px -1px 0 white,
    -1px 1px 0 white,
    1px 1px 0 white;
}
</style>
