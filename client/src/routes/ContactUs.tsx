// import React, { useState } from 'react'

const ContactUs = () => {
    // const [name, setName] = useState<string>("");
    // const [email, setEmail] = useState<string>("");
    // const [phone, setPhone] = useState<string>("");
    // const [message, setMessage] = useState<string>("");

    const how_did_u_know_about_us = [
        "Google search",
        "Friend Suggetion",
        "Former Member"
    ];

    return (
      <section className="min-h-[70vh] mx-4">
        <h1 className="text-center font-semibold mt-[5em] ">contact Us</h1>
        <div className="flex justify-center">
          <form action="" className="shadow-card rounded-2xl p-4 max-w-md">
            <div className="mb-3">
              <label htmlFor="">Full name</label>
              <br />
              <input
                type="text"
                placeholder="e.g. Jina lako"
                className="border border-slate-400 w-full p-1 rounded"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="">Email</label>
              <br />
              <input
                type="text"
                placeholder="Jina@example.com"
                className="border border-slate-400 w-full p-1 rounded"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="">Phone</label>
              <br />
              <input
                type="text"
                placeholder="0700000000"
                className="border border-slate-400 w-full p-1 rounded"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="">How did you here about us?</label>
              <br />
              <select
                name=""
                id=""
                className="border border-slate-400 w-full p-1 rounded">
                {how_did_u_know_about_us.map((w, i) => (
                  <option value="" key={i}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="">Why do you what to join Us?</label>
              <br />
              <textarea
                name=""
                id=""
                className="border border-slate-400 w-full p-1 rounded max-h-[12em] min-h-[5em]"></textarea>
            </div>
          </form>
        </div>
      </section>
    );}

export default ContactUs