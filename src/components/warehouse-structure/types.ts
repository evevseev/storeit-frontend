export type ElementBase = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  link: string;
};

export type CellGroup = ElementBase & {
  type: "cellGroup";
};

export type StorageGroup = ElementBase & {
  type: "storageGroup";
  children: (StorageGroup | CellGroup)[];
};

export type OrganizationUnit = ElementBase & {
  type: "organizationUnit";
  children: StorageGroup[];
};

export type WarehouseData = OrganizationUnit[]; 