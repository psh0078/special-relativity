import { ref } from 'vue'

const authStore = {
  token: ref(localStorage.getItem('token') || ''),
  username: ref(localStorage.getItem('username') || ''),

  get isAuthenticated() {
    return !!this.token.value
  },

  setAuth(newToken: string, newUsername: string) {
    this.token.value = newToken
    this.username.value = newUsername
    localStorage.setItem('token', newToken)
    localStorage.setItem('username', newUsername)
  },

  clearAuth() {
    this.token.value = ''
    this.username.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  }
}

export function useAuthStore() {
  return authStore
}
