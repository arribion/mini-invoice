const Login = () => {
  return (
    <section className="min-h-[80vh] flex justify-center">
      <form
        action=""
        className="shadow-card mt-[5em] w-fit p-4 rounded max-h-fit">
        <h1 className="text-center font-bold">Login</h1>
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
          Sign In
        </button>
      </form>
    </section>
  );
}

export default Login