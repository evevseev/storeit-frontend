"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { pageMetadataAtom } from "@/components/header/page-header";
import { PageMetadataConfig } from "@/components/header/page-header";

export function PageMetadata({
  title,
  breadcrumbs,
  actions,
}: PageMetadataConfig) {
  const setMetadata = useSetAtom(pageMetadataAtom);

  useEffect(() => {
    setMetadata({ title, breadcrumbs, actions });
  }, [title, breadcrumbs, actions, setMetadata]);

  return null;
}
