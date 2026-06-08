"use client";

import { useEffect } from "react";

export function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    // We just call the API endpoint and don't await/care about response
    fetch(`/api/blog/view?slug=${slug}`, { method: "POST" }).catch(() => {});
  }, [slug]);

  return null;
}
