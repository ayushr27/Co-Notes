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
        <div className="settings-page" role="main">
            <div className="settings-container">
                <header className="settings-header" aria-label="Settings">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
