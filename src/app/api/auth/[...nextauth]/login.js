import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role:", role);
    // Perform login logic here
  };

  return (
    <div className="login-container">
      <h2>REGISTRATION CLOSED</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="" disabled>
            Please Select User Role
          </option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <a href="#" className="forgot-password">
          Forgot Your Password?
        </a>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
