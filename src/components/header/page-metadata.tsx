"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { pageMetadataAtom } from "@/components/header/page-header";

interface PageMetadataProps {
  title: string;
  breadcrumbs?: {
    href?: string;
    label: string;
  }[];
}

export function PageMetadata({ title, breadcrumbs }: PageMetadataProps) {
  const setMetadata = useSetAtom(pageMetadataAtom);

  useEffect(() => {
    setMetadata({ title, breadcrumbs });
  }, [title, breadcrumbs, setMetadata]);

  return null;
}
