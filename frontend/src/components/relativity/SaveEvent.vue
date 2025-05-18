<template>
  <div class="save-event">
    <div v-if="!auth.isAuthenticated" class="auth-message">
      <p>Please <router-link to="/login">log in</router-link> to save events.</p>
    </div>
    <div v-else class="input-group">
      <input
        v-model="eventName"
        type="text"
        placeholder="Event name"
        class="input"
      >
      <button
        :disabled="!eventName || isSaving"
        class="button"
        @click="saveEvent"
      >
        {{ isSaving ? 'Saving...' : 'Save Event' }}
      </button>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { BaseObject } from '@/types/Objects';

const router = useRouter();
const auth = useAuthStore();
const props = defineProps<{
  objects: BaseObject[];
  currentTime: number;
  currentReferenceFrame: number;
}>();

const eventName = ref('');
const isSaving = ref(false);
const error = ref('');
const success = ref('');

const saveEvent = async () => {
  if (!eventName.value) return;

  if (!auth.isAuthenticated) {
    console.log('Not authenticated, token:', auth.token);
    router.push('/login');
    return;
  }

  isSaving.value = true;
  error.value = '';
  success.value = '';

  try {
    const eventData = {
      name: eventName.value,
      current_time: props.currentTime,
      current_reference_frame: props.currentReferenceFrame,
      objects: props.objects.map(obj => {
        const props = obj.getProperties();
        return {
          name: `${props.type}-${props.id}`,
          velocityLab: props.velocityLab,
          x0Lab: props.initialConditions.x0,
          t0Lab: props.initialConditions.t0
        };
      })
    };

    console.log('Sending request with token:', auth.token);
    const response = await fetch('http://localhost:8000/events/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${auth.token.value}`
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      console.log('Response not OK:', response.status, await response.text());
      if (response.status === 401) {
        // Token expired or invalid
        auth.clearAuth();
        router.push('/login');
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error('Failed to save event');
    }

    success.value = 'Event saved successfully!';
    eventName.value = '';
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save event';
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.save-event {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.auth-message {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.auth-message a {
  color: #3498db;
  text-decoration: none;
}

.auth-message a:hover {
  text-decoration: underline;
}

.input-group {
  display: flex;
  gap: 8px;
}

.input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.input:focus {
  outline: none;
  border-color: #3498db;
}

.button {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button:hover:not(:disabled) {
  background-color: #2980b9;
}

.button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.error {
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
}

.success {
  color: #2ecc71;
  font-size: 14px;
  text-align: center;
}
</style>
