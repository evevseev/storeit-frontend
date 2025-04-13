import { WarehouseData } from "./types";

export const warehouseData: WarehouseData = [
  {
    id: "org1",
    type: "organizationUnit",
    name: "North America Distribution",
    shortName: "NAD",
    description: "Main distribution center for North America",
    link: "/organization/org1",
    children: [
      {
        id: "sg1",
        type: "storageGroup",
        name: "East Coast Storage",
        shortName: "ECS",
        description: "Storage facilities for east coast distribution",
        link: "/storage-group/sg1",
        children: [
          {
            id: "sg3",
            type: "storageGroup",
            name: "Northeast Region",
            shortName: "NER",
            description: "Storage for northeast states",
            link: "/storage-group/sg3",
            children: [
              {
                id: "cg1",
                type: "cellGroup",
                name: "New York Cell",
                shortName: "NYC",
                description: "Storage cells for New York area",
                link: "/cell-group/cg1",
              },
              {
                id: "cg2",
                type: "cellGroup",
                name: "Boston Cell",
                shortName: "BOS",
                description: "Storage cells for Boston area",
                link: "/cell-group/cg2",
              },
            ],
          },
          {
            id: "cg3",
            type: "cellGroup",
            name: "Southeast Cell",
            shortName: "SEC",
            description: "Storage cells for southeast region",
            link: "/cell-group/cg3",
          },
        ],
      },
      {
        id: "sg2",
        type: "storageGroup",
        name: "West Coast Storage",
        shortName: "WCS",
        description: "Storage facilities for west coast distribution",
        link: "/storage-group/sg2",
        children: [
          {
            id: "cg4",
            type: "cellGroup",
            name: "California Cell",
            shortName: "CAL",
            description: "Storage cells for California area",
            link: "/cell-group/cg4",
          },
          {
            id: "cg5",
            type: "cellGroup",
            name: "Washington Cell",
            shortName: "WAS",
            description: "Storage cells for Washington area",
            link: "/cell-group/cg5",
          },
        ],
      },
    ],
  },
  {
    id: "org2",
    type: "organizationUnit",
    name: "European Distribution",
    shortName: "EUD",
    description: "Main distribution center for Europe",
    link: "/organization/org2",
    children: [
      {
        id: "sg4",
        type: "storageGroup",
        name: "Central Europe Storage",
        shortName: "CES",
        description: "Storage facilities for central Europe",
        link: "/storage-group/sg4",
        children: [
          {
            id: "cg6",
            type: "cellGroup",
            name: "Germany Cell",
            shortName: "GER",
            description: "Storage cells for Germany",
            link: "/cell-group/cg6",
          },
        ],
      },
    ],
  },
]; 