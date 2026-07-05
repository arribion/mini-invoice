import React, { useState } from "react";
// import { useAuth } from "./context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const { login, loading } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // login(email, password); // use entered credentials
  };

  return (
    <section className="min-h-[80vh] flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="shadow-card mt-[5em] w-fit p-4 rounded max-h-fit">
        <h1 className="text-center font-bold">GT LOGIN</h1>

        <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            type="email"
            id="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-1 w-full"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="password">Password:</label>
          <br />
          <input
            type="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-1 w-full"
          />
        </div>

        <button
          type="submit"
          // disabled={loading}
          className="bg-sky-500 text-slate-50 my-4 w-full rounded-2xl py-1">
          {/* {loading ? "Logging in..." : "Sign In"} */}
        </button>

        <button
          onClick={() => { toast.error("Tulia Nitakupanga bandae !"); }}
          type="submit"
          className="bg-sky-500 text-slate-50 my-4 w-full rounded py-1">
          Login
        </button>

        <Link to="/client/dashboard">
          <p className="text-center text-sky-500">Client Dashboard</p>
        </Link>
        <Link to="/admin/">
          <p className="text-center text-sky-500">Admin Dashboard</p>
        </Link>
      </form>
    </section>
  );
};

export default Login;
