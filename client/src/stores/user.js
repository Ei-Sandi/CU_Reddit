import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const user = ref({ 
        loggedIn: false, 
        ID: 0,
        username: '', 
        email: '',
        role: '' 
    })

    const storedUser = localStorage.getItem('user')
    if (storedUser) {
        user.value = JSON.parse(storedUser)
    }

    function login(userData) {
        user.value = {
            loggedIn: true,
            ID: userData.ID,
            username: userData.username,
            email: userData.email,
            role: userData.role
        }
        localStorage.setItem('user', JSON.stringify(user.value))
    }

    function logout() {
        user.value = { 
            loggedIn: false,
            ID: 0, 
            username: '', 
            email: '',
            role: '' 
        }
        localStorage.removeItem('user')
    }

    return { user, login, logout }
})
