import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Импортируем страницы
import AuthPage from "./pages/AuthPage";
import RegisterPage from "./pages/RegPage";
import Home from "./pages/Home";
import Forum from "./pages/Forum";

import NewsListPage from "./pages/NewsListPage";
import NewsViewPage from "./pages/NewsViewPage";
import NewsCreatePage from "./pages/NewsCreatePage";
import Tracks from "./pages/Tracks";

import History from "./pages/History";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Topic from "./pages/Topic";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ReviewApplicationsPage from "./pages/ReviewApplicationsPage";
import AdminUserProfilePage from "./pages/AdminUserProfilePage";
import AdminUsersPage from "./pages/AdminUsersPage";
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<h1>Добро пожаловать</h1>} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<Topic />} />

            <Route path="/news" element={<NewsListPage />} />
            <Route path="/news/:id" element={<NewsViewPage />} />
            <Route path="/news/new" element={<NewsCreatePage />} />
            <Route path="/news/edit/:id" element={<NewsCreatePage />} />

            <Route path="/tracks" element={<Tracks />} />

            <Route path="/history" element={<History />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/review" element={<ReviewApplicationsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/users/:id" element={<AdminUserProfilePage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
