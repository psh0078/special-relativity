<template>
  <div class="delete-object">
    <button
      class="open-dialog-btn"
      @click="showDialog = true"
    >
      Delete Objects
    </button>

    <div
      v-if="showDialog"
      class="delete-dialog-wrapper"
    >
      <div class="delete-dialog">
        <div class="dialog-header">
          <h2>Delete Objects</h2>
          <button
            class="close-btn"
            @click="showDialog = false"
          >
            ×
          </button>
        </div>

        <div class="object-list">
          <div
            v-for="object in props.objects"
            :key="object.getProperties().id"
            class="object-item"
          >
            <span class="object-name">{{ object.getProperties().type }}</span>
            <button
              class="delete-btn"
              :title="'Delete ' + object.getProperties().type"
              @click="confirmDelete(object)"
            >
              Delete
            </button>
          </div>
        </div>

        <div class="dialog-footer">
          <button
            class="cancel-btn"
            @click="showDialog = false"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { BaseObject } from '@/types/Objects';

const props = defineProps<{
  objects: BaseObject[];
}>();

const emit = defineEmits<{
  'delete-object': [objectId: number];
}>();

const showDialog = ref(false);

const confirmDelete = (object: BaseObject) => {
  emit('delete-object', object.getProperties().id);
};
</script>

<style scoped>
.delete-object {
  display: inline-block;
  position: relative;
}

.open-dialog-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.open-dialog-btn:hover {
  background-color: #c82333;
}

.delete-dialog-wrapper {
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 8px;
  z-index: 1000;
}

/* Update arrow to point down */
.delete-dialog-wrapper::before {
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

.delete-dialog {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  min-width: 300px;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
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

.object-list {
  padding: 16px 24px;
  overflow-y: auto;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.object-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #eee;
}

.object-name {
  font-size: 14px;
  color: #333;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}

.delete-btn:hover {
  background-color: #c82333;
}

.dialog-footer {
  padding: 16px 24px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
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

/* Backdrop for the dialog */
.delete-dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
