"use client";

import { atom } from "jotai";

interface PageMetadata {
  title: string;
  breadcrumbs?: {
    href?: string;
    label: string;
  }[];
}

export const pageMetadataAtom = atom<PageMetadata>({
  title: "StoreIt",
  breadcrumbs: [{ label: "Home", href: "/" }],
});
