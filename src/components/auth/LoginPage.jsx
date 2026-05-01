import { useState } from "react";
import { firebaseStub } from "../../auth/firebaseStub";
import BrandIcon from "../icons/BrandIcon";

export default function LoginPage({ onLogin, onGoSignup }) {
    const [form, setForm] = useState({ email: "", password: ""});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handle = async () => {
        setError("");
        if (!form.email.trim()) return setError("Please enter your email.");
        if (!form.password) return setError("Please enter your password.");
        setLoading(true);
        try {
            const user = await firebaseStub.signIn(form.email, form.password);
            onLogin(user);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
          <div className="auth-card fade-up">
            <div className="brand">
                <div className="brand-icon">
                  <BrandIcon />
                </div>
                <span className="brand-name">Pictura</span>
            </div>

            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to manage your profile picture. </p>

            {error && <div className="alert alert--error">{error}</div>}

            <div className="field">
                <label>Email address</label>
                <input 
                  type="email"
                  placeholder="alex@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value}))}
                  />
            </div>
            <div className="field">
              <label>Password</label>
              <input 
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value}))}
              onKeyDown={e => e.key === "Enter" && handle()}
               />
            </div>

            <button className="btn-primary" onClick={handle} disabled={loading}>
              {loading
                ? <><span className="spinner"/> Sign in... </>
                : "Signing in"
              }
            </button>

            <div className="auth-switch">
               Don't have an account?
               <button onClick={onGoSignup}>Sign up</button>
            </div>

          </div>
        </div>
    );
}