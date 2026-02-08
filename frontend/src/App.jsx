import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/editor.css';

// Instant load - Core shell & lightweight pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// Lazy load - Heavy pages (editor, writing, settings)
const DocumentPage = lazy(() => import('./pages/DocumentPage'));
const DocumentHistory = lazy(() => import('./pages/DocumentHistory'));
const WriteArticle = lazy(() => import('./pages/WriteArticle'));
const Settings = lazy(() => import('./pages/Settings'));
const CommunityFeed = lazy(() => import('./pages/CommunityFeed'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));

// Lazy load - Secondary pages
const UserProfile = lazy(() => import('./pages/UserProfile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Search = lazy(() => import('./pages/Search'));
const Teamspace = lazy(() => import('./pages/Teamspace'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const IdeasPage = lazy(() => import('./pages/IdeasPage'));
const QuickNotesPage = lazy(() => import('./pages/QuickNotesPage'));
const TodoListPage = lazy(() => import('./pages/TodoListPage'));
const MyArticles = lazy(() => import('./pages/MyArticles'));

/* Layouts */
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Zero-G Loader (weightless fallback)
const ZeroGLoader = () => (
  <div className="zero-g-loader" style={{ minHeight: '60vh' }}>
    <div className="loader-ring"></div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<ZeroGLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />

          {/* Auth Routes */}
          <Route element={<AuthLayout title="Welcome back" subtitle="Login to continue to your workspace" />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<AuthLayout title="Create an account" subtitle="Join Co-Notes to start writing" />}>
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            {/* User & System */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/u/:username" element={<UserProfile />} />

            {/* Notion-Lite Core */}
            <Route path="/doc/:id" element={<DocumentPage />} />
            <Route path="/doc/:id/history" element={<DocumentHistory />} />
            <Route path="/search" element={<Search />} />
            <Route path="/teamspace/:teamId" element={<Teamspace />} />

            {/* Quick Links - Collections, Ideas, Notes, Todos */}
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/collection/:collectionId" element={<CollectionsPage />} />
            <Route path="/ideas" element={<IdeasPage />} />
            <Route path="/quick-notes" element={<QuickNotesPage />} />
            <Route path="/todos" element={<TodoListPage />} />

            {/* Community / Publishing */}
            <Route path="/community" element={<CommunityFeed />} />
            <Route path="/community/article/:id" element={<ArticlePage />} />
            <Route path="/write" element={<WriteArticle />} />
            <Route path="/my-articles" element={<MyArticles />} />
            <Route path="/drafts" element={<MyArticles />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

