export const TASK_STATUSES = ["To Do", "In Progress", "Done"];

export const TASK_PRIORITIES = ["High", "Medium", "Low"];

export const SEED_TASKS = [
  {
    id: 1,
    title: "Prepare guest welcome kits",
    description: "Stock welcome amenities for rooms 101–110 before check-in.",
    assignedEmployeeId: 2,
    assignedEmployeeName: "Priya",
    priority: "High",
    status: "To Do",
    dueDate: "2026-06-20",
  },
  {
    id: 2,
    title: "Train front desk on new PMS",
    description: "Walk through reservation workflow and night-audit steps.",
    assignedEmployeeId: 1,
    assignedEmployeeName: "Ram",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2026-06-18",
  },
  {
    id: 3,
    title: "Audit housekeeping supply inventory",
    description: "Count linens, toiletries, and report low-stock items.",
    assignedEmployeeId: 2,
    assignedEmployeeName: "Priya",
    priority: "Low",
    status: "Done",
    dueDate: "2026-06-10",
  },
];

export const EMPTY_TASK_FORM = {
  title: "",
  description: "",
  assignedEmployeeId: "",
  priority: "",
  dueDate: "",
  status: "To Do",
};
