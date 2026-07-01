// import React from 'react'

import { Link } from "react-router-dom";

const Register = () => {
  return (
    <section className="min-h-[80vh] flex justify-center">
      <form
        action=""
        className="shadow-card mt-[5em] w-fit p-4 rounded max-h-fit mb-[5em]">
        <h1 className="text-center font-bold">Create Account</h1>
        <div>
          <label htmlFor=""></label>
          <br />
          <input
            type="email"
            placeholder="John Doe"
            className="border rounded p-1 w-full"
          />
        </div>
        <div>
          <label htmlFor=""></label>
          <br />
          <input
            type="email"
            placeholder="johnDoe@example.com"
            className="border rounded p-1 w-full"
          />
        </div>
        <div>
          <label htmlFor=""></label>
          <br />
          <input
            type="password"
            placeholder="password"
            className="border rounded p-1 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-slate-50 my-4 w-full rounded-2xl py-2 ">
          Sign Up
        </button>
        <p className="text-center">Or</p>
        <p className="text-center">
          Already Have an Account?{" "}
          <Link to="/login" className="text-primary">
            {" "}
            click here
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
