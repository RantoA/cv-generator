import { NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import DataManager from "./pages/DataManager.jsx";
import CvEditor from "./pages/CvEditor.jsx";
import CvPreview from "./pages/CvPreview.jsx";
import { useData } from "./context/DataContext.jsx";

export default function App() {
  const { loading, error, saving } = useData();

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">📄 Générateur de CV</div>
        <nav>
          <NavLink to="/" end>
            Mes CV
          </NavLink>
          <NavLink to="/data">Mes données</NavLink>
        </nav>
        <div className="save-status">{saving ? "Enregistrement…" : ""}</div>
      </header>

      <main className="content">
        {error && <div className="banner banner-error">Erreur : {error}</div>}
        {loading ? (
          <div className="loading">Chargement…</div>
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/data" element={<DataManager />} />
            <Route path="/cv/:id/edit" element={<CvEditor />} />
            <Route path="/cv/:id/preview" element={<CvPreview />} />
          </Routes>
        )}
      </main>
    </div>
  );
}
