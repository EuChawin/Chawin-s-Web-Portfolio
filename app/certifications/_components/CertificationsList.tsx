'use client';

import { useState } from 'react';
import { StaggerChildren, StaggerItem } from "@/components/ui/Reveal";
import { ExternalLink, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import type { Certification } from "@/lib/types/database";
import { formatDateShort } from "@/lib/utils/slug";

export function CertificationsList({ certifications }: { certifications: Certification[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {certifications.map((cert) => (
          <StaggerItem key={cert.id}>
            <div className="rounded-xl border p-6 h-full flex flex-col" style={{ background: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}>
              <div className="flex-1">
                <h3 className="font-medium text-body-lg mb-1" style={{ color: "var(--text-primary)" }}>{cert.name}</h3>
                <p className="text-body-sm mb-3 font-medium" style={{ color: "var(--text-secondary)" }}>{cert.issuer}</p>
                <p className="text-caption mb-4" style={{ color: "var(--text-tertiary)" }}>
                  Issued: {formatDateShort(cert.issue_date)}
                  {cert.expiry_date ? ` · Expires: ${formatDateShort(cert.expiry_date)}` : ''}
                </p>
                
                {cert.description && (
                  <p className="text-body-sm mb-4" style={{ color: "var(--text-secondary)" }}>{cert.description}</p>
                )}

                {cert.credential_id && (
                  <p className="font-mono text-caption mb-4" style={{ color: "var(--text-tertiary)" }}>ID: {cert.credential_id}</p>
                )}
              </div>
              
              <div className="mt-auto pt-5 flex flex-wrap items-center gap-3 border-t" style={{ borderColor: "var(--border)" }}>
                {cert.cover_image_url && (
                  <button 
                    onClick={() => setSelectedImage(cert.cover_image_url)}
                    className="btn-primary text-[13px] py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <ImageIcon size={14} /> View Certificate
                  </button>
                )}
                
                {cert.credential_url && (
                  <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="btn-text text-[13px] hover:underline">
                    Verify credential <ExternalLink size={12} className="inline ml-0.5" />
                  </a>
                )}
              </div>
            </div>
          </StaggerItem>
        ))}
        {certifications.length === 0 && (
          <div className="col-span-full py-16 text-center text-[var(--text-tertiary)] italic border border-dashed border-[var(--border)] rounded-xl">
            No certifications found.
          </div>
        )}
      </StaggerChildren>

      {/* Modal / Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X size={24} />
          </button>
          <div 
            className="relative w-full max-w-5xl max-h-full flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent clicking the image from closing
          >
            {/* Using img instead of next/image here so it can scale naturally up to its original size while fitting max bounds */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={selectedImage} 
              alt="Certificate" 
              className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
