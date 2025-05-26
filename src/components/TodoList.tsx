import { useState, useEffect } from 'react'
import type { Todo } from '../api/todos'
import TodoItem from './TodoItem'

interface Props {
  todos: Todo[]
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
  onEdit: (id: number, title: string, description: string) => void
}

export default function TodoList({ todos, onToggle, onDelete, onEdit }: Props) {
  const [animatingItems, setAnimatingItems] = useState<Set<number>>(new Set())

  // Add animation for new items
  useEffect(() => {
    // const newItems = new Set(todos.map(todo => todo.id))
    const currentItems = new Set(Array.from(animatingItems))
    
    // Find newly added items
    const addedItems = todos
      .filter(todo => !currentItems.has(todo.id))
      .map(todo => todo.id)
    
    if (addedItems.length > 0) {
      setAnimatingItems(new Set([...currentItems, ...addedItems]))
      
      // Remove animation class after animation completes
      setTimeout(() => {
        setAnimatingItems(currentItems)
      }, 500)
    }
  }, [todos.length])

  return (
    <div className="divide-y divide-gray-100">
      {todos.map((todo, index) => (
        <div
          key={todo.id}
          className={`transform transition-all duration-500 ease-out ${
            animatingItems.has(todo.id)
              ? 'animate-slideInFromTop'
              : ''
          }`}
          style={{
            animationDelay: `${index * 50}ms`
          }}
        >
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      ))}
      
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slideInFromTop {
          animation: slideInFromTop 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}