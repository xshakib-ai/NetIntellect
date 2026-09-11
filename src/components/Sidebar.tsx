import {
  LayoutDashboard, FolderOpen, Network, Users, Clock,
  BarChart3, FileText, ScrollText, Settings, Shield,
  ChevronRight, Wifi,
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
        backgroundColor: "var(--bg-base)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-3 py-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center rounded"
          style={{ width: 32, height: 32, backgroundColor: "var(--accent-bg)" }}
        >
          <Shield size={18} style={{ color: "var(--accent)" }} />
        </div>
        {!collapsed && (
          <div>
            <div className="font-display font-bold text-sm tracking-widest" style={{ color: "var(--text-primary)", letterSpacing: "0.15em" }}>
              NETINTELLECT
            </div>
            <div className="text-[9px] tracking-wider" style={{ color: "var(--text-faint)", letterSpacing: "0.08em" }}>
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
                style={{ color: "var(--text-faint)" }}
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
                    className="flex items-center gap-3 px-2 py-2 text-left w-full transition-colors duration-150 group"
                    style={{
                      borderRadius: "9999px",
                      backgroundColor: active ? "var(--nav-active-bg)" : "transparent",
                      color: active ? "var(--nav-active-text)" : "var(--text-muted)",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.backgroundColor = "var(--nav-hover-bg)";
                      if (!active) e.currentTarget.style.color = "var(--nav-hover-text)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.backgroundColor = "transparent";
                      if (!active) e.currentTarget.style.color = "var(--text-muted)";
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
      <div className="border-t p-2 space-y-1" style={{ borderColor: "var(--border)" }}>
        {/* System Status */}
        <div
          className="flex items-center gap-2 px-2 py-1.5 rounded"
          style={{ backgroundColor: "var(--bg-status-ok)" }}
        >
          <Wifi size={12} style={{ color: "var(--status-ok-text)" }} />
          {!collapsed && (
            <span className="font-mono-data text-[10px] tracking-wider" style={{ color: "var(--status-ok-text)" }}>
              SYSTEM ONLINE
            </span>
          )}
        </div>
        {/* Profile */}
        <button
          className="flex items-center gap-2 px-2 py-1.5 rounded w-full text-left transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--nav-hover-bg)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-sm text-[10px] font-bold"
            style={{ width: 20, height: 20, backgroundColor: "var(--accent-bg)", color: "var(--accent)" }}
          >
            I
          </div>
          {!collapsed && (
            <div>
              <div className="font-display text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Officer 102</div>
              <div className="font-mono-data text-[9px]" style={{ color: "var(--text-faint)" }}>INVESTIGATOR</div>
            </div>
          )}
        </button>
        {/* Settings */}
        <button
          className="flex items-center gap-2 px-2 py-1.5 rounded w-full transition-colors"
          style={{ color: "var(--text-faint)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--nav-hover-bg)"; e.currentTarget.style.color = "var(--text-muted)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-faint)"; }}
        >
          <Settings size={14} />
          {!collapsed && <span className="font-display text-xs font-medium">Settings</span>}
        </button>
      </div>
    </aside>
  );
}
