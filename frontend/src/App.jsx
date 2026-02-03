import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/editor.css';

/* Pages - User & System */
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import Notifications from './pages/Notifications';

/* Pages - Notion-Lite Core */
import Dashboard from './pages/Dashboard';
import DocumentPage from './pages/DocumentPage';
import DocumentHistory from './pages/DocumentHistory';
import Trash from './pages/Trash';
import Search from './pages/Search';
import Teamspace from './pages/Teamspace';

/* Pages - Quick Links (New) */
import CollectionsPage from './pages/CollectionsPage';
import IdeasPage from './pages/IdeasPage';
import QuickNotesPage from './pages/QuickNotesPage';
import TodoListPage from './pages/TodoListPage';

/* Pages - Community / Publishing */
import CommunityFeed from './pages/CommunityFeed';
import ArticlePage from './pages/ArticlePage';
import WriteArticle from './pages/WriteArticle';
import MyArticles from './pages/MyArticles';

/* Layouts */
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <Router>
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
          <Route path="/trash" element={<Trash />} />
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
    </Router>
  );
}

export default App;
