import { useState } from 'react'
import type { Todo } from '../api/todos'
import { Edit3, Trash2, Check, X, Calendar } from 'lucide-react'

interface Props {
  todo: Todo
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
  onEdit: (id: number, title: string, description: string) => void
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const [description, setDescription] = useState(todo.description)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const handleSave = () => {
    if (title.trim()) {
      onEdit(todo.id, title, description)
      setEditing(false)
    }
  }

  const handleCancel = () => {
    setTitle(todo.title)
    setDescription(todo.description)
    setEditing(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(todo.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      await onToggle(todo.id, !todo.completed)
    } finally {
      setIsToggling(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (editing) {
    return (
      <div className="group border-b border-gray-100 last:border-b-0">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Todo title"
                autoFocus
              />
            </div>
            
            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                placeholder="Add description..."
                rows={3}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim()}
                className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`group border-b border-gray-100 last:border-b-0 transition-all duration-200 ${
      isDeleting ? 'opacity-50 scale-95' : 'hover:bg-gray-50'
    }`}>
      <div className="p-6 flex items-start space-x-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              todo.completed
                ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
            } ${isToggling ? 'opacity-50' : ''}`}
          >
            {isToggling ? (
              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            ) : todo.completed ? (
              <Check className="w-4 h-4" />
            ) : null}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className={`transition-all duration-200 ${
            todo.completed ? 'opacity-60' : ''
          }`}>
            <h3 className={`text-lg font-semibold text-gray-900 mb-1 ${
              todo.completed ? 'line-through' : ''
            }`}>
              {todo.title}
            </h3>
            
            {todo.description && (
              <p className={`text-gray-600 mb-3 ${
                todo.completed ? 'line-through' : ''
              }`}>
                {todo.description}
              </p>
            )}
            
            {/* Meta Info */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(todo.created_at)}</span>
              </div>
              
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                todo.completed
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {todo.completed ? 'Completed' : 'Pending'}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setEditing(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Edit todo"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            title="Delete todo"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}