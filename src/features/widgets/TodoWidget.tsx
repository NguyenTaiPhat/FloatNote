import { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@lib/utils';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

export function TodoWidget() {
    const [todos, setTodos] = useState<Todo[]>([
        { id: '1', text: 'Review pull requests', completed: false },
        { id: '2', text: 'Update documentation', completed: true },
        { id: '3', text: 'Plan next sprint', completed: false },
    ]);
    const [newTodo, setNewTodo] = useState('');

    const addTodo = () => {
        if (!newTodo.trim()) return;
        setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
        setNewTodo('');
    };

    const toggleTodo = (id: string) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const completed = todos.filter(t => t.completed).length;
    const total = todos.length;

    return (
        <div className="w-full h-full bg-background-secondary/95 backdrop-blur-xl border border-border rounded-2xl p-4 widget-shadow flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-sm font-semibold text-text-primary">Tasks</h2>
                    <p className="text-xs text-text-tertiary">
                        {completed}/{total} completed
                    </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                        {total > 0 ? Math.round((completed / total) * 100) : 0}%
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                {todos.map(todo => (
                    <motion.div
                        key={todo.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className={cn(
                            'flex items-center gap-2 p-2 rounded-lg hover:bg-surface transition-colors group',
                            todo.completed && 'opacity-60'
                        )}
                    >
                        <button
                            onClick={() => toggleTodo(todo.id)}
                            className={cn(
                                'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                                todo.completed
                                    ? 'bg-primary border-primary'
                                    : 'border-border hover:border-primary'
                            )}
                        >
                            {todo.completed && <Check size={12} className="text-white" />}
                        </button>
                        <span className={cn(
                            'flex-1 text-sm text-text-primary',
                            todo.completed && 'line-through'
                        )}>
                            {todo.text}
                        </span>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded transition-opacity"
                        >
                            <Trash2 size={14} className="text-red-500" />
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                    placeholder="Add task..."
                    className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary"
                />
                <button
                    onClick={addTodo}
                    className="w-9 h-9 bg-primary hover:bg-primary-light rounded-lg flex items-center justify-center transition-colors"
                >
                    <Plus size={18} className="text-white" />
                </button>
            </div>
        </div>
    );
}
