"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Search,
  Users,
  Briefcase,
  Building2,
  X,
  Loader2,
  ArrowRight,
  Command,
} from "lucide-react";
import { globalSearch } from "@/services/admin/admin.service";
import { GlobalSearchResult } from "@/services/types/admin.types";

export function GlobalSearch() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "fr";

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GlobalSearchResult>({
    users: [],
    projects: [],
    properties: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults({ users: [], projects: [], properties: [] });
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults({ users: [], projects: [], properties: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await globalSearch(query);
        setResults(res);
      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const hasAnyResults =
    results.users.length > 0 ||
    results.projects.length > 0 ||
    results.properties.length > 0;

  const handleSelectResult = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  return (
    <>
      {/* Trigger Button in Header */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted text-xs text-muted-foreground transition-all cursor-pointer shadow-2xs max-w-xs w-48 sm:w-64 justify-between"
      >
        <span className="flex items-center gap-2 truncate">
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Search platform...</span>
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono text-muted-foreground font-semibold">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      {/* Modal Dialog Backdrop & Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            {/* Search Input Bar */}
            <div className="flex items-center px-4 border-b border-border/80 bg-muted/20">
              <Search className="h-4 w-4 text-muted-foreground shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search users, real estate projects, properties..."
                className="w-full h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden"
              />
              {loading && <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0 ml-2" />}
              {query && !loading && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Search Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
              {!query.trim() ? (
                <div className="py-8 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="font-semibold text-sm">Quick Cross-Entity Search</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Find users by name, projects by location, or properties by keyword.
                  </p>
                </div>
              ) : !loading && !hasAnyResults ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p className="font-semibold text-sm">No matches found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No users, projects, or properties matched "{query}".
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Users Results */}
                  {results.users.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        <Users className="h-3.5 w-3.5 text-indigo-500" />
                        <span>Users ({results.users.length})</span>
                      </div>
                      <div className="space-y-1">
                        {results.users.map((u) => (
                          <div
                            key={u.id}
                            onClick={() => handleSelectResult(`/${locale}/users`)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer border border-transparent hover:border-border/60"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-indigo-500/10 text-indigo-600 font-bold flex items-center justify-center text-xs">
                                {(u.fullName || u.email || "U")[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground text-sm leading-none">
                                  {u.fullName || "Unnamed User"}
                                </p>
                                <p className="text-muted-foreground text-xs mt-0.5">
                                  {u.email} {u.phoneNumber ? `• ${u.phoneNumber}` : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                                {u.role || "user"}
                              </span>
                              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects Results */}
                  {results.projects.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        <Briefcase className="h-3.5 w-3.5 text-violet-500" />
                        <span>Projects ({results.projects.length})</span>
                      </div>
                      <div className="space-y-1">
                        {results.projects.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => handleSelectResult(`/${locale}/projects/${p.id}`)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer border border-transparent hover:border-border/60"
                          >
                            <div>
                              <p className="font-semibold text-foreground text-sm leading-none">
                                {p.title || `Project #${p.id}`}
                              </p>
                              <p className="text-muted-foreground text-xs mt-0.5">
                                {p.city || p.state || "Algeria"} • Status: {p.status || "Announcement"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-primary">#{p.id}</span>
                              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Properties Results */}
                  {results.properties.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        <Building2 className="h-3.5 w-3.5 text-yashomePink" />
                        <span>Properties ({results.properties.length})</span>
                      </div>
                      <div className="space-y-1">
                        {results.properties.map((prop) => (
                          <div
                            key={prop.id}
                            onClick={() => handleSelectResult(`/${locale}/properties/edit/${prop.id}`)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer border border-transparent hover:border-border/60"
                          >
                            <div>
                              <p className="font-semibold text-foreground text-sm leading-none">
                                {prop.propertyName || prop.title || `Property #${prop.id}`}
                              </p>
                              <p className="text-muted-foreground text-xs mt-0.5">
                                {prop.city || prop.state || "Algeria"} • {prop.propertyType || "VENTE"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-foreground">
                                {prop.price ? `${Number(prop.price).toLocaleString()} DZD` : "On request"}
                              </span>
                              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2 border-t border-border/60 bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Press <kbd className="px-1 py-0.5 rounded bg-background border border-border">ESC</kbd> to close</span>
              <span>Global Search API</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
