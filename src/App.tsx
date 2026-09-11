import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Investigations from "./pages/Investigations";
import NetworkGraphPage from "./pages/NetworkGraphPage";
import Entities from "./pages/Entities";
import Timeline from "./pages/Timeline";
import Evidence from "./pages/Evidence";
import Analytics from "./pages/Analytics";
import AuditLog from "./pages/AuditLog";
import InvestigationWorkspace from "./pages/InvestigationWorkspace";

type Page = "dashboard" | "investigations" | "network" | "entities" | "timeline" | "analytics" | "evidence" | "audit";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [openCaseId, setOpenCaseId] = useState<string | null>(null);

  const navigate = (p: string) => {
    setOpenCaseId(null);
    setPage(p as Page);
  };

  const openCase = (caseId: string) => {
    setOpenCaseId(caseId);
  };

  return (
    <ThemeProvider>
      <div
        className="flex h-full overflow-hidden"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <Sidebar
          current={openCaseId ? "investigations" : page}
          onNavigate={(p) => { setOpenCaseId(null); setPage(p); }}
          collapsed={sidebarCollapsed}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            demoMode={demoMode}
            onToggleDemo={() => setDemoMode(!demoMode)}
          />

          <main
            className="flex-1 overflow-hidden"
            style={{ backgroundColor: "var(--bg-base)" }}
          >
            {openCaseId ? (
              <InvestigationWorkspace caseId={openCaseId} onBack={() => setOpenCaseId(null)} />
            ) : page === "dashboard" ? (
              <Dashboard onNavigate={navigate} />
            ) : page === "investigations" ? (
              <Investigations onOpenCase={openCase} />
            ) : page === "network" ? (
              <NetworkGraphPage />
            ) : page === "entities" ? (
              <Entities />
            ) : page === "timeline" ? (
              <Timeline />
            ) : page === "evidence" ? (
              <Evidence />
            ) : page === "analytics" ? (
              <Analytics />
            ) : page === "audit" ? (
              <AuditLog />
            ) : null}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
