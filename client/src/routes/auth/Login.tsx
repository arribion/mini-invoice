import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Destructure matching your AuthContext properties (isLoading instead of loading)
  const { login, isLoading, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect users instantly if they are already logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/client/dashboard", { replace: true });
      }
    }
  }, [isLoggedIn, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Call the context function passing your local form states
    login(email, password);
  };

  return (
    <section className="min-h-[80vh] flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="shadow-card md:w-md mt-[5em] w-fit p-4 rounded max-h-fit">
        <h1 className="text-center font-bold text-2xl text-sky-500">
          GT LOGIN
        </h1>

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
            required
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
            required
          />
        </div>

        {/* Combined into a single, clean reactive action button */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-sky-500 text-slate-50 my-6 w-full rounded py-2 font-medium hover:bg-sky-600 transition-colors disabled:bg-slate-300">
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </section>
  );
};

export default Login;
