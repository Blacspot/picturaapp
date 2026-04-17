const API_BASE = "https://localhost:3000/api";

export const api = {
    register: async (token, displayName, email) => {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ displayName, email }),
        });
        return res.json();
    },
    getMe: async (token) => {
        const res = await fetch(`${API_BASE}/users/me`, {
            headers: { Authorization: `Bearer ${token}`},
        });
        return res.json();
    },
    uploadPicture: async (token, file) => {
        const form = new FormData();
        form.append("profileImage", file);

        const res = await fetch(`${API_BASE}/users/profile-picture`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`},
            body: form,
        });
        return res.json();
    },
};