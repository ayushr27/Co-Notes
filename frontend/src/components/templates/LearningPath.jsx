import React, { useState } from 'react';
import { Plus, Trash2, BookOpen, Trophy, ChevronDown, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { getAvatarColor } from '../MemberStack';

const LearningPath = ({ activeMembers }) => {
    const [modules, setModules] = useState([
        {
            id: 'm1', title: 'Introduction to React', lessons: [
                { id: 'l1', title: 'What is React?', completed: {} },
                { id: 'l2', title: 'Components & Props', completed: {} },
                { id: 'l3', title: 'State & Lifecycle', completed: {} },
            ], expanded: true
        },
        {
            id: 'm2', title: 'Advanced Hooks', lessons: [
                { id: 'l4', title: 'useEffect Deep Dive', completed: {} },
                { id: 'l5', title: 'Custom Hooks', completed: {} },
                { id: 'l6', title: 'useReducer & useContext', completed: {} },
            ], expanded: false
        },
        {
            id: 'm3', title: 'State Management', lessons: [
                { id: 'l7', title: 'Context API Patterns', completed: {} },
                { id: 'l8', title: 'Redux Toolkit', completed: {} },
                { id: 'l9', title: 'Zustand & Jotai', completed: {} },
            ], expanded: false
        }
    ]);

    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [newLessonTitle, setNewLessonTitle] = useState({});

    const currentUserId = 'owner';

    const toggleLesson = (moduleId, lessonId) => {
        setModules(prev => prev.map(mod => {
            if (mod.id !== moduleId) return mod;
            return {
                ...mod,
                lessons: mod.lessons.map(l => {
                    if (l.id !== lessonId) return l;
                    const completed = { ...l.completed };
                    if (completed[currentUserId]) {
                        delete completed[currentUserId];
                    } else {
                        completed[currentUserId] = true;
                    }
                    return { ...l, completed };
                })
            };
        }));
    };

    const toggleExpanded = (moduleId) => {
        setModules(prev => prev.map(m =>
            m.id === moduleId ? { ...m, expanded: !m.expanded } : m
        ));
    };

    const addModule = () => {
        if (!newModuleTitle.trim()) return;
        setModules(prev => [...prev, {
            id: `m${Date.now()}`,
            title: newModuleTitle,
            lessons: [],
            expanded: true
        }]);
        setNewModuleTitle('');
    };

    const addLesson = (moduleId) => {
        const title = (newLessonTitle[moduleId] || '').trim();
        if (!title) return;
        setModules(prev => prev.map(m => {
            if (m.id !== moduleId) return m;
            return {
                ...m,
                lessons: [...m.lessons, { id: `l${Date.now()}`, title, completed: {} }]
            };
        }));
        setNewLessonTitle(prev => ({ ...prev, [moduleId]: '' }));
    };

    const deleteModule = (moduleId) => {
        setModules(prev => prev.filter(m => m.id !== moduleId));
    };

    // Calculate progress per member
    const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const getProgress = (memberId) => {
        if (totalLessons === 0) return 0;
        const completed = modules.reduce((sum, m) =>
            sum + m.lessons.filter(l => l.completed[memberId]).length, 0
        );
        return Math.round((completed / totalLessons) * 100);
    };

    const leaderboard = activeMembers
        .map(m => ({ ...m, progress: getProgress(m.id) }))
        .sort((a, b) => b.progress - a.progress);

    return (
        <div className="learning-path">
            <div className="learning-main">
                <div className="learning-modules">
                    <h3 className="learning-section-title"><BookOpen size={18} /> Course Modules</h3>
                    {modules.map((mod, modIdx) => (
                        <div key={mod.id} className="learning-module">
                            <div className="module-header" onClick={() => toggleExpanded(mod.id)}>
                                <div className="module-toggle">
                                    {mod.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </div>
                                <span className="module-number">{modIdx + 1}</span>
                                <h4>{mod.title}</h4>
                                <span className="module-lesson-count">{mod.lessons.length} lessons</span>
                                <button className="module-delete" onClick={(e) => { e.stopPropagation(); deleteModule(mod.id); }}>
                                    <Trash2 size={13} />
                                </button>
                            </div>
                            {mod.expanded && (
                                <div className="module-lessons">
                                    {mod.lessons.map(lesson => (
                                        <div
                                            key={lesson.id}
                                            className={`lesson-item ${lesson.completed[currentUserId] ? 'completed' : ''}`}
                                            onClick={() => toggleLesson(mod.id, lesson.id)}
                                        >
                                            {lesson.completed[currentUserId] ?
                                                <CheckCircle2 size={16} className="lesson-check" /> :
                                                <Circle size={16} className="lesson-check" />
                                            }
                                            <span>{lesson.title}</span>
                                        </div>
                                    ))}
                                    <div className="lesson-add">
                                        <input
                                            placeholder="Add a lesson..."
                                            value={newLessonTitle[mod.id] || ''}
                                            onChange={(e) => setNewLessonTitle(prev => ({ ...prev, [mod.id]: e.target.value }))}
                                            onKeyDown={(e) => e.key === 'Enter' && addLesson(mod.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <button onClick={(e) => { e.stopPropagation(); addLesson(mod.id); }}>
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="module-add">
                        <input
                            placeholder="New module title..."
                            value={newModuleTitle}
                            onChange={(e) => setNewModuleTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addModule()}
                        />
                        <button onClick={addModule}><Plus size={16} /> Add Module</button>
                    </div>
                </div>
            </div>

            <div className="learning-sidebar">
                <h3 className="learning-section-title"><Trophy size={18} /> Leaderboard</h3>
                <div className="leaderboard">
                    {leaderboard.map((member, idx) => (
                        <div key={member.id} className="leaderboard-row">
                            <span className="leaderboard-rank">#{idx + 1}</span>
                            <div className="leaderboard-avatar" style={{ backgroundColor: getAvatarColor(member.id) }}>
                                {member.name.charAt(0)}
                            </div>
                            <div className="leaderboard-info">
                                <span className="leaderboard-name">{member.name}</span>
                                <div className="leaderboard-bar-track">
                                    <div className="leaderboard-bar-fill" style={{ width: `${member.progress}%` }} />
                                </div>
                            </div>
                            <span className="leaderboard-pct">{member.progress}%</span>
                        </div>
                    ))}
                    {leaderboard.length === 0 && (
                        <p className="leaderboard-empty">Add members to see progress</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LearningPath;
