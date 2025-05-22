<template>
  <nav class="navigation">
    <div class="nav-content">
      <router-link
        to="/"
        class="home-link"
      >
        Special Relativity Simulator
      </router-link>
      <div class="auth-section">
        <template v-if="auth.isAuthenticated">
          <span class="username">Welcome, {{ auth.username }}</span>
          <button
            class="logout-button"
            @click="handleLogout"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <router-link
            to="/login"
            class="login-button"
          >
            Login
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const handleLogout = () => {
  auth.clearAuth();
  router.push('/login');
};
</script>

<style scoped>
.navigation {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 12px 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.home-link {
  color: #333;
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
}

.home-link:hover {
  color: #3498db;
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  color: #666;
  font-size: 14px;
}

.login-button,
.logout-button {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.login-button {
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border: none;
}

.login-button:hover {
  background-color: #2980b9;
}

.logout-button {
  background-color: #f0f0f0;
  color: #666;
  border: 1px solid #ddd;
}

.logout-button:hover {
  background-color: #e0e0e0;
}
</style>
