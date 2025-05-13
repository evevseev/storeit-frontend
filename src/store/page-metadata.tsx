import { atom } from "jotai";

export interface PageMetadataConfig {
  title?: string;
  breadcrumbs?: {
    href?: string;
    label: string;
  }[];
  actions?: React.ReactNode[];
}

export const pageMetadataAtom = atom<PageMetadataConfig>({
  breadcrumbs: [{ label: "Главная", href: "/" }],
  actions: [],
});
