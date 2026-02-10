import React, { useState } from 'react';
import { Plus, Trash2, Type, MousePointer2 } from 'lucide-react';
import MemberStack, { getAvatarColor } from '../MemberStack';

const BlankCollection = ({ activeMembers }) => {
    const [blocks, setBlocks] = useState([
        { id: 'b1', type: 'text', content: 'Welcome to your blank canvas! Click here to start editing...', x: 0, y: 0 },
    ]);

    const [newBlockText, setNewBlockText] = useState('');

    const addBlock = () => {
        if (!newBlockText.trim()) return;
        setBlocks(prev => [...prev, {
            id: `b${Date.now()}`,
            type: 'text',
            content: newBlockText,
            x: 0,
            y: 0
        }]);
        setNewBlockText('');
    };

    const deleteBlock = (id) => {
        setBlocks(prev => prev.filter(b => b.id !== id));
    };

    const updateBlock = (id, content) => {
        setBlocks(prev => prev.map(b =>
            b.id === id ? { ...b, content } : b
        ));
    };

    // Simulate online members
    const onlineMembers = activeMembers.slice(0, Math.min(3, activeMembers.length));

    return (
        <div className="blank-canvas">
            <div className="blank-canvas-toolbar">
                <div className="blank-canvas-input">
                    <input
                        type="text"
                        placeholder="Add a text block..."
                        value={newBlockText}
                        onChange={(e) => setNewBlockText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addBlock()}
                    />
                    <button onClick={addBlock}><Plus size={16} /> Add Block</button>
                </div>
                {onlineMembers.length > 0 && (
                    <div className="blank-canvas-online">
                        <span className="online-dot" />
                        <span>{onlineMembers.length} online</span>
                        <div className="online-member-list">
                            {onlineMembers.map(m => (
                                <div key={m.id} className="online-member-chip">
                                    <div className="online-member-avatar" style={{ backgroundColor: getAvatarColor(m.id) }}>
                                        {m.name.charAt(0)}
                                    </div>
                                    <span>{m.name.split(' ')[0]}</span>
                                    <span className="online-indicator" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="blank-canvas-area">
                {blocks.map(block => (
                    <div key={block.id} className="canvas-block">
                        <div className="canvas-block-handle">
                            <Type size={14} />
                        </div>
                        <div
                            className="canvas-block-content"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => updateBlock(block.id, e.target.innerText)}
                        >
                            {block.content}
                        </div>
                        <button className="canvas-block-delete" onClick={() => deleteBlock(block.id)}>
                            <Trash2 size={13} />
                        </button>
                    </div>
                ))}

                {blocks.length === 0 && (
                    <div className="canvas-empty">
                        <MousePointer2 size={32} />
                        <p>Your canvas is empty. Add a text block to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlankCollection;
