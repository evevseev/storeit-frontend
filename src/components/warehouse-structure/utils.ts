import { ElementBase, StorageGroup, OrganizationUnit } from './types';

export const matchesSearch = (item: ElementBase, searchQuery: string): boolean => {
  if (!searchQuery) return true;

  const query = searchQuery.toLowerCase();
  return (
    item.name.toLowerCase().includes(query) ||
    item.alias.toLowerCase().includes(query)
  );
};

export const storageGroupMatchesSearch = (
  item: StorageGroup,
  searchQuery: string
): boolean => {
  if (matchesSearch(item, searchQuery)) return true;

  return item.children.some((child) => {
    if (child.type === "cellGroup") {
      return matchesSearch(child, searchQuery);
    } else {
      return storageGroupMatchesSearch(child, searchQuery);
    }
  });
};

export const organizationUnitMatchesSearch = (
  item: OrganizationUnit,
  searchQuery: string
): boolean => {
  if (matchesSearch(item, searchQuery)) return true;

  return item.children.some((storageGroup) =>
    storageGroupMatchesSearch(storageGroup, searchQuery)
  );
}; 