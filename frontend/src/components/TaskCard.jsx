const STATUS_LABELS = {
  todo: "To do",
  "in-progress": "In progress",
  completed: "Completed",
};

const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const isOverdue = (dateStr, status) => {
  if (!dateStr || status === "completed") return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
};

const TaskCard = ({ task, index, onEdit, onDelete, onCycleStatus }) => {
  // Each card gets a distinct "pinned note" feel: rotation + entrance delay
  // derived from its position, so no two neighboring cards look identical.
  const variant = index % 6;
  const rotation = [-1.6, 1.2, -0.8, 2, -2.2, 0.9][variant];
  const delay = (index % 8) * 60;

  return (
    <article
      className={`task-card task-card--v${variant} status-${task.status} priority-${task.priority}`}
      style={{ "--tilt": `${rotation}deg`, "--delay": `${delay}ms` }}
    >
      <div className="task-card-pin" aria-hidden="true" />

      <header className="task-card-header">
        <span className={`badge badge-priority priority-${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        <span className={`badge badge-status status-${task.status}`}>
          {STATUS_LABELS[task.status]}
        </span>
      </header>

      <h3 className="task-card-title">{task.title}</h3>
      {task.description && <p className="task-card-desc">{task.description}</p>}

      <footer className="task-card-footer">
        {task.dueDate && (
          <span className={`task-due ${isOverdue(task.dueDate, task.status) ? "is-overdue" : ""}`}>
            {isOverdue(task.dueDate, task.status) ? "Overdue · " : "Due "}
            {formatDate(task.dueDate)}
          </span>
        )}

        <div className="task-card-actions">
          <button
            className="icon-btn"
            title="Cycle status"
            onClick={() => onCycleStatus(task)}
            aria-label="Change status"
          >
            ⟳
          </button>
          <button
            className="icon-btn"
            title="Edit task"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            ✎
          </button>
          <button
            className="icon-btn icon-btn-danger"
            title="Delete task"
            onClick={() => onDelete(task)}
            aria-label="Delete task"
          >
            🗑
          </button>
        </div>
      </footer>
    </article>
  );
};

export default TaskCard;
