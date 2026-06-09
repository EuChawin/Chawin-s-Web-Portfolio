"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { Linkedin, Github, Instagram, Mail, ArrowRight, Send } from "lucide-react";

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/chawin-phaikeaw-510482319/", label: "LinkedIn", handle: "in/chawin" },
  { icon: Github, href: "https://github.com/EuChawin", label: "GitHub", handle: "@EuChawin" },
  { icon: Instagram, href: "https://www.instagram.com/eu.chxw_/", label: "Instagram", handle: "@eu.chxw_" },
  { icon: Mail, href: "mailto:europhaikeaw@gmail.com", label: "Email", handle: "europhaikeaw@gmail.com" },
];

export default function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");

    const formUrl = "https://formspree.io/f/mpqerpgb";
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(formUrl, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (response.ok) setFormState("success");
      else setFormState("error");
    } catch (err) {
      setFormState("error");
    }
  };

  return (
    <div className="section-padding">
      <div className="container-main">
        <Reveal><p className="section-label mb-3">Contact</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif text-display leading-none mb-6" style={{ color: "var(--text-primary)" }}>Let's connect.</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-body-lg mb-16 max-w-xl" style={{ color: "var(--text-secondary)" }}>
            Whether you'd like to discuss a project, share an opportunity, exchange ideas, or simply say hello, I'd be happy to hear from you.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Info */}
          <div className="md:col-span-5 flex flex-col gap-8">
            <Reveal delay={0.2}>
              <div>
                <h2 className="font-serif text-h3 mb-4" style={{ color: "var(--text-primary)" }}>Let's talk.</h2>
                <p className="text-body mb-8" style={{ color: "var(--text-secondary)" }}>
                  The best way to reach me is through email. I'll do my best to respond as soon as possible.
                </p>
                <div className="flex flex-col gap-4">
                  {socialLinks.map(({ icon: Icon, href, label, handle }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)]"
                      style={{ background: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
                    >
                      <div className="w-10 h-10 rounded-md flex items-center justify-center transition-colors group-hover:text-[var(--accent)] group-hover:bg-[var(--accent-muted)]" style={{ background: "var(--bg-surface-2)", color: "var(--text-tertiary)" }}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-body-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
                        <p className="text-caption" style={{ color: "var(--text-tertiary)" }}>{handle}</p>
                      </div>
                      <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all -translate-x-2 group-hover:translate-x-0" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Form */}
          <div className="md:col-span-7">
            <Reveal delay={0.25}>
              <div className="rounded-xl border p-6 md:p-8" style={{ background: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-md)" }}>
                {formState === "success" ? (
                  <div className="py-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
                      <Send size={24} />
                    </div>
                    <h3 className="font-serif text-h2 mb-3" style={{ color: "var(--text-primary)" }}>Message sent!</h3>
                    <p className="text-body-lg mb-8 max-w-xs mx-auto" style={{ color: "var(--text-secondary)" }}>
                      Thanks for reaching out. I'll get back to you as soon as possible.
                    </p>
                    <button onClick={() => setFormState("idle")} className="btn-ghost">Send another message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-caption uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Name</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className="w-full px-4 py-2.5 rounded-md border text-body outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                          style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-caption uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Email</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="w-full px-4 py-2.5 rounded-md border text-body outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                          style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="subject" className="text-caption uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Subject</label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-md border text-body outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                        style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 mb-2">
                      <label htmlFor="message" className="text-caption uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Message</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        className="w-full px-4 py-2.5 rounded-md border text-body outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] resize-none"
                        style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                      />
                    </div>
                    {formState === "error" && (
                      <p className="text-body-sm text-red-500 mb-2">Something went wrong. Please try again later.</p>
                    )}
                    <button
                      type="submit"
                      disabled={formState === "submitting"}
                      className="btn-primary w-full justify-center"
                    >
                      {formState === "submitting" ? (
                        <span className="opacity-70">Sending...</span>
                      ) : (
                        <>Send Message <ArrowRight size={15} /></>
                      )}
                    </button>
                    <p className="text-caption text-center mt-3" style={{ color: "var(--text-tertiary)" }}>
                      Powered by Formspree. No data is stored on this server.
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
