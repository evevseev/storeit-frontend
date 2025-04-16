export type OrganizationUnit = {
  id: string;
  name: string;
  alias: string;
  address: string | null;
  children: StorageGroup[];
};

export type StorageGroup = {
  id: string;
  unitId: string;
  parentId: string | null;
  name: string;
  alias: string;
  children: StorageGroup[];
}
