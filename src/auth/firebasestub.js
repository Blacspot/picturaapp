export const firebaseStub = {
    signUp: async (email, password, displayName) => {
        await new Promise(r => setTimeout(r, 1200));

        if (!email.includes("@")) throw new Error("Invalid email address");
        if (password.length < 6) throw new Error("Password must be at least 6 characters");

        return {
            uid: "uid_" + Math.random().toString(36).slice(2),
            email,
            displayName,
            idToken: "mock_token_" + Date.now(),
        };
    },

    signIn: async (email, password) => {
        await new Promise(r => setTimeout(r, 1000));

        if (!email.includes("@")) throw new Error("Invalid email address");
        if (password.length < 6) throw new Error("Incorrect password");

        return {
            uid: "uid_demo",
            email,
            displayName: email.split("@")[0],
            idToken: "mock_token_" + Date.now(),
        };
    },
};