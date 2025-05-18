<template>
  <div class="event-list">
    <h2>My Saved Events</h2>
    <div v-if="loading" class="loading">Loading events...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="events.length === 0" class="empty">
      No saved events yet. Create one using the save button above!
    </div>
    <div v-else class="events">
      <div v-for="event in events" :key="event.id" class="event-card">
        <div class="event-header">
          <h3>{{ event.name }}</h3>
          <span class="date">{{ formatDate(event.created_at) }}</span>
        </div>
        <div class="event-info">
          <span class="info-item">Time: {{ event.current_time.toFixed(3) }}</span>
          <span class="info-item">Frame: v = {{ event.current_reference_frame.toFixed(3) }}</span>
          <span class="info-item">Objects: {{ event.objects.length }}</span>
        </div>
        <button @click="confirmDelete(event.id)" class="delete-button">Delete</button>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="dialog-overlay" @click="cancelDelete">
        <div class="dialog" @click.stop>
          <h3>Delete Event</h3>
          <p>Are you sure you want to delete this event? This action cannot be undone.</p>
          <div class="dialog-buttons">
            <button class="cancel-button" @click="cancelDelete">Cancel</button>
            <button class="confirm-delete-button" @click="deleteEvent">Delete</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

interface Object {
  id: number;
  name: string;
  velocityLab: number;
  x0Lab: number;
  t0Lab: number;
}

interface Event {
  id: number;
  name: string;
  current_time: number;
  current_reference_frame: number;
  created_at: string;
  updated_at: string;
  objects: Object[];
}

const auth = useAuthStore();
const events = ref<Event[]>([]);
const loading = ref(true);
const error = ref('');
const showDeleteConfirm = ref(false);
const eventToDelete = ref<number | null>(null);

const fetchEvents = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await fetch('http://localhost:8000/events/', {
      headers: {
        'Authorization': `Token ${auth.token.value}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        auth.clearAuth();
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error('Failed to fetch events');
    }

    events.value = await response.json();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch events';
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (eventId: number) => {
  eventToDelete.value = eventId;
  showDeleteConfirm.value = true;
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  eventToDelete.value = null;
};

const deleteEvent = async () => {
  if (eventToDelete.value === null) return;

  try {
    const response = await fetch(`http://localhost:8000/events/${eventToDelete.value}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${auth.token.value}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete event');
    }

    // Remove the deleted event from the list
    events.value = events.value.filter(e => e.id !== eventToDelete.value);
    showDeleteConfirm.value = false;
    eventToDelete.value = null;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to delete event';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

onMounted(fetchEvents);
</script>

<style scoped>
.event-list {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  margin: 0 0 20px;
  color: #333;
  font-size: 24px;
}

.loading, .error, .empty {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #e74c3c;
}

.events {
  display: grid;
  gap: 20px;
}

.event-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.event-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.date {
  color: #666;
  font-size: 14px;
}

.event-info {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  color: #666;
  font-size: 14px;
}

.info-item {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
}

.objects {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.object {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.object-name {
  font-weight: 500;
  color: #333;
}

.object-details {
  color: #666;
  font-size: 14px;
}

.delete-button {
  padding: 6px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.delete-button:hover {
  background-color: #c0392b;
}

.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 90%;
}

.dialog h3 {
  margin: 0 0 16px;
  color: #333;
  font-size: 18px;
}

.dialog p {
  margin: 0 0 24px;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-button {
  padding: 8px 16px;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.confirm-delete-button {
  padding: 8px 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-delete-button:hover {
  background-color: #c0392b;
}
</style>
