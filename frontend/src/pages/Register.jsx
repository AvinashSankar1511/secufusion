import React from "react";
import { Link } from "react-router-dom";
import "./loginstyle.css";  

const Register = () => {
  return (
    <section className="auth-section" id="register">
      <div className="auth-box">
        <h2>Register</h2>
        <form>
          <div className="input-group">
            <input type="text" className="auth-input" placeholder="Full Name" required />
          </div>
          <div className="input-group">
            <input type="email" className="auth-input" placeholder="Email Address" required />
          </div>
          <div className="input-group">
            <input type="password" className="auth-input" placeholder="Password" required />
          </div>
          <div className="input-group">
            <input type="tel" className="auth-input" placeholder="Phone Number" required />
          </div>
          <div className="input-group">
            <input type="text" className="auth-input" placeholder="College ID" required />
          </div>
          <button type="submit" className="auth-btn">Sign Up</button>
          <div className="auth-links">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
