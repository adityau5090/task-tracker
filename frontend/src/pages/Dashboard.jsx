import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../components/ToastProvider.jsx";
import TypewriterText from "../components/TypewriterText.jsx";
import FilterBar from "../components/FilterBar.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskForm from "../components/TaskForm.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { fetchTasks, createTask, updateTask, deleteTask } from "../services/api.js";

const STATUS_CYCLE = ["todo", "in-progress", "completed"];

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    sort: "newest",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  const loadTasks = useCallback(async () => {
    if (!user?._id && !user?.id) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchTasks(user._id || user.id, filters);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    const timeout = setTimeout(loadTasks, 250); // debounce search/filter changes
    return () => clearTimeout(timeout);
  }, [loadTasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    return { total, completed, inProgress, todo };
  }, [tasks]);

  const handleNewTask = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTask = async (formValues) => {
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask._id, formValues);
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        showToast("Task updated", "success");
      } else {
        const created = await createTask({ ...formValues, user: user._id || user.id });
        setTasks((prev) => [created, ...prev]);
        showToast("Task created", "success");
      }
      handleCloseForm();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleCycleStatus = async (task) => {
    const currentIndex = STATUS_CYCLE.indexOf(task.status);
    const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
    try {
      const updated = await updateTask(task._id, { ...task, status: nextStatus });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      showToast(`Marked as ${nextStatus.replace("-", " ")}`, "info");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    try {
      await deleteTask(deletingTask._id);
      setTasks((prev) => prev.filter((t) => t._id !== deletingTask._id));
      showToast("Task deleted", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeletingTask(null);
    }
  };

  return (
    <div className="dashboard">
      <section className="hero-greeting">
        <p className="hero-eyebrow">Signed in as</p>
        <h1 className="hero-name">
          <TypewriterText text={user?.name || "there"} />
        </h1>
        <p className="hero-email">
          <TypewriterText text={user?.email || ""} typingSpeed={55} erasingSpeed={30} />
        </p>
      </section>

      <section className="stats-row">
        <div className="stat-chip">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-chip stat-todo">
          <span className="stat-value">{stats.todo}</span>
          <span className="stat-label">To do</span>
        </div>
        <div className="stat-chip stat-progress">
          <span className="stat-value">{stats.inProgress}</span>
          <span className="stat-label">In progress</span>
        </div>
        <div className="stat-chip stat-done">
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </section>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onNewTask={handleNewTask}
        taskCount={tasks.length}
      />

      {loading && (
        <div className="state-panel">
          <div className="spinner" />
          <p>Loading your tasks…</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-panel state-panel-error">
          <p>{error}</p>
          <button className="btn btn-ghost" onClick={loadTasks}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="state-panel">
          <span className="state-panel-icon">🗒️</span>
          <p>No tasks match these filters yet.</p>
          <button className="btn btn-primary" onClick={handleNewTask}>
            Create your first task
          </button>
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <div className="task-grid">
          {tasks.map((task, index) => (
            <TaskCard
              key={task._id}
              task={task}
              index={index}
              onEdit={handleEditTask}
              onDelete={setDeletingTask}
              onCycleStatus={handleCycleStatus}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <TaskForm initialTask={editingTask} onClose={handleCloseForm} onSubmit={handleSubmitTask} />
      )}

      {deletingTask && (
        <ConfirmDialog
          title="Delete this task?"
          message={`"${deletingTask.title}" will be permanently removed.`}
          confirmLabel="Delete"
          onCancel={() => setDeletingTask(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Dashboard;
