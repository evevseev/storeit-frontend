"use client";

import { useEffect } from "react";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { PageMetadataConfig } from "@/store/page-metadata";

export function PageMetadata({
  title,
  breadcrumbs,
  actions,
}: PageMetadataConfig) {
  const { setPageMetadata } = usePageMetadata();

  useEffect(() => {
    setPageMetadata({ title, breadcrumbs, actions });
  }, [title, breadcrumbs, actions, setPageMetadata]);

  return null;
}
