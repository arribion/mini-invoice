
export function SettingsOverview() {
  return (
    <>
      <article>
        <div>
          <h1>Personal Information</h1>
          <p>Update your bio</p>
        </div>
        <form
          action=""
          className="bg-white  shadow-card  p-4 rounded-[15px] border my-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullname">Full Name:</label>
              <br />
              <input
                type="text"
                placeholder="John Doe"
                className="my-2 border p-1 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="fullname">Email:</label>
              <br />
              <input
                type="text"
                placeholder="John@example.com"
                className="my-2 border p-1 rounded w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 my-5">
            <div>
              <label htmlFor="role">Role:</label>
              <br />
              <input
                type="text"
                placeholder="Software Engineer"
                className="my-2 border p-1 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="Phone">Phone:</label>
              <br />
              <input
                type="text"
                placeholder="Phone"
                className="my-2 border p-1 rounded w-full"
              />
            </div>
          </div>
        </form>
      </article>
    </>
  );
}
