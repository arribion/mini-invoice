import TaskForm from "../../components/client/TaskForm";
import TaskLogExcelUpload from "../../components/client/TaskLogExcelUpload";

const Tasks = () => {
  return (
    <div className="p-2">
      {" "}
      <div>
        <p className="text-sm font-medium text-green-600">Dashboard / Tasks</p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          PROJECT <span className="text-sky-500">TASKS</span>
        </h1>

        <p className="mt-2 text-slate-500">
          Track invoices, payments and money transfers in one place.
        </p>
      </div>
      <section className="min-h-[80.8vh] border rounded-2xl border-gray-200 px-4 py-10">
        <TaskLogExcelUpload />
        <article className="mt-10">
          <h1 className="text-2xl font-bold text-slate-800">Upload Task Directly</h1>
          <h2 className="text-slate-800 my-4  font-bold">Create Task Log</h2>
          <TaskForm />
        </article>
      </section>
    </div>
  );
}

export default Tasks