// frontendv1/api.js
// Shared utility for making authenticated API requests to the backend

const API_BASE_URL = 'http://localhost:3000/api';

function getApiOrigin() {
    return new URL(API_BASE_URL).origin;
}

function resolveApiAssetUrl(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
    if (url.startsWith('/')) return `${getApiOrigin()}${url}`;
    return `${getApiOrigin()}/${url}`;
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

/**
 * checkAuth — Call at the top of every protected page.
 * Redirects to login.html if no token is stored.
 */
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
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
