import { useState } from "react";
import { firebaseStub } from "../../auth/firebaseStub";
import BrandIcon from "../icons/BrandIcon";

export default function SignupPage({ onSignup, onGoLogin }) {
   const [form, setForm] = useState({ name:"", email:"", password:"", confirm: ""});
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const handle = async () => {
    setError("");
    if (!form.name.trim()) return setError("Please enter your display name.");
    if (!form.email.trim()) return setError("Please enter your email");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    
    setLoading(true);
    try {
        const user = await firebaseStub.signUp(form.email, form.password, form.name);
        onSignup(user);
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
              <div className="brand-icon"><BrandIcon /></div>
              <span className="brand-name">Pictura</span>
           </div>

           <h1 className="auth-title">Create account</h1>
           <p className="auth-subtitle">Set up your profile and get started in seconds.</p>
             {error && <div className="alert alert--error">{error}</div>}

             <div className="field">
               <label>Display name</label>
               <input
                placeholder="Alex Mwangi"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value}))}
                />
             </div>
             <div className="field">
               <label >Email address</label>
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
               placeholder="Min. 6 characters"
               value={form.password}
               onChange={e => setForm(f => ({ ...f, password: e.target.value}))}
                />
             </div>
             <div className="field">
               <label>Confirm password</label>
               <input 
               type="password"
               placeholder="Re-enter your password"
               value={form.confirm}
               onChange={e => setForm(f => ({ ...f, confirm: e.target.value}))}
               onKeyDown={e => e.key === "Enter" && handle()}
                />
             </div>

             <button className="btn-primary" onClick={handle} disabled={loading}>
               {loading
                  ? <><span className="spinner"/> Creating account... </>
                  : "Create account"
               }
             </button>
             <div className="auth-switch">
               Already have an account?
               <button onClick={onGoLogin}>Sign in</button>
             </div>
        </div>
      </div>
);
}