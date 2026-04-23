import { getFreshToken } from "../components/auth/tokenManager";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const authHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
});

const fetchWithAuth = async (url, options, token, retry = true) => {
    const res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            ...authHeaders(token),
        },
    });

    if (res.status === 401 && retry) {
        try {
            const freshToken = await getFreshToken();
            return fetchWithAuth(url, options, freshToken, false);
        } catch  {
            throw new Error('SESSION_EXPIRED');
        }
    }
    return res;
}
export const api = {
    register: async (token, displayName, email) => {
        const res = await fetchWithAuth(
            `${API_BASE}/auth/register`,
             {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ displayName, email }),
        }, token);
        return res.json();
    },
    getMe: async (token) => {
        const res = await fetchWithAuth(
            `${API_BASE}/users/me`,
             { method: 'GET', headers: {}       
        },
        token);
        return res.json();
    },
    uploadPicture: async (token, file) => {
        const form = new FormData();
        form.append("profileImage", file);

        const res = await fetchWithAuth(
            `${API_BASE}/users/profile-picture`, 
            {
            method: "POST",
            headers: {},
            body: form,
        },
        token);
        return res.json();
    },
    deletePicture: async (token) => {
        const res = await fetchWithAuth(
            `${API_BASE}/users/profile-picture`,
             {
            method: "DELETE",
            headers: {},
        },        
        token);
        return res.json();
    },
};