import React, { useEffect, useState } from 'react';
import api from '../services/api';
import TodoList from '../components/TodoList';
import { Todo } from '../types/todo';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [filter, setFilter] = useState<'all'|'done'|'undone'>('all');


  useEffect( () => {
    const token = localStorage.getItem("token");
    if(token){
      setIsAuthorized(true);
    }
    else{
      navigate("/register");
    }
  }, [navigate]);

  useEffect(() => {
    if(isAuthorized === null) return;
    fetchTodos();
  },[isAuthorized]);

  const fetchTodos = async () => {
    const token = localStorage.getItem('token');
    if(token){
      try{
        const response = await api.get('/todo', {
          headers:{
            Authorization: `Bearer ${token}`,
          },
        });
        setTodos(response.data);
        
      }catch(error: any){
        if(error.response && error.response.status === 401){
           console.error("Token expired or unauthorized:", error.response.data);
           localStorage.removeItem("token");
           navigate("/register");
        }
        else{
          console.error("Failed to fetch todos", error);
        }
      }
    }
  };

  const filteredTodos = todos.filter(todo => {
    if(filter === 'done') return todo.isDone;
    if(filter === 'undone') return !todo.isDone;
    return true;
  });
   //
  console.log(filteredTodos);


  const handleAdd = async () => {
    if(!newTitle.trim()) return;
    await api.post('/todo', {title: newTitle, isDone: false});
    setNewTitle('');
    fetchTodos();
 
  };
  const handleDelete = async (id: number) => {
    await api.delete(`/todo/${id}`);
    fetchTodos();
  
  };

  const handleEdit = (todo: Todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
  };

  const handleUpdate = async() => {
    if( editId === null) return;
    await api.put(`/todo/${editId}`,{title: editTitle});
    setEditId(null);
    setEditTitle('');
    fetchTodos();
  };
  const toggleDone = async (todo: Todo) => {
    await api.put(`/todo/${todo.id}`,{
      ...todo,
      isDone: !todo.isDone,
    });
    fetchTodos();
  };


  if (isAuthorized === null) return null;



  return (
    <div>
        <TodoList 
        todos={filteredTodos}
        newTitle={newTitle}
        onNewTitleChange={setNewTitle}
        onAdd={handleAdd}
        editId={editId}
        editTitle={editTitle}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onUpdate={handleUpdate}
        onEditTitleChange={setEditTitle}
        onToggleDone={toggleDone}
        onCancelEdit={() => setEditId(null)}
        filter={filter}
        setFilter={setFilter}
        />
    </div>
  );
};

export default Home;