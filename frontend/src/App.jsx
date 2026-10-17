
import { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetails from "./pages/ProjectDetails.jsx";
import Notes from "./pages/Notes.jsx";
import Files from "./pages/Files.jsx";
import PublicProject from "./pages/PublicProject.jsx";

import { useAuth } from "./context/AuthContext.jsx";

const STORAGE_KEY = "collabsphere_demo_projects";

const initialProjects = [
  {
    id: "sample-1",
    name: "Student Management System",
    description: "A web application to manage student records and information.",
    technologies: ["React", "Node.js", "MongoDB"],
    color: 1,
  },
  {
    id: "sample-2",
    name: "Developer Portfolio",
    description: "A personal portfolio to showcase projects and skills.",
    technologies: ["HTML", "CSS", "JavaScript"],
    color: 2,
  },
];

function WorkspaceLayout({ projects, onCreate, onDelete }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Navbar onMenuClick={() => setSidebarOpen((open) => !open)} />

      <div className="workspace">
        {sidebarOpen && (
          <button
            className="sidebar-overlay"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className={`sidebar-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Dashboard projects={projects} onDelete={onDelete} />}
            />
            <Route
              path="/projects"
              element={
                <Projects
                  projects={projects}
                  onCreate={onCreate}
                  onDelete={onDelete}
                />
              }
            />
            <Route
              path="/projects/:id"
              element={<ProjectDetails projects={projects} />}
            />
            <Route path="/notes" element={<Notes />} />
            <Route path="/files" element={<Files />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();
  const location = useLocation();

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialProjects;
    } catch {
      return initialProjects;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  function createProject(data) {
    const newProject = {
      ...data,
      id: crypto.randomUUID(),
      color: (projects.length % 4) + 1,
    };

    setProjects((previous) => [newProject, ...previous]);
  }

  function deleteProject(id) {
    const project = projects.find((item) => item.id === id);
    if (!project) return;

    if (window.confirm(`Delete "${project.name}" from this demo?`)) {
      setProjects((previous) => previous.filter((item) => item.id !== id));
    }
  }

  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <Register />}
      />

      <Route path="/public/:id" element={<PublicProject projects={projects} />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/*"
          element={
            isAuthPage ? (
              <Navigate to="/" replace />
            ) : (
              <WorkspaceLayout
                projects={projects}
                onCreate={createProject}
                onDelete={deleteProject}
              />
            )
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
