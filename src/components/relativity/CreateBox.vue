<template>
  <div class="create-box-form">
    <h3>Create New Box</h3>
    <div class="form-group">
      <label for="velocity">Velocity:</label>
      <input
        id="velocity"
        v-model.number="velocity"
        type="number"
        class="form-input"
      >
    </div>

    <button @click="createBox" class="create-button">
      Add Box
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Box, type Position } from '@/types/Objects';
import { vscale } from '@/physics';

const props = defineProps<{
  origin: Position
}>()

const emit = defineEmits<{
  boxCreated: [box: Box]
}>();

const velocity = ref(0);
let nextId = 1;

function createBox(): void {
  const box = new Box(
    nextId++,
    props.origin.x,
    vscale(3, velocity.value, 500, 700),
    velocity.value,
  );
  emit('boxCreated', box);
}
</script>

<style scoped>
.create-box-form {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
  max-width: 300px;
}

.form-group {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-input {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 120px;
}

.create-button {
  background-color: #4CAF50;
  color: white;
}
</style>
