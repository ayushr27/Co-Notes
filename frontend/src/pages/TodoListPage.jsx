import React, { useState, useRef, useEffect } from 'react';
import {
    CheckSquare, Plus, Mic, MicOff, Trash2, Clock, Calendar,
    Circle, CheckCircle2, Star, Flag, ChevronDown, ChevronRight,
    Sun, Moon, Sunrise, Filter, SortAsc, MoreHorizontal, X,
    AlertCircle, Zap
} from 'lucide-react';

// Voice Recognition Hook
const useVoiceRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setIsSupported(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setTranscript(finalTranscript);
                }
            };

            recognitionRef.current.onend = () => setIsListening(false);
        }
        return () => recognitionRef.current?.stop();
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    return { isListening, transcript, isSupported, toggleListening, setTranscript };
};

const TodoListPage = () => {
    const [todos, setTodos] = useState([
        {
            id: 1,
            text: 'Complete project proposal',
            completed: false,
            priority: 'high',
            dueDate: new Date(Date.now() + 86400000),
            category: 'work',
            starred: true
        },
        {
            id: 2,
            text: 'Review pull requests on GitHub',
            completed: true,
            priority: 'medium',
            dueDate: new Date(),
            category: 'work',
            starred: false
        },
        {
            id: 3,
            text: 'Buy groceries for the week',
            completed: false,
            priority: 'low',
            dueDate: new Date(Date.now() + 172800000),
            category: 'personal',
            starred: false
        },
        {
            id: 4,
            text: 'Schedule dentist appointment',
            completed: false,
            priority: 'medium',
            dueDate: null,
            category: 'personal',
            starred: false
        },
        {
            id: 5,
            text: 'Prepare presentation slides',
            completed: false,
            priority: 'high',
            dueDate: new Date(Date.now() + 259200000),
            category: 'work',
            starred: true
        }
    ]);

    const [newTodoText, setNewTodoText] = useState('');
    const [newTodoPriority, setNewTodoPriority] = useState('medium');
    const [newTodoCategory, setNewTodoCategory] = useState('personal');
    const [showAddForm, setShowAddForm] = useState(false);
    const [filter, setFilter] = useState('all'); // all, active, completed
    const [sortBy, setSortBy] = useState('date'); // date, priority, alphabetical
    const [showCompleted, setShowCompleted] = useState(true);
    const [editingTodo, setEditingTodo] = useState(null);
    const [editText, setEditText] = useState('');

    const { isListening, transcript, isSupported, toggleListening, setTranscript } = useVoiceRecognition();
    const inputRef = useRef(null);

    const priorities = [
        { value: 'low', label: 'Low', icon: <Flag size={14} />, color: '#43e97b' },
        { value: 'medium', label: 'Medium', icon: <Flag size={14} />, color: '#fee140' },
        { value: 'high', label: 'High', icon: <Flag size={14} />, color: '#fa709a' }
    ];

    const categories = ['work', 'personal', 'shopping', 'health', 'learning'];

    useEffect(() => {
        if (transcript) {
            setNewTodoText(prev => prev + ' ' + transcript);
            setTranscript('');
        }
    }, [transcript]);

    const handleAddTodo = (e) => {
        e.preventDefault();
        if (newTodoText.trim()) {
            const newTodo = {
                id: Date.now(),
                text: newTodoText.trim(),
                completed: false,
                priority: newTodoPriority,
                dueDate: null,
                category: newTodoCategory,
                starred: false
            };
            setTodos([newTodo, ...todos]);
            setNewTodoText('');
            setShowAddForm(false);
        }
    };

    const toggleComplete = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const toggleStar = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, starred: !todo.starred } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const startEditing = (todo) => {
        setEditingTodo(todo.id);
        setEditText(todo.text);
    };

    const saveEdit = (id) => {
        if (editText.trim()) {
            setTodos(todos.map(todo =>
                todo.id === id ? { ...todo, text: editText.trim() } : todo
            ));
        }
        setEditingTodo(null);
        setEditText('');
    };

    const clearCompleted = () => {
        setTodos(todos.filter(todo => !todo.completed));
    };

    const getPriorityColor = (priority) => {
        return priorities.find(p => p.value === priority)?.color || '#667eea';
    };

    const formatDueDate = (date) => {
        if (!date) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDay = new Date(date);
        dueDay.setHours(0, 0, 0, 0);
        const diff = (dueDay - today) / 86400000;

        if (diff < 0) return { text: 'Overdue', class: 'overdue' };
        if (diff === 0) return { text: 'Today', class: 'today' };
        if (diff === 1) return { text: 'Tomorrow', class: 'tomorrow' };
        return { text: dueDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), class: 'future' };
    };

    // Filter and sort todos
    let filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    // Sort todos
    filteredTodos.sort((a, b) => {
        // Starred first
        if (a.starred && !b.starred) return -1;
        if (!a.starred && b.starred) return 1;

        // Then by sort criteria
        if (sortBy === 'priority') {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (sortBy === 'alphabetical') {
            return a.text.localeCompare(b.text);
        }
        // Default: by date
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    const activeTodos = filteredTodos.filter(t => !t.completed);
    const completedTodos = filteredTodos.filter(t => t.completed);
    const completedCount = todos.filter(t => t.completed).length;
    const totalCount = todos.length;

    return (
        <div className="todo-page">
            <header className="todo-header">
                <div className="header-title">
                    <CheckSquare size={28} className="header-icon" />
                    <div>
                        <h1>To-Do List</h1>
                        <p>{activeTodos.length} tasks remaining • {completedCount} completed</p>
                    </div>
                </div>
                <button className="btn-add-todo" onClick={() => setShowAddForm(true)}>
                    <Plus size={18} />
                    Add Task
                </button>
            </header>

            {/* Progress Bar */}
            <div className="todo-progress">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                    />
                </div>
                <span className="progress-text">{Math.round((completedCount / totalCount) * 100) || 0}% complete</span>
            </div>

            {/* Quick Add Form */}
            {showAddForm && (
                <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
                    <div className="todo-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2><Zap size={20} /> Add New Task</h2>
                            <button onClick={() => setShowAddForm(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddTodo} className="todo-form">
                            <div className="input-with-voice">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="What needs to be done?"
                                    value={newTodoText}
                                    onChange={(e) => setNewTodoText(e.target.value)}
                                    autoFocus
                                />
                                {isSupported && (
                                    <button
                                        type="button"
                                        className={`voice-btn ${isListening ? 'listening' : ''}`}
                                        onClick={toggleListening}
                                    >
                                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                                    </button>
                                )}
                            </div>
                            {isListening && (
                                <div className="voice-indicator">
                                    <span className="pulse-dot"></span> Listening...
                                </div>
                            )}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Priority</label>
                                    <div className="priority-options">
                                        {priorities.map(p => (
                                            <button
                                                key={p.value}
                                                type="button"
                                                className={`priority-btn ${newTodoPriority === p.value ? 'active' : ''}`}
                                                style={{ '--priority-color': p.color }}
                                                onClick={() => setNewTodoPriority(p.value)}
                                            >
                                                {p.icon} {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={newTodoCategory}
                                        onChange={(e) => setNewTodoCategory(e.target.value)}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>
                                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save" disabled={!newTodoText.trim()}>
                                    <Plus size={18} /> Add Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="todo-filters">
                <div className="filter-tabs">
                    {['all', 'active', 'completed'].map(f => (
                        <button
                            key={f}
                            className={`filter-tab ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="sort-dropdown">
                    <SortAsc size={16} />
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="date">Due Date</option>
                        <option value="priority">Priority</option>
                        <option value="alphabetical">A-Z</option>
                    </select>
                </div>
            </div>

            {/* Active Tasks */}
            <div className="todo-list">
                {activeTodos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        isEditing={editingTodo === todo.id}
                        editText={editText}
                        setEditText={setEditText}
                        onToggleComplete={() => toggleComplete(todo.id)}
                        onToggleStar={() => toggleStar(todo.id)}
                        onDelete={() => deleteTodo(todo.id)}
                        onStartEdit={() => startEditing(todo)}
                        onSaveEdit={() => saveEdit(todo.id)}
                        onCancelEdit={() => setEditingTodo(null)}
                        getPriorityColor={getPriorityColor}
                        formatDueDate={formatDueDate}
                    />
                ))}
            </div>

            {/* Completed Tasks */}
            {completedTodos.length > 0 && filter !== 'active' && (
                <div className="completed-section">
                    <button
                        className="completed-toggle"
                        onClick={() => setShowCompleted(!showCompleted)}
                    >
                        {showCompleted ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        Completed ({completedTodos.length})
                    </button>
                    {showCompleted && (
                        <>
                            <div className="todo-list completed">
                                {completedTodos.map(todo => (
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        isEditing={editingTodo === todo.id}
                                        editText={editText}
                                        setEditText={setEditText}
                                        onToggleComplete={() => toggleComplete(todo.id)}
                                        onToggleStar={() => toggleStar(todo.id)}
                                        onDelete={() => deleteTodo(todo.id)}
                                        onStartEdit={() => startEditing(todo)}
                                        onSaveEdit={() => saveEdit(todo.id)}
                                        onCancelEdit={() => setEditingTodo(null)}
                                        getPriorityColor={getPriorityColor}
                                        formatDueDate={formatDueDate}
                                    />
                                ))}
                            </div>
                            <button className="clear-completed" onClick={clearCompleted}>
                                <Trash2 size={14} /> Clear completed
                            </button>
                        </>
                    )}
                </div>
            )}

            {todos.length === 0 && (
                <div className="empty-state">
                    <CheckSquare size={48} />
                    <h3>All done!</h3>
                    <p>No tasks yet. Add one to get started!</p>
                </div>
            )}
        </div>
    );
};

// Todo Item Component
const TodoItem = ({
    todo, isEditing, editText, setEditText,
    onToggleComplete, onToggleStar, onDelete, onStartEdit, onSaveEdit, onCancelEdit,
    getPriorityColor, formatDueDate
}) => {
    const dueInfo = formatDueDate(todo.dueDate);

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}`}>
            <button
                className="checkbox"
                onClick={onToggleComplete}
                style={{ '--priority-color': getPriorityColor(todo.priority) }}
            >
                {todo.completed ? (
                    <CheckCircle2 size={22} />
                ) : (
                    <Circle size={22} />
                )}
            </button>

            {isEditing ? (
                <div className="edit-wrapper">
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onSaveEdit();
                            if (e.key === 'Escape') onCancelEdit();
                        }}
                        autoFocus
                    />
                    <button className="save-btn" onClick={onSaveEdit}>Save</button>
                </div>
            ) : (
                <div className="todo-content" onDoubleClick={onStartEdit}>
                    <span className="todo-text">{todo.text}</span>
                    <div className="todo-meta">
                        <span className="category-badge">{todo.category}</span>
                        {dueInfo && (
                            <span className={`due-badge ${dueInfo.class}`}>
                                <Calendar size={12} />
                                {dueInfo.text}
                            </span>
                        )}
                    </div>
                </div>
            )}

            <div className="todo-actions">
                <button
                    className={`star-btn ${todo.starred ? 'starred' : ''}`}
                    onClick={onToggleStar}
                >
                    <Star size={16} fill={todo.starred ? 'currentColor' : 'none'} />
                </button>
                <button className="delete-btn" onClick={onDelete}>
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default TodoListPage;
