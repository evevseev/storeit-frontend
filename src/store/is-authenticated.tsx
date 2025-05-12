"use client";
import { atomWithStorage } from "jotai/utils";

export const isAuthenticatedAtom = atomWithStorage<boolean>(
  "isAuthenticated",
  false
);
