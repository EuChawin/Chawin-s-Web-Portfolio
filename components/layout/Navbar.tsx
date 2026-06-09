"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

const moreLinks = [
  { href: "/activities", label: "Activities" },
  { href: "/certifications", label: "Certifications" },
  { href: "/achievements", label: "Achievements" },
  { href: "/skills", label: "Skills" },
  { href: "/gallery", label: "Gallery" },
  { href: "/resume", label: "Resume" },
  { href: "/recommendations", label: "Recommendations" },
];

const allLinks = [...primaryLinks, ...moreLinks];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "glass" : "bg-transparent"
        )}
      >
        <nav className="container-main flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-lg font-normal tracking-tight transition-opacity hover:opacity-70"
            style={{ color: "var(--text-primary)" }}
          >
            Chawin<span style={{ color: "var(--accent)" }}>.</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-md text-body-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={cn(
                  "px-4 py-2 rounded-md text-body-sm font-medium transition-all duration-200",
                  "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                More
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMoreOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-48 z-20 rounded-md border py-1"
                      style={{
                        background: "var(--bg-surface)",
                        borderColor: "var(--border)",
                        boxShadow: "var(--shadow-md)",
                      }}
                    >
                      {moreLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-2 text-body-sm transition-colors duration-150"
                          style={{
                            color: pathname === link.href
                              ? "var(--accent)"
                              : "var(--text-secondary)",
                          }}
                          onMouseEnter={(e) =>
                            ((e.target as HTMLElement).style.color = "var(--text-primary)")
                          }
                          onMouseLeave={(e) =>
                          ((e.target as HTMLElement).style.color =
                            pathname === link.href
                              ? "var(--accent)"
                              : "var(--text-secondary)")
                          }
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="hidden md:inline-flex btn-text text-body-sm"
            >
              Contact
            </Link>
            <ThemeToggle />
            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className={cn(
                "flex md:hidden items-center justify-center w-9 h-9 rounded-md transition-all duration-200",
                "hover:bg-[var(--bg-surface-2)]"
              )}
            >
              {menuOpen ? (
                <X size={18} style={{ color: "var(--text-primary)" }} />
              ) : (
                <Menu size={18} style={{ color: "var(--text-primary)" }} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: "var(--bg)", backdropFilter: "blur(16px)" }}
          >
            {/* Header row */}
            <div className="container-main flex items-center justify-between h-16">
              <Link
                href="/"
                className="font-serif text-lg"
                style={{ color: "var(--text-primary)" }}
              >
                Chawin<span style={{ color: "var(--accent)" }}>.</span>
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-[var(--bg-surface-2)] transition-all duration-200"
              >
                <X size={18} style={{ color: "var(--text-primary)" }} />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 container-main py-8 flex flex-col gap-1">
              {allLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block py-3 text-h3 font-medium transition-colors duration-150",
                      pathname === link.href
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: allLinks.length * 0.04, duration: 0.35 }}
              >
                <Link
                  href="/contact"
                  className={cn(
                    "block py-3 text-h3 font-medium transition-colors duration-150",
                    pathname === "/contact"
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  Contact
                </Link>
              </motion.div>
            </div>

            {/* Social links at bottom */}
            <div className="container-main py-8 border-t" style={{ borderColor: "var(--border)" }}>
              <p className="section-label mb-4">Connect</p>
              <div className="flex gap-6">
                {[
                  { label: "LinkedIn", href: "https://www.linkedin.com/in/chawin-phaikeaw-510482319/" },
                  { label: "GitHub", href: "https://github.com/EuChawin" },
                  { label: "Instagram", href: "https://www.instagram.com/eu.chxw_/" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm font-medium transition-colors duration-150"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
