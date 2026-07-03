// import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation Schema
const schema = yup.object().shape({
  id: yup.string().required("ID is required"),
  submission_id: yup.string().required("Submission ID is required"),
  task_ref: yup.string().required("Task Reference is required"),
  units_hours: yup
    .number()
    .typeError("Must be a number")
    .positive("Must be greater than 0")
    .required("Units/Hours is required"),
  entry_date: yup
    .date()
    .typeError("Invalid date")
    .required("Entry date is required"),
  flag_reason: yup.string().optional(),
});

const TaskForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log("Form Submitted Successfully:", data);
    reset();
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="text-gray-700 shadow-card max-w-md p-6 rounded-lg bg-white">
        <h2 className="text-slate-800 my-4  font-bold text-center">
          Create Task Log Directly
        </h2>

        {/* Submission ID Field */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Submission ID
          </label>
          <input
            type="text"
            {...register("submission_id")}
            className="border rounded p-1 w-full"
          />
          {errors.submission_id && (
            <p style={{ color: "red", fontSize: "12px", margin: "5px 0 0" }}>
              {errors.submission_id.message}
            </p>
          )}
        </div>

        {/* Task Reference Field */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Task Reference
          </label>
          <input
            type="text"
            {...register("task_ref")}
            className="border rounded p-1 w-full"
          />
          {errors.task_ref && (
            <p style={{ color: "red", fontSize: "12px", margin: "5px 0 0" }}>
              {errors.task_ref.message}
            </p>
          )}
        </div>

        {/* Units / Hours Field */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Units / Hours
          </label>
          <input
            type="number"
            step="0.1"
            {...register("units_hours")}
            className="border rounded p-1 w-full"
          />
          {errors.units_hours && (
            <p style={{ color: "red", fontSize: "12px", margin: "5px 0 0" }}>
              {errors.units_hours.message}
            </p>
          )}
        </div>

        {/* Entry Date Field */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Entry Date
          </label>
          <input
            type="date"
            {...register("entry_date")}
            className="border rounded p-1 w-full"
          />
          {errors.entry_date && (
            <p style={{ color: "red", fontSize: "12px", margin: "5px 0 0" }}>
              {errors.entry_date.message}
            </p>
          )}
        </div>

        {/* Flag Reason Field */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Flag Reason (Optional)
          </label>
          <textarea
            {...register("flag_reason")}
            className="w-full p-2 border rounded"
          />
          {errors.flag_reason && (
            <p style={{ color: "red", fontSize: "12px", margin: "5px 0 0" }}>
              {errors.flag_reason.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-sky-500 w-full text-white py-2 px-4 rounded hover:bg-sky-600 transition">
          Submit Log
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
