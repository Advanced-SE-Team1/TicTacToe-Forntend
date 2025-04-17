import React, { useState } from "react";

interface RegistrationForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UserRegistrationProps {
  onSubmit: (form: RegistrationForm) => void;
  toggle: () => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ onSubmit, toggle }) => {
  const [form, setForm] = useState<RegistrationForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    onSubmit(form);
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}
        <button type="submit" className="w-full p-2 text-white bg-green-600 rounded">
          Register
        </button>
        <p className="mt-2 text-sm text-center">
          Already have an account?{" "}
          <span onClick={toggle} className="text-blue-600 underline cursor-pointer">
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default UserRegistration;
