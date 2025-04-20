const API_URL = 'http://dono-01.danbot.host:8033'
export const registerUser = async (username: string, email: string, password: string) => {
    return await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, email, password})
    }).then(e => e.json())
}

export const loginUser = async (email: string, password: string) => {
    return await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    }).then(e => e.json())
}

export const logout = () => undefined

// export const setRefreshToken = (token: string) => localStorage.setItem('refresh_token', token)
// export const useRefreshToken = () => localStorage.getItem('refresh_token')
// export const setAccessToken = (token: string) => sessionStorage.setItem('access_token', token)
// export const useAccessToken = async (sessionStorage: Storage) => {
//     const token = sessionStorage.getItem('access_token')
//     if (token) {
//         const res = await fetch(`${API_URL}/verify`, {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         })
//         if (res.status !== 200) {
//             const refreshToken = useRefreshToken()
//             if (!refreshToken) {
//                 return undefined
//             }

//             const refreshTokenRes = await fetch(`${API_URL}/refreshToken`, {
//                 method: 'POST',
//                 headers: {
//                     refreshtoken: refreshToken
//                 }
//             })
//             if (refreshTokenRes.status !== 200) {
//                 sessionStorage.removeItem('refresh_token')
//                 return undefined
//             }

//             const {accessToken} = await refreshTokenRes.json()
//             setAccessToken(accessToken)
//             return accessToken
//         }
//     }
// }
