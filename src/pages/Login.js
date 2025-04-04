import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", margin: "10px auto", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", margin: "10px auto", padding: "8px" }}
        />
        <button type="submit" style={{ marginTop: "10px", padding: "8px 16px" }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: "20px" }}>
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;