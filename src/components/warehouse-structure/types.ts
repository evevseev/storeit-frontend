export type ElementBase = {
  id: string;
  name: string;
  alias: string;
};

export type OrganizationUnit = ElementBase & {
  address: string | null;
  children: (StorageGroup | CellGroup)[];
  type: "organizationUnit";
};

export type CellGroup = ElementBase & {
  storageGroupId: string | null;
  unitId: string;
  type: 'cellGroup';
};

export type StorageGroup = ElementBase & {
  unitId: string;
  parentId: string | null;
  type: 'storageGroup';
  children: (StorageGroup | CellGroup)[];
};
