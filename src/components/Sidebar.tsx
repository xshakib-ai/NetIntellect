import {
  LayoutDashboard, FolderOpen, Network, Users, Clock,
  BarChart3, FileText, ScrollText, Settings, Shield,
  ChevronRight, Wifi, WifiOff,
} from "lucide-react";

type Page =
  | "dashboard" | "investigations" | "network" | "entities"
  | "timeline" | "analytics" | "evidence" | "audit";

const navGroups = [
  {
    label: "COMMAND CENTER",
    items: [
      { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
      { id: "investigations" as Page, label: "Investigations", icon: FolderOpen },
      { id: "network" as Page, label: "Network Graph", icon: Network },
      { id: "entities" as Page, label: "Entities", icon: Users },
      { id: "timeline" as Page, label: "Timeline", icon: Clock },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { id: "analytics" as Page, label: "Analytics", icon: BarChart3 },
      { id: "evidence" as Page, label: "Evidence", icon: FileText },
      { id: "audit" as Page, label: "Audit Log", icon: ScrollText },
    ],
  },
];

interface SidebarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  collapsed: boolean;
}

export default function Sidebar({ current, onNavigate, collapsed }: SidebarProps) {
  return (
    <aside
      className="flex flex-col h-full border-r transition-all duration-300"
      style={{
        width: collapsed ? 56 : 220,
        backgroundColor: "#070c18",
        borderColor: "#1a2f52",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-3 py-4 border-b"
        style={{ borderColor: "#1a2f52" }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center rounded"
          style={{ width: 32, height: 32, backgroundColor: "#1a3a6b" }}
        >
          <Shield size={18} color="#60a5fa" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-display font-bold text-sm tracking-widest" style={{ color: "#e2f0ff", letterSpacing: "0.15em" }}>
              NETINTELLECT
            </div>
            <div className="text-[9px] tracking-wider" style={{ color: "#4a6a8a", letterSpacing: "0.08em" }}>
              INVESTIGATIVE INTELLIGENCE
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <div
                className="font-display font-semibold text-[10px] tracking-widest px-2 mb-2"
                style={{ color: "#3a5272" }}
              >
                {group.label}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ id, label, icon: Icon }) => {
                const active = current === id;
                return (
                  <button
                    key={id}
                    onClick={() => onNavigate(id)}
                    title={collapsed ? label : undefined}
                    className="flex items-center gap-3 px-2 py-2 rounded text-left w-full transition-colors duration-150 group"
                    style={{
                      backgroundColor: active ? "#0f2040" : "transparent",
                      color: active ? "#60a5fa" : "#5a7a9a",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.backgroundColor = "#0c1a2e";
                      if (!active) e.currentTarget.style.color = "#90b8d8";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.backgroundColor = "transparent";
                      if (!active) e.currentTarget.style.color = "#5a7a9a";
                    }}
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="font-display font-medium text-sm tracking-wide flex-1">{label}</span>
                        {active && <ChevronRight size={12} />}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-2 space-y-1" style={{ borderColor: "#1a2f52" }}>
        {/* System Status */}
        <div
          className="flex items-center gap-2 px-2 py-1.5 rounded"
          style={{ backgroundColor: "#0a1f0a" }}
        >
          <Wifi size={12} color="#22c55e" />
          {!collapsed && (
            <span className="font-mono-data text-[10px] tracking-wider" style={{ color: "#22c55e" }}>
              SYSTEM ONLINE
            </span>
          )}
        </div>
        {/* Profile */}
        <button
          className="flex items-center gap-2 px-2 py-1.5 rounded w-full text-left transition-colors"
          style={{ color: "#5a7a9a" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#0c1a2e"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-sm text-[10px] font-bold"
            style={{ width: 20, height: 20, backgroundColor: "#1a3a6b", color: "#60a5fa" }}
          >
            I
          </div>
          {!collapsed && (
            <div>
              <div className="font-display text-xs font-semibold" style={{ color: "#90b8d8" }}>Officer 102</div>
              <div className="font-mono-data text-[9px]" style={{ color: "#3a5272" }}>INVESTIGATOR</div>
            </div>
          )}
        </button>
        {/* Settings */}
        <button
          className="flex items-center gap-2 px-2 py-1.5 rounded w-full transition-colors"
          style={{ color: "#3a5272" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#0c1a2e"; e.currentTarget.style.color = "#5a7a9a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#3a5272"; }}
        >
          <Settings size={14} />
          {!collapsed && <span className="font-display text-xs font-medium">Settings</span>}
        </button>
      </div>
    </aside>
  );
}
