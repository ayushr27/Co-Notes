import React, { useState } from 'react';
import { Plus, Trash2, MapPin, DollarSign, Backpack, Calendar, Users } from 'lucide-react';
import { getAvatarColor } from '../MemberStack';

const TravelPlanner = ({ activeMembers }) => {
    const [activeTab, setActiveTab] = useState('itinerary');

    const [itinerary, setItinerary] = useState([
        { id: 'd1', day: 'Day 1', title: 'Arrival & Check-in', location: 'Airport → Hotel', notes: 'Flight lands at 2 PM' },
        { id: 'd2', day: 'Day 2', title: 'City Exploration', location: 'Downtown', notes: 'Visit main attractions' },
        { id: 'd3', day: 'Day 3', title: 'Beach Day', location: 'South Beach', notes: 'Pack sunscreen!' },
    ]);

    const [expenses, setExpenses] = useState([
        { id: 'e1', item: 'Hotel Booking', amount: 450, paidBy: null },
        { id: 'e2', item: 'Flight Tickets', amount: 320, paidBy: null },
        { id: 'e3', item: 'Rental Car', amount: 180, paidBy: null },
    ]);

    const [packingList, setPackingList] = useState([
        { id: 'p1', item: 'First Aid Kit', claimedBy: null },
        { id: 'p2', item: 'Portable Charger', claimedBy: null },
        { id: 'p3', item: 'Sunscreen', claimedBy: null },
        { id: 'p4', item: 'Snacks', claimedBy: null },
        { id: 'p5', item: 'Camera', claimedBy: null },
    ]);

    const [newDay, setNewDay] = useState({ day: '', title: '', location: '', notes: '' });
    const [newExpense, setNewExpense] = useState({ item: '', amount: '' });
    const [newPackItem, setNewPackItem] = useState('');

    const addItineraryDay = () => {
        if (!newDay.title.trim()) return;
        setItinerary(prev => [...prev, {
            id: `d${Date.now()}`,
            day: newDay.day || `Day ${itinerary.length + 1}`,
            ...newDay
        }]);
        setNewDay({ day: '', title: '', location: '', notes: '' });
    };

    const addExpense = () => {
        if (!newExpense.item.trim() || !newExpense.amount) return;
        setExpenses(prev => [...prev, {
            id: `e${Date.now()}`,
            item: newExpense.item,
            amount: parseFloat(newExpense.amount),
            paidBy: null
        }]);
        setNewExpense({ item: '', amount: '' });
    };

    const addPackItem = () => {
        if (!newPackItem.trim()) return;
        setPackingList(prev => [...prev, {
            id: `p${Date.now()}`,
            item: newPackItem,
            claimedBy: null
        }]);
        setNewPackItem('');
    };

    const totalBudget = expenses.reduce((sum, e) => sum + e.amount, 0);
    const perPerson = activeMembers.length > 0 ? (totalBudget / activeMembers.length).toFixed(2) : totalBudget;

    const getMember = (id) => activeMembers.find(m => m.id === id);

    return (
        <div className="travel-planner">
            <div className="travel-tabs">
                <button
                    className={`travel-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
                    onClick={() => setActiveTab('itinerary')}
                >
                    <Calendar size={16} /> Itinerary
                </button>
                <button
                    className={`travel-tab ${activeTab === 'budget' ? 'active' : ''}`}
                    onClick={() => setActiveTab('budget')}
                >
                    <DollarSign size={16} /> Budget
                </button>
                <button
                    className={`travel-tab ${activeTab === 'packing' ? 'active' : ''}`}
                    onClick={() => setActiveTab('packing')}
                >
                    <Backpack size={16} /> Packing List
                </button>
            </div>

            {activeTab === 'itinerary' && (
                <div className="travel-itinerary">
                    {itinerary.map(day => (
                        <div key={day.id} className="itinerary-card">
                            <div className="itinerary-day-badge">{day.day}</div>
                            <div className="itinerary-content">
                                <h4>{day.title}</h4>
                                <div className="itinerary-location">
                                    <MapPin size={14} /> {day.location}
                                </div>
                                {day.notes && <p className="itinerary-notes">{day.notes}</p>}
                            </div>
                            <button className="itinerary-delete" onClick={() => setItinerary(prev => prev.filter(d => d.id !== day.id))}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                    <div className="travel-add-form">
                        <div className="travel-add-row">
                            <input placeholder="Day label" value={newDay.day} onChange={(e) => setNewDay(p => ({ ...p, day: e.target.value }))} />
                            <input placeholder="Title" value={newDay.title} onChange={(e) => setNewDay(p => ({ ...p, title: e.target.value }))} />
                        </div>
                        <div className="travel-add-row">
                            <input placeholder="Location" value={newDay.location} onChange={(e) => setNewDay(p => ({ ...p, location: e.target.value }))} />
                            <input placeholder="Notes" value={newDay.notes} onChange={(e) => setNewDay(p => ({ ...p, notes: e.target.value }))} />
                        </div>
                        <button className="travel-add-btn" onClick={addItineraryDay}><Plus size={16} /> Add Day</button>
                    </div>
                </div>
            )}

            {activeTab === 'budget' && (
                <div className="travel-budget">
                    <div className="budget-summary">
                        <div className="budget-stat">
                            <span className="budget-stat-label">Total</span>
                            <span className="budget-stat-value">${totalBudget.toFixed(2)}</span>
                        </div>
                        <div className="budget-stat">
                            <span className="budget-stat-label">Per Person</span>
                            <span className="budget-stat-value">${perPerson}</span>
                        </div>
                        <div className="budget-stat">
                            <span className="budget-stat-label">Members</span>
                            <span className="budget-stat-value">{activeMembers.length}</span>
                        </div>
                    </div>

                    <div className="budget-expenses">
                        {expenses.map(exp => {
                            const payer = exp.paidBy ? getMember(exp.paidBy) : null;
                            return (
                                <div key={exp.id} className="expense-row">
                                    <div className="expense-info">
                                        <DollarSign size={14} />
                                        <span className="expense-name">{exp.item}</span>
                                        <span className="expense-amount">${exp.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="expense-paid-by">
                                        <select
                                            value={exp.paidBy || ''}
                                            onChange={(e) => setExpenses(prev =>
                                                prev.map(x => x.id === exp.id ? { ...x, paidBy: e.target.value || null } : x)
                                            )}
                                        >
                                            <option value="">Paid by...</option>
                                            {activeMembers.map(m => (
                                                <option key={m.id} value={m.id}>{m.name}</option>
                                            ))}
                                        </select>
                                        {payer && (
                                            <div className="expense-payer-avatar" style={{ backgroundColor: getAvatarColor(payer.id) }}>
                                                {payer.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <button className="expense-delete" onClick={() => setExpenses(prev => prev.filter(x => x.id !== exp.id))}>
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="travel-add-form inline-form">
                        <input placeholder="Expense item" value={newExpense.item} onChange={(e) => setNewExpense(p => ({ ...p, item: e.target.value }))} />
                        <input placeholder="Amount" type="number" value={newExpense.amount} onChange={(e) => setNewExpense(p => ({ ...p, amount: e.target.value }))} />
                        <button className="travel-add-btn" onClick={addExpense}><Plus size={16} /> Add</button>
                    </div>
                </div>
            )}

            {activeTab === 'packing' && (
                <div className="travel-packing">
                    <div className="packing-items">
                        {packingList.map(item => {
                            const claimer = item.claimedBy ? getMember(item.claimedBy) : null;
                            return (
                                <div key={item.id} className="packing-item">
                                    <span className="packing-item-name">{item.item}</span>
                                    <div className="packing-claim">
                                        <select
                                            value={item.claimedBy || ''}
                                            onChange={(e) => setPackingList(prev =>
                                                prev.map(x => x.id === item.id ? { ...x, claimedBy: e.target.value || null } : x)
                                            )}
                                        >
                                            <option value="">Who's bringing it?</option>
                                            {activeMembers.map(m => (
                                                <option key={m.id} value={m.id}>{m.name}</option>
                                            ))}
                                        </select>
                                        {claimer && (
                                            <span className="packing-claimer">
                                                <span className="packing-claimer-avatar" style={{ backgroundColor: getAvatarColor(claimer.id) }}>
                                                    {claimer.name.charAt(0)}
                                                </span>
                                                {claimer.name.split(' ')[0]} is bringing this
                                            </span>
                                        )}
                                    </div>
                                    <button className="packing-delete" onClick={() => setPackingList(prev => prev.filter(x => x.id !== item.id))}>
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="travel-add-form inline-form">
                        <input placeholder="Add item..." value={newPackItem} onChange={(e) => setNewPackItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addPackItem()} />
                        <button className="travel-add-btn" onClick={addPackItem}><Plus size={16} /> Add</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TravelPlanner;
