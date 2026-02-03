import React, { useState } from 'react';
import { User, Bell, Palette, Shield, CreditCard, LogOut, Moon, Sun, Monitor } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [theme, setTheme] = useState('dark');
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        weekly: true
    });

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'billing', label: 'Billing', icon: CreditCard },
    ];

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        // In a real app, this would update the document theme
        if (newTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-container">
                <header className="settings-header">
                    <h1>Settings</h1>
                    <p>Manage your account settings and preferences</p>
                </header>

                <div className="settings-layout">
                    <nav className="settings-nav">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <tab.icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                        <div className="settings-nav-divider"></div>
                        <button className="settings-nav-item danger">
                            <LogOut size={18} />
                            <span>Log out</span>
                        </button>
                    </nav>

                    <div className="settings-content">
                        {activeTab === 'profile' && (
                            <div className="settings-section">
                                <h2>Profile Settings</h2>
                                <div className="profile-avatar-section">
                                    <div className="avatar-large">J</div>
                                    <button className="btn btn-outline">Change Avatar</button>
                                </div>
                                <div className="form-group">
                                    <label>Display Name</label>
                                    <input type="text" defaultValue="Jane Doe" className="settings-input" />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" defaultValue="jane@example.com" className="settings-input" />
                                </div>
                                <div className="form-group">
                                    <label>Bio</label>
                                    <textarea className="settings-textarea" placeholder="Tell us about yourself..." rows={3}></textarea>
                                </div>
                                <button className="btn btn-primary">Save Changes</button>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="settings-section">
                                <h2>Appearance</h2>
                                <p className="section-desc">Customize how Co-Notes looks on your device</p>

                                <div className="theme-selector">
                                    <h3>Theme</h3>
                                    <div className="theme-options">
                                        <button
                                            className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                                            onClick={() => handleThemeChange('dark')}
                                        >
                                            <Moon size={24} />
                                            <span>Dark</span>
                                        </button>
                                        <button
                                            className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                                            onClick={() => handleThemeChange('light')}
                                        >
                                            <Sun size={24} />
                                            <span>Light</span>
                                        </button>
                                        <button
                                            className={`theme-option ${theme === 'system' ? 'active' : ''}`}
                                            onClick={() => handleThemeChange('system')}
                                        >
                                            <Monitor size={24} />
                                            <span>System</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="settings-section">
                                <h2>Notifications</h2>
                                <p className="section-desc">Configure how you receive notifications</p>

                                <div className="notification-options">
                                    <div className="notification-item">
                                        <div className="notification-info">
                                            <span className="notification-label">Email Notifications</span>
                                            <span className="notification-desc">Receive updates via email</span>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={notifications.email}
                                                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="notification-item">
                                        <div className="notification-info">
                                            <span className="notification-label">Push Notifications</span>
                                            <span className="notification-desc">Receive push notifications in browser</span>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={notifications.push}
                                                onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="notification-item">
                                        <div className="notification-info">
                                            <span className="notification-label">Weekly Digest</span>
                                            <span className="notification-desc">Get a weekly summary of your activity</span>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={notifications.weekly}
                                                onChange={(e) => setNotifications({ ...notifications, weekly: e.target.checked })}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="settings-section">
                                <h2>Security</h2>
                                <p className="section-desc">Manage your account security</p>

                                <div className="security-options">
                                    <div className="security-item">
                                        <h3>Change Password</h3>
                                        <p>Update your password regularly for better security</p>
                                        <button className="btn btn-outline">Change Password</button>
                                    </div>
                                    <div className="security-item">
                                        <h3>Two-Factor Authentication</h3>
                                        <p>Add an extra layer of security to your account</p>
                                        <button className="btn btn-primary">Enable 2FA</button>
                                    </div>
                                    <div className="security-item">
                                        <h3>Active Sessions</h3>
                                        <p>View and manage your active sessions</p>
                                        <button className="btn btn-outline">View Sessions</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="settings-section">
                                <h2>Billing</h2>
                                <p className="section-desc">Manage your subscription and billing</p>

                                <div className="current-plan">
                                    <div className="plan-badge">Free Plan</div>
                                    <p>You're currently on the free plan</p>
                                </div>

                                <div className="upgrade-card">
                                    <h3>Upgrade to Pro</h3>
                                    <ul className="pro-features">
                                        <li>✓ Unlimited notes</li>
                                        <li>✓ Real-time collaboration</li>
                                        <li>✓ Advanced permissions</li>
                                        <li>✓ Priority support</li>
                                    </ul>
                                    <button className="btn btn-primary btn-lg">Upgrade Now - $9/month</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
