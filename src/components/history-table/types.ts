export type ChangeType = 'create' | 'update' | 'delete';

export enum ObjectType {
    Organization = 1,
    Unit = 2,
    StorageGroup = 3,
    CellsGroup = 4,
    Cell = 5,
    Item = 6,
    ItemInstance = 7,
    Employee = 8,
    Task = 9
}

export interface HistoryTableProps {
    objectType: ObjectType;
    objectId: string;
} 