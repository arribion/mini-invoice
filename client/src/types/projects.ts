export type ProjectStatus = "ACTIVE" | "PENDING" | "CLOSED" | "ON_HOLD";

export type Project = {
  id: number | string;
  name: string;
  description?: string;
  status: ProjectStatus;
  colorClass?: string;
  tags?: string[];
  taskers?: string[]; // array of Member.id
  rate?: number;
  createdAt?: string;
  updatedAt?: string;
  meta?: Record<string, unknown>;
};
