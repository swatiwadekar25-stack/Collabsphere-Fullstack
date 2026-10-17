
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Overview", icon: "▦", end: true },
  { to: "/projects", label: "My Projects", icon: "▣" },
  { to: "/notes", label: "Markdown Notes", icon: "▤" },
  { to: "/files", label: "Files & Code", icon: "⌘" },
];

export default function Sidebar({ onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-label">WORKSPACE</div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="ai-mini-card">
          <span className="ai-sparkle">✦</span>
          <strong>Powered by Gemini</strong>
          <p>Your AI-powered development workspace.</p>
        </div>

        <div className="sidebar-version">CollabSphere · Demo</div>
      </div>
    </aside>
  );
}
