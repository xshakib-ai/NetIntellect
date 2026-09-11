import { useState, useRef, useEffect } from "react";
import { Search, Bell, Calendar, Menu, X, AlertTriangle, DollarSign, CheckCircle, Info } from "lucide-react";
import { notifications } from "../lib/mockData";
import { search } from "../lib/api";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  demoMode: boolean;
  onToggleDemo: () => void;
  onSearch?: (query: string) => void;
}

export default function Header({ sidebarCollapsed, onToggleSidebar, demoMode, onToggleDemo }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Awaited<ReturnType<typeof search>> | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
        setSearchQuery("");
        setSearchResults(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults(null); return; }
    const t = setTimeout(async () => {
      const res = await search(searchQuery);
      setSearchResults(res);
    }, 200);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const notifIcon = (type: string) => {
    if (type === "alert") return <AlertTriangle size={12} color="#ef4444" />;
    if (type === "financial") return <DollarSign size={12} color="#10b981" />;
    if (type === "verified") return <CheckCircle size={12} color="#22c55e" />;
    return <Info size={12} color="#60a5fa" />;
  };

  return (
    <>
      <header
        className="flex items-center gap-4 px-4 h-12 border-b flex-shrink-0 relative z-30"
        style={{ backgroundColor: "var(--bg-base)", borderColor: "var(--border)" }}
      >
        {/* Sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="flex-shrink-0 transition-colors"
          style={{ color: "var(--text-faint)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-faint)"; }}
        >
          {sidebarCollapsed ? <Menu size={16} /> : <Menu size={16} />}
        </button>

        {/* Case badge */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div>
            <div className="font-mono-data text-[11px] font-semibold" style={{ color: "var(--accent)" }}>CASE-2026-001</div>
            <div className="font-display text-[10px] tracking-wider" style={{ color: "var(--text-faint)" }}>CYBERCRIME INVESTIGATION</div>
          </div>
          <div className="h-6 w-px" style={{ backgroundColor: "var(--border)" }} />
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ backgroundColor: "#22c55e" }} />
            <span className="font-display text-xs font-semibold tracking-wider" style={{ color: "#22c55e" }}>ACTIVE</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* DEMO MODE toggle */}
        <button
          onClick={onToggleDemo}
          className="flex items-center gap-2 px-3 py-1 rounded border text-xs font-mono-data tracking-wider transition-all"
          style={{
            borderColor: demoMode ? "#f97316" : "var(--border)",
            color: demoMode ? "#f97316" : "var(--text-faint)",
            backgroundColor: demoMode ? "rgba(249,115,22,0.08)" : "transparent",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: demoMode ? "#f97316" : "var(--text-faint)" }}
          />
          DEMO MODE
        </button>

        {/* Search trigger */}
        <button
          onClick={() => { setShowSearch(true); setTimeout(() => searchRef.current?.focus(), 50); }}
          className="flex items-center gap-2 px-3 py-1.5 rounded border text-xs transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--text-faint)", backgroundColor: "var(--bg-input)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-focus)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
        >
          <Search size={12} />
          <span className="font-mono-data" style={{ color: "var(--text-faint)" }}>Search...</span>
          <span
            className="font-mono-data text-[10px] px-1 rounded border"
            style={{ borderColor: "var(--border)", color: "var(--text-xfaint)" }}
          >
            ⌘K
          </span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex items-center justify-center w-8 h-8 rounded border transition-colors"
            style={{ borderColor: "var(--border)", color: "var(--text-faint)", backgroundColor: "var(--bg-input)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-focus)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-faint)"; }}
          >
            <Bell size={14} />
            <span
              className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold"
              style={{ backgroundColor: "#ef4444", color: "#fff" }}
            >
              4
            </span>
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 top-9 w-80 rounded border shadow-xl z-50"
              style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                <span className="font-display font-semibold text-xs tracking-wider" style={{ color: "var(--text-secondary)" }}>NOTIFICATIONS</span>
                <button onClick={() => setShowNotifications(false)}><X size={12} style={{ color: "var(--text-faint)" }} /></button>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="px-3 py-2.5 transition-colors cursor-pointer"
                    style={{ borderColor: "var(--border)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--bg-hover)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {notifIcon(n.type)}
                      <span className="font-display font-semibold text-xs" style={{ color: "var(--text-secondary)" }}>{n.title}</span>
                    </div>
                    <p className="text-xs leading-snug" style={{ color: "var(--text-muted)" }}>{n.body}</p>
                    <p className="font-mono-data text-[9px] mt-1" style={{ color: "var(--text-xfaint)" }}>{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Security badge */}
        <div
          className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded border"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-status-ok)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--status-ok-text)" }} />
          <span className="font-mono-data text-[9px] tracking-wider" style={{ color: "var(--status-ok-text)" }}>SECURE ENV</span>
        </div>
      </header>

      {/* Search overlay */}
      {showSearch && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-24"
          style={{ backgroundColor: "var(--bg-overlay)" }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowSearch(false); setSearchQuery(""); setSearchResults(null); } }}
        >
          <div className="w-full max-w-xl rounded border shadow-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-focus)" }}>
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
              <Search size={16} style={{ color: "var(--accent)" }} />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entities, cases, phones, FIRs..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "var(--text-secondary)" }}
              />
              <button onClick={() => { setShowSearch(false); setSearchQuery(""); setSearchResults(null); }}>
                <X size={14} style={{ color: "var(--text-faint)" }} />
              </button>
            </div>
            {searchResults && (
              <div className="max-h-96 overflow-y-auto p-2">
                {Object.entries(searchResults).map(([group, items]) => {
                  if (!items || (items as unknown[]).length === 0) return null;
                  return (
                    <div key={group} className="mb-3">
                      <div className="font-display font-semibold text-[10px] tracking-widest px-2 py-1" style={{ color: "var(--text-faint)" }}>
                        {group.toUpperCase()}
                      </div>
                      {(items as { id?: string; name?: string; filename?: string }[]).slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors"
                          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--bg-hover)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
                        >
                          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.name || item.filename}</span>
                          {item.id && <span className="font-mono-data text-[10px]" style={{ color: "var(--text-faint)" }}>{item.id}</span>}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
            {!searchQuery && (
              <div className="px-4 py-3">
                <p className="text-xs" style={{ color: "var(--text-faint)" }}>Try: "Rajesh Kumar", "+91 ••••••4821", "FIR-2026-0142", "CASE-2026-001"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
