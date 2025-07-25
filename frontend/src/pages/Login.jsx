""// src/components/Login.jsx

import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import apiHandler from "../services/apiHandler"; 

const PageWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #e3feff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormWrapper = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 6px 6px 15px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-family: 'Pacifico', cursive;
  text-align: center;
  color: #003366;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  background-color: #003366;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #002244;
  }
`;

const TextButton = styled.p`
  text-align: center;
  color: #003366;
  margin-top: 10px;
  cursor: pointer;
  text-decoration: underline;
`;

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const res = await apiHandler.post("/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <PageWrapper>
      <FormWrapper>
        <Title>Login</Title>
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button onClick={handleLogin}>Login</Button>
        <TextButton onClick={() => navigate("/register")}>Don't have an account? Register here!</TextButton>
      </FormWrapper>
    </PageWrapper>
  );
}
