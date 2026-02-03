import React from 'react';
import { MapPin, Link as LinkIcon, Calendar } from 'lucide-react';

const UserProfile = () => {
    return (
        <div className="profile-page">
            <div className="profile-header-banner"></div>
            <div className="profile-content container-limit">
                <div className="profile-card">
                    <div className="profile-avatar-lg">J</div>
                    <div className="profile-info">
                        <h1>Jane Doe</h1>
                        <p className="profile-bio">Product Designer & Thinker. writing about design systems, productivity, and the future of work.</p>
                        <div className="profile-meta">
                            <span><MapPin size={14} /> San Francisco, CA</span>
                            <span><LinkIcon size={14} /> janedoe.com</span>
                            <span><Calendar size={14} /> Joined September 2024</span>
                        </div>
                        <div className="profile-stats">
                            <div className="stat">
                                <strong>1.2k</strong> Followers
                            </div>
                            <div className="stat">
                                <strong>45</strong> Following
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-primary btn-follow">Follow</button>
                </div>

                <section className="profile-tabs">
                    <button className="tab active">Articles</button>
                    <button className="tab">About</button>
                </section>

                <div className="profile-articles-list">
                    {/* Re-use article cards here in a list view perhaps */}
                    <div className="placeholder-empty-state">
                        <p>No articles published yet.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
