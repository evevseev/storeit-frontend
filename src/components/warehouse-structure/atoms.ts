import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { atomFamily } from 'jotai/utils';
import { CellGroup, OrganizationUnit, StorageGroup } from './types';

type OpenItemsState = {
    [key: string]: boolean;
};

export const openItemsAtom = atomWithStorage<OpenItemsState>('warehouse-structure-open-items', {});

const getAllDescendantIds = (item: StorageGroup | OrganizationUnit): string[] => {
    const ids: string[] = [];

    if ('children' in item) {
        item.children.forEach(child => {
            ids.push(child.id);
            if ('children' in child) {
                ids.push(...getAllDescendantIds(child));
            }
        });
    }

    return ids;
};

export const itemOpenAtom = atomFamily((itemId: string) =>
    atom((get) => {
        const openItems = get(openItemsAtom);
        return !!openItems[itemId];
    })
);

export const toggleItemAtom = atom(
    null,
    (get, set, { itemId, item }: { itemId: string; item: any }) => {
        const openItems = get(openItemsAtom);
        const newOpenItems = { ...openItems };
        newOpenItems[itemId] = !openItems[itemId];
        set(openItemsAtom, newOpenItems);
    }
);

export const cleanupRemovedItemsAtom = atom(
    null,
    (get, set, currentItems: (OrganizationUnit | StorageGroup | CellGroup)[]) => {
        const openItems = get(openItemsAtom);
        const newState = { ...openItems };
        let hasChanges = false;

        const currentIds = new Set<string>();
        const addItemAndChildren = (item: OrganizationUnit | StorageGroup | CellGroup) => {
            currentIds.add(item.id);
            if ('children' in item) {
                item.children.forEach(addItemAndChildren);
            }
        };
        currentItems.forEach(addItemAndChildren);

        Object.keys(openItems).forEach(id => {
            if (!currentIds.has(id)) {
                delete newState[id];
                hasChanges = true;
            }
        });

        if (hasChanges) {
            set(openItemsAtom, newState);
        }
    }
);

export const searchQueryAtom = atom(""); 