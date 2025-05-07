"use client";

import { useAtom } from "jotai";
import { pageMetadataAtom } from "@/store/page-metadata";

export function usePageMetadata() {
    const [pageMetadata, setPageMetadata] = useAtom(pageMetadataAtom);

    return {
        pageMetadata,
        setPageMetadata,
    };
}

