// import React from 'react'

import { Link } from "react-router-dom";

const adminQuickActionLinks = [
  {
    id: 1,
    path: "Create Member",
    link: "/admin/members",
  },
  {
    id: 1,
    path: "Add New Project",
    link: "/admin/members",
  },
  {
    id: 1,
    path: "Upload Resource",
    link: "/admin/members",
  },
  {
    id: 1,
    path: "Upload Resource",
    link: "/admin/members",
  },
  {
    id: 1,
    path: "Review Pending Payments",
    link: "/admin/members",
  },
];

const QuickActions = () => {
  return (
    <div className="rounded-[15px] border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-sky-700">Quick Actions</h2>
      <p className="mt-1 text-sm text-gray-500">
        Common admin tasks at a glance.
      </p>

      <div className="mt-6 space-y-3">
            {
                adminQuickActionLinks.map((p, i) => (   
                    <Link to={p.link}>
                        <button
                            key={i}
                            className="w-full my-1 rounded border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-sky-200">
                        {p.path}
                        </button>
                    </Link>  
                ))
            }
        <button className="w-full rounded bg-green-600 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-green-700">
            Create Member Login
        </button>
      </div>
    </div>
  );
}

export default QuickActions