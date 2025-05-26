import { useEffect, useState } from 'react'
import { fetchTodos, addTodo, updateTodo, deleteTodo } from './api/todos'
import type { Todo } from './api/todos'
import TodoList from './components/TodoList'
import AddTodoForm from './components/AddTodoForm'
import { CheckCircle, Clock, List, Plus } from 'lucide-react'
import './App.css'


function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')

  useEffect(() => {
    fetchTodos()
      .then(res => {
        setTodos(res.data)
        console.log(`todos are : ${JSON.stringify(res.data)}`);
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load todos')
        setLoading(false)
      })
  }, [])

  const handleAdd = (title: string, description: string) => {
    addTodo({ title, description, completed: false })
      .then(res => {
        setTodos([res.data, ...todos])
      })
      .catch(() => setError('Failed to add todo'))
  }

  const handleToggle = (id: number, completed: boolean) => {
    updateTodo(id, { completed })
      .then(res => {
        setTodos(todos.map(todo => (todo.id === id ? res.data : todo)))
      })
      .catch(() => setError('Failed to update todo'))
  }

  const handleDelete = (id: number) => {
    deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id))
      })
      .catch(() => setError('Failed to delete todo'))
  }

  const handleEdit = (id: number, title: string, description: string) => {
    updateTodo(id, { title, description })
      .then(res => {
        setTodos(todos.map(todo => (todo.id === id ? res.data : todo)))
      })
      .catch(() => setError('Failed to edit todo'))
  }

  const filteredTodos = todos.filter(todo =>
    filter === 'all' ? true :
    filter === 'completed' ? todo.completed :
    !todo.completed
  )

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 font-medium">Loading your todos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-red-500 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Todo Master
                </h1>
                <p className="text-gray-600 text-sm">Stay organized, stay productive</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Todo Form */}
        <div className="mb-8">
          <AddTodoForm onAdd={handleAdd} />
        </div>

        {/* Filter Buttons */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Tasks', icon: List, count: stats.total },
              { key: 'pending', label: 'Pending', icon: Clock, count: stats.pending },
              { key: 'completed', label: 'Completed', icon: CheckCircle, count: stats.completed }
            ].map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as typeof filter)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                  ${filter === key 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-105' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm hover:shadow-md'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-bold
                  ${filter === key 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {filteredTodos.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-12 h-12 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No todos yet' : 
                 filter === 'completed' ? 'No completed tasks' : 
                 'No pending tasks'}
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {filter === 'all' 
                  ? 'Start by adding your first todo item above'
                  : `You don't have any ${filter} tasks right now`
                }
              </p>
            </div>
          ) : (
            <TodoList
              todos={filteredTodos}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App