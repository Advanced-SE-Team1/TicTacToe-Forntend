import React, { useState } from "react";
interface LoginProps {
    onSubmit: (form: { email: string; password: string }) => void;
    toggle: () => void;
  }
  const Login: React.FC<LoginProps> = ({ onSubmit, toggle }) => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e:any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded">
          Login
        </button>
        <p className="mt-2 text-sm text-center">
          Don’t have an account?{" "}
          <span onClick={toggle} className="text-blue-600 underline cursor-pointer">
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;