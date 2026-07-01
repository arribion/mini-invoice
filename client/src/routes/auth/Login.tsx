import { Link } from "react-router-dom";

const Login = () => {
  return (
    <section className="min-h-[80vh] flex justify-center">
      <form
        action=""
        className="shadow-card mt-[5em] w-fit p-4 rounded max-h-fit">
        <h1 className="text-center font-bold">GT LOGIN</h1>
        <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            type="email"
            id="email"
            placeholder="email"
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
            className="border rounded p-1 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-slate-50 my-4 w-full rounded-2xl py-1 ">
          Sign In
        </button>
        <Link to="/client/dashboard">
          <p className="text-center text-sky-500">Client Dashboard</p>
        </Link>
      </form>
    </section>
  );
}

export default Login