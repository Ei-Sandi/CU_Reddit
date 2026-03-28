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

    const isTokenExpired = (tokenString) => {
        try {
            const payload = JSON.parse(atob(tokenString.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch (e) {
            return true;
        }
    };

    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('access_token');

    if (storedUser && storedToken) {
        if (!isTokenExpired(storedToken)) {
            user.value = JSON.parse(storedUser)
            token.value = storedToken
        } else {
            // Token expired during absence
            localStorage.removeItem('access_token')
            localStorage.removeItem('user')
        }
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
