import { useState } from "react";
import axios from "axios";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const projectSchema = z.object({
  projectName: z.string().min(3, "Project name must be at least 3 characters"),

  platform: z.string().min(2, "Platform is required"),

  ratePerHour: z.coerce.number().positive("Rate must be greater than 0"),

  status: z.enum(["ACTIVE", "PENDING", "CLOSED"]),

  description: z.string().min(10, "Description must be at least 10 characters"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const BASE_URL = import.meta.env.VITE_API_URL;
if (!BASE_URL) {
  console.log("error accessing base url on project upload form...")
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const ProjectUploadForm = () => {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema) as Resolver<ProjectFormData>,
    defaultValues: {
      projectName: "",
      platform: "",
      ratePerHour: 0,
      status: "ACTIVE",
      description: "",
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setServerError("");
      setSuccess("");

      // Remap front-end camelCase to backend snake_case keys
      const backendData = {
        project_name: data.projectName,
        platform: data.platform,
        avg_pay: data.ratePerHour,
        description: data.description,
        status: data.status,
      };

      // Send the correctly formatted payload
      await api.post(
        "https://mini-invoice.onrender.com/api/v1/projects/",
        backendData,
      );

      setSuccess("Project created successfully.");
      reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || "Unable to create project.",
        );
      } else {
        setServerError("Something went wrong.");
      }
    }
  };


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto bg-slate-50 w-full space-y-5 rounded-[10px] border border-gray-200 z-50 p-8 shadow-sm">
      <h2 className="text-xl font-semibold text-sky-500">Create Project</h2>

      <div>
        <label className="mb-2 block font-medium">Project Name</label>

        <input
          {...register("projectName")}
          placeholder="Project Vox"
          className="w-full rounded border px-3 py-1 outline-none focus:border-green-500"
        />

        {errors.projectName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.projectName.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block font-medium">Platform</label>

        <input
          {...register("platform")}
          placeholder="Handshake"
          className="w-full rounded border px-3 py-1 outline-none focus:border-green-500"
        />

        {errors.platform && (
          <p className="mt-1 text-sm text-red-600">{errors.platform.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Average Pay / Hour (KES)
        </label>

        <input
          type="number"
          {...register("ratePerHour")}
          placeholder="1000"
          className="w-full rounded border px-3 py-1 outline-none focus:border-green-500"
        />

        {errors.ratePerHour && (
          <p className="mt-1 text-sm text-red-600">
            {errors.ratePerHour.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block font-medium">Status</label>

        <select
          {...register("status")}
          className="w-full rounded border px-3 py-1 outline-none focus:border-green-500">
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="CLOSED">Closed</option>
        </select>

        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block font-medium">Description</label>

        <textarea
          rows={5}
          {...register("description")}
          placeholder="AI response review and quality assurance..."
          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-500"
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* status message */}
      {serverError && (
        <div className="rounded bg-red-100 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {success && (
        <div className="rounded bg-green-100 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
        {isSubmitting ? "Creating Project..." : "Create Project"}
      </button>
    </form>
  );
};

export default ProjectUploadForm;
