import Link from "next/link";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/activities", label: "Activities" },
  { href: "/blog", label: "Blog" },
  { href: "/certifications", label: "Certifications" },
  { href: "/skills", label: "Skills" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/chawin-phaikeaw-510482319/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/EuChawin", label: "GitHub" },
  { icon: Instagram, href: "https://www.instagram.com/eu.chxw_//", label: "Instagram" },
  { icon: Mail, href: "mailto:europhaikeaw@gmail.com", label: "Email" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t mt-auto"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-surface)",
      }}
    >
      <div className="container-main py-16">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-12">
          {/* Identity */}
          <div className="max-w-xs">
            <Link
              href="/"
              className="font-serif text-2xl"
              style={{ color: "var(--text-primary)" }}
            >
              Chawin<span style={{ color: "var(--accent)" }}>.</span>
            </Link>
            <p
              className="mt-2 text-body-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Computer Engineering Student · Builder · Global Explorer
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-md border transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-tertiary)",
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-sm transition-colors duration-150 hover:text-[var(--text-primary)]"
                style={{ color: "var(--text-tertiary)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="divider mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-body-sm" style={{ color: "var(--text-tertiary)" }}>
            © {year} Chawin Phaikeaw · Built with intention.
          </p>
          <p className="text-body-sm" style={{ color: "var(--text-tertiary)" }}>
            Next.js · TypeScript · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
