"use client";

import { atom } from "jotai";

export interface PageMetadataConfig {
  title: string;
  breadcrumbs?: {
    href?: string;
    label: string;
  }[];
  actions?: React.ReactNode[];
}

export const pageMetadataAtom = atom<PageMetadataConfig>({
  title: "StoreIt",
  breadcrumbs: [{ label: "Главная", href: "/" }],
  actions: [],
});
