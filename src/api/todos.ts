import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL + '/todos/';

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

export const fetchTodos = () => axios.get<Todo[]>(API_URL);
export const addTodo = (todo: Omit<Todo, 'id' | 'created_at'>) => axios.post<Todo>(API_URL, todo);
export const updateTodo = (id: number, todo: Partial<Todo>) => axios.patch<Todo>(`${API_URL}${id}/`, todo);
export const deleteTodo = (id: number) => axios.delete(`${API_URL}${id}/`);
