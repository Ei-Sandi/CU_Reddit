import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const token = ref('')

    const user = ref({
        loggedIn: false,
        ID: 0,
        username: '',
        email: '',
        role: ''
    })

    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('access_token');

    if (storedUser && storedToken) {
        user.value = JSON.parse(storedUser)
        token.value = storedToken
    }

    function login(apiResponse) {
        token.value = apiResponse.access_token
        localStorage.setItem('access_token', token.value)

        user.value = {
            loggedIn: true,
            ID: apiResponse.user.ID,
            username: apiResponse.user.username,
            role: apiResponse.user.role
        }
        localStorage.setItem('user', JSON.stringify(user.value))
    }

    function logout() {
        token.value = ''
        localStorage.removeItem('access_token')

        user.value = {
            loggedIn: false,
            ID: 0,
            username: '',
            email: '',
            role: ''
        }
        localStorage.removeItem('user')
    }

    return { user, token, login, logout }
})
