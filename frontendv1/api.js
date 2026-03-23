const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://unstack-minds.onrender.com/api';

function getApiOrigin() {
    return new URL(API_BASE_URL).origin;
}

function resolveApiAssetUrl(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
    if (url.startsWith('/')) return `${getApiOrigin()}${url}`;
    return `${getApiOrigin()}/${url}`;
}

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

async function uploadImage(file, folder) {
    if (!file) throw new Error('No file selected');
    const dataUrl = await fileToDataUrl(file);
    const response = await apiFetch('/uploads/image', {
        method: 'POST',
        body: JSON.stringify({ file: dataUrl, folder })
    });
    return response.url;
}

/**
 * apiFetch — Wrapper for fetch that:
 *   1. Automatically attaches the JWT Bearer token from localStorage
 *   2. Handles JSON serialization / deserialization
 *   3. Redirects to login.html on 401 (expired/missing token)
 *   4. Throws a descriptive Error on non-2xx responses
 */
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    // Handle 401/403 globally — token expired or missing
    if ((response.status === 401 || response.status === 403) && !endpoint.includes('/auth/')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
        return null;
    }

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        // Throw an error with the server's message so catch blocks can display it
        throw new Error(data.message || data || 'An error occurred');
    }

    return data;
}

/**
 * logout — Clears all local session data and redirects to login.
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function normalizeSidebarAccountSection() {
    const accountHrefs = ['profile.html', 'notifications.html', 'settings.html', 'trash.html', 'admin.html'];
    const navs = document.querySelectorAll('.sidebar-nav');

    navs.forEach(nav => {
        const accountLinks = accountHrefs
            .map(href => nav.querySelector(`a[href="${href}"]`))
            .filter(Boolean);

        if (!accountLinks.length) return;

        let accountSection = null;

        accountLinks.forEach(link => {
            const section = link.closest('.nav-section');
            const title = section?.querySelector('.nav-section-title');
            if (!accountSection && title && title.textContent.trim().toLowerCase().includes('account')) {
                accountSection = section;
            }
        });

        if (!accountSection) {
            accountSection = accountLinks[0].closest('.nav-section');
        }

        if (!accountSection) return;

        let accountTitle = accountSection.querySelector('.nav-section-title');
        if (!accountTitle) {
            accountTitle = document.createElement('div');
            accountTitle.className = 'nav-section-title';
            accountTitle.textContent = 'Account';
            accountSection.insertBefore(accountTitle, accountSection.firstChild);
        } else {
            accountTitle.textContent = 'Account';
        }

        accountLinks.forEach(link => {
            if (link.parentElement !== accountSection) {
                accountSection.appendChild(link);
            }
        });
    });
}

/**
 * checkAuth — Call at the top of every protected page.
 * Redirects to login.html if no token is stored.
 */
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    normalizeSidebarAccountSection();

    // Inject Admin panel link if user is admin
    let user = getCurrentUser();
    
    // If we have a token but no role in cached user, sync from server to fix stale sessions
    if (token && user && !user.role) {
        apiFetch('/auth/me').then(data => {
            const syncedUser = data.user || data;
            if (syncedUser.role) {
                localStorage.setItem('user', JSON.stringify(syncedUser));
                // Reload or re-run injection if needed
                window.location.reload(); 
            }
        }).catch(() => {});
    }

    if (user && user.role === 'admin') {
        const navs = document.querySelectorAll('.sidebar-nav');
        navs.forEach(nav => {
            if (!nav.querySelector('a[href="admin.html"]')) {
                const accountSections = Array.from(nav.querySelectorAll('.nav-section-title'));
                const accountSec = accountSections.find(s => s.textContent.trim().toLowerCase().includes('account'));
                
                if (accountSec && accountSec.parentElement) {
                    const adminLink = document.createElement('a');
                    adminLink.href = 'admin.html';
                    adminLink.className = 'nav-item admin-link-special';
                    adminLink.style.color = '#a371f7';
                    adminLink.style.fontWeight = 'bold';
                    adminLink.innerHTML = `<i data-lucide="shield-check" class="nav-icon" style="color: #a371f7"></i> Admin Command`;
                    
                    accountSec.parentElement.appendChild(adminLink);
                    
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            }
        });
    }
}

/**
 * getCurrentUser — Returns the cached user object from localStorage.
 * Returns null if not logged in.
 */
function getCurrentUser() {
    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

// Auto-apply saved theme
(function applyTheme() {
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }
})();
