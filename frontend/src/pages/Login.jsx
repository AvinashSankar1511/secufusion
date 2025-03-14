import React from "react";
import { Link } from "react-router-dom";
import "./loginstyle.css";  

const Login = () => {
  return (
    <section className="auth-section" id="login">
      <div className="auth-box">
        <h2>Login</h2>
        <form>
          <div className="input-group">
            <input type="email" className="auth-input" placeholder="Email Address" required />
          </div>
          <div className="input-group">
            <input type="password" className="auth-input" placeholder="Password" required />
          </div>
          <button type="submit" className="auth-btn">Sign In</button>
          <div className="auth-links">
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
