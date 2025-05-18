<template>
  <div class="login-page">
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="form-input"
          >
        </div>
        <div v-if="error" class="error">{{ error }}</div>
        <button type="submit" :disabled="isLoading" class="submit-button">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <div class="register-link">
        Don't have an account?
        <button @click="showRegister = true" class="link-button">Register</button>
      </div>
    </div>

    <div v-if="showRegister" class="dialog-overlay">
      <div class="dialog">
        <div class="dialog-header">
          <h2>Register</h2>
          <button @click="showRegister = false" class="close-button">×</button>
        </div>
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="reg-username">Username</label>
            <input
              id="reg-username"
              v-model="registerUsername"
              type="text"
              required
              class="form-input"
            >
          </div>
          <div class="form-group">
            <label for="reg-password">Password</label>
            <input
              id="reg-password"
              v-model="registerPassword"
              type="password"
              required
              class="form-input"
            >
          </div>
          <div class="form-group">
            <label for="reg-email">Email</label>
            <input
              id="reg-email"
              v-model="registerEmail"
              type="email"
              required
              class="form-input"
            >
          </div>
          <div v-if="registerError" class="error">{{ registerError }}</div>
          <button type="submit" :disabled="isRegistering" class="submit-button">
            {{ isRegistering ? 'Registering...' : 'Register' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

// Login state
const username = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

// Register state
const showRegister = ref(false);
const registerUsername = ref('');
const registerPassword = ref('');
const registerEmail = ref('');
const registerError = ref('');
const isRegistering = ref(false);

async function handleLogin() {
  isLoading.value = true;
  error.value = '';

  try {
    const response = await fetch('http://localhost:8000/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    auth.setAuth(data.token, data.user.username);
    router.push('/');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Login failed';
  } finally {
    isLoading.value = false;
  }
}

async function handleRegister() {
  isRegistering.value = true;
  registerError.value = '';

  try {
    const response = await fetch('http://localhost:8000/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: registerUsername.value,
        password: registerPassword.value,
        email: registerEmail.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    showRegister.value = false;
    error.value = 'Registration successful! Please log in.';
  } catch (e) {
    registerError.value = e instanceof Error ? e.message : 'Registration failed';
  } finally {
    isRegistering.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 20px;
}

.login-container {
  background: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  margin: 0 0 24px;
  font-size: 24px;
  color: #333;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.submit-button {
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: #2980b9;
}

.submit-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.error {
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
}

.register-link {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.link-button {
  background: none;
  border: none;
  color: #3498db;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
}

.link-button:hover {
  color: #2980b9;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  position: relative;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
