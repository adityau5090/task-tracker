const FilterBar = ({ filters, onChange, onNewTask, taskCount }) => {
  const handle = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="filter-bar glass-panel">
      <div className="filter-bar-search">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          placeholder="Search tasks…"
          value={filters.search}
          onChange={handle("search")}
        />
      </div>

      <div className="filter-bar-selects">
        <select value={filters.status} onChange={handle("status")}>
          <option value="all">All statuses</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>

        <select value={filters.priority} onChange={handle("priority")}>
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select value={filters.sort} onChange={handle("sort")}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="dueDate">Due date</option>
          <option value="priority">Priority</option>
          <option value="title">Title (A–Z)</option>
        </select>
      </div>

      <div className="filter-bar-meta">
        <span className="task-count">{taskCount} task{taskCount === 1 ? "" : "s"}</span>
        <button className="btn btn-primary" onClick={onNewTask}>
          + New task
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
