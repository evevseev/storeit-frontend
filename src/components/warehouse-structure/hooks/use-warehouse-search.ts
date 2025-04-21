import { useState, useCallback } from "react";

export function useWarehouseSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    searchQuery,
    handleSearch,
    clearSearch,
  };
} 