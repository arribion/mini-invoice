export type Member = {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  avatar: string;
};

export type ProjectAssignment = {
  _id: string;
  project_id: string;
  tasker_id: string;
  custom_rate: number | null;
  assigned_at: string;
  status: "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "REMOVED";
  removed_at: string | null;
  meta: any;
  createdAt: string;
  updatedAt: string;
};

export type TaskerWithAssignment = {
  assignment: ProjectAssignment;
  member: Member | undefined;
};
