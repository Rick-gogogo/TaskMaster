import React from 'react';
import {Todo} from '../types/todo';
import './TodoList.css';

interface TodoListProps{
  todos: Todo[];
  newTitle: string;
  onNewTitleChange:(title:string) => void;
  onAdd: () => void;
  filter: "all"|"done"|"undone";
  setFilter: (filter:"all"|"done"|"undone") => void;
  editId: number | null;
  editTitle: string;
  onDelete: (id:number) => void;
  onEdit: (todo: Todo) => void;
  onUpdate: () => void;
  onEditTitleChange: (title: string) => void;
  onToggleDone: (todo: Todo) => void;
  onCancelEdit: () => void;

}


const TodoList: React.FC<TodoListProps> = ({
  todos,
  newTitle,
  filter,
  setFilter,
  onNewTitleChange,
  onAdd,
  editId,
  editTitle,
  onDelete,
  onEdit,
  onUpdate,
  onEditTitleChange,
  onToggleDone,
  onCancelEdit,

}) => {
  return (
    <div className="todo-container">
      <h2 className="todo-header">MyTasks</h2>
      
      <div className="todo-filter">
        <label htmlFor="filter-select" className="todo-filter-label">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all'|'done'|'undone')}
          >
          <option value="all">All</option>
          <option value="done">Completed</option>
          <option value="undone">Incomplete</option>
        </select>

      </div>

      <div className="todo-input">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => onNewTitleChange(e.target.value)}
          placeholder="Add a task"
        />
        <button onClick={onAdd}>Add</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} style={{ textDecoration: todo.isDone ? 'line-through' : 'none' }}>
            {editId === todo.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => onEditTitleChange(e.target.value)}
                />
                <div className="todo-buttons">
                <button onClick={onUpdate}>Save</button>
                <button onClick={onCancelEdit}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={todo.isDone}
                  onChange={() => onToggleDone(todo)}
                />
                <span>{todo.title}</span>
                <div className="todo-buttons">
                <button onClick={() => onEdit(todo)}>Edit</button>
                <button onClick={() => onDelete(todo.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;