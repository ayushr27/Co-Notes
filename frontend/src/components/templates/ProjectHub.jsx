import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronRight, CheckCircle2, Circle, Clock } from 'lucide-react';
import { getAvatarColor } from '../MemberStack';

const ProjectHub = ({ activeMembers }) => {
    const [columns, setColumns] = useState({
        todo: {
            title: 'To Do',
            icon: <Circle size={16} />,
            tasks: [
                { id: 't1', text: 'Design landing page wireframes', assignee: null, priority: 'high' },
                { id: 't2', text: 'Set up CI/CD pipeline', assignee: null, priority: 'medium' },
            ]
        },
        doing: {
            title: 'In Progress',
            icon: <Clock size={16} />,
            tasks: [
                { id: 't3', text: 'Implement auth system', assignee: null, priority: 'high' },
            ]
        },
        done: {
            title: 'Done',
            icon: <CheckCircle2 size={16} />,
            tasks: [
                { id: 't4', text: 'Project kickoff meeting', assignee: null, priority: 'low' },
            ]
        }
    });

    const [newTask, setNewTask] = useState({ todo: '', doing: '', done: '' });

    const addTask = (columnId) => {
        const text = newTask[columnId].trim();
        if (!text) return;

        setColumns(prev => ({
            ...prev,
            [columnId]: {
                ...prev[columnId],
                tasks: [...prev[columnId].tasks, {
                    id: `t${Date.now()}`,
                    text,
                    assignee: null,
                    priority: 'medium'
                }]
            }
        }));
        setNewTask(prev => ({ ...prev, [columnId]: '' }));
    };

    const deleteTask = (columnId, taskId) => {
        setColumns(prev => ({
            ...prev,
            [columnId]: {
                ...prev[columnId],
                tasks: prev[columnId].tasks.filter(t => t.id !== taskId)
            }
        }));
    };

    const assignTask = (columnId, taskId, memberId) => {
        setColumns(prev => ({
            ...prev,
            [columnId]: {
                ...prev[columnId],
                tasks: prev[columnId].tasks.map(t =>
                    t.id === taskId ? { ...t, assignee: memberId || null } : t
                )
            }
        }));
    };

    const moveTask = (fromCol, taskId, direction) => {
        const colOrder = ['todo', 'doing', 'done'];
        const fromIdx = colOrder.indexOf(fromCol);
        const toIdx = fromIdx + direction;
        if (toIdx < 0 || toIdx >= colOrder.length) return;

        const toCol = colOrder[toIdx];
        const task = columns[fromCol].tasks.find(t => t.id === taskId);

        setColumns(prev => ({
            ...prev,
            [fromCol]: { ...prev[fromCol], tasks: prev[fromCol].tasks.filter(t => t.id !== taskId) },
            [toCol]: { ...prev[toCol], tasks: [...prev[toCol].tasks, task] }
        }));
    };

    const getMember = (id) => activeMembers.find(m => m.id === id);

    const getPriorityClass = (p) => `task-priority priority-${p}`;

    return (
        <div className="kanban-board">
            {Object.entries(columns).map(([colId, col]) => (
                <div key={colId} className={`kanban-column kanban-col-${colId}`}>
                    <div className="kanban-column-header">
                        <span className="kanban-column-icon">{col.icon}</span>
                        <h3>{col.title}</h3>
                        <span className="kanban-count">{col.tasks.length}</span>
                    </div>

                    <div className="kanban-tasks">
                        {col.tasks.map(task => {
                            const assigned = task.assignee ? getMember(task.assignee) : null;
                            return (
                                <div key={task.id} className="kanban-card">
                                    <div className="kanban-card-top">
                                        <span className={getPriorityClass(task.priority)}>{task.priority}</span>
                                        <div className="kanban-card-actions">
                                            {colId !== 'todo' && (
                                                <button onClick={() => moveTask(colId, task.id, -1)} title="Move left" className="kanban-move-btn">
                                                    ←
                                                </button>
                                            )}
                                            {colId !== 'done' && (
                                                <button onClick={() => moveTask(colId, task.id, 1)} title="Move right" className="kanban-move-btn">
                                                    →
                                                </button>
                                            )}
                                            <button onClick={() => deleteTask(colId, task.id)} className="kanban-delete-btn">
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="kanban-card-text">{task.text}</p>
                                    <div className="kanban-card-footer">
                                        <select
                                            className="kanban-assignee-select"
                                            value={task.assignee || ''}
                                            onChange={(e) => assignTask(colId, task.id, e.target.value)}
                                        >
                                            <option value="">Unassigned</option>
                                            {activeMembers.map(m => (
                                                <option key={m.id} value={m.id}>{m.name}</option>
                                            ))}
                                        </select>
                                        {assigned && (
                                            <div
                                                className="kanban-assignee-avatar"
                                                style={{ backgroundColor: getAvatarColor(assigned.id) }}
                                                title={assigned.name}
                                            >
                                                {assigned.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="kanban-add-task">
                        <input
                            type="text"
                            placeholder="Add a task..."
                            value={newTask[colId]}
                            onChange={(e) => setNewTask(prev => ({ ...prev, [colId]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && addTask(colId)}
                        />
                        <button onClick={() => addTask(colId)}>
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectHub;
