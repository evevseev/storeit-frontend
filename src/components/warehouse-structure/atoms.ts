import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { atomFamily } from 'jotai/utils';
import { CellGroup, OrganizationUnit, StorageGroup } from './types';

type OpenItemsState = {
    [key: string]: boolean;
};

export const openItemsAtom = atomWithStorage<OpenItemsState>('warehouse-structure-open-items', {});

// Helper function to get all descendant IDs of a storage group
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

// Create an atom family for each item's open state
export const itemOpenAtom = (itemId: string) =>
    atom(false);

export const toggleItemAtom = atom(
    null,
    (get, set, { itemId, item }: { itemId: string; item: any }) => {
        const isOpen = get(itemOpenAtom(itemId));
        set(itemOpenAtom(itemId), !isOpen);
    }
);

export const cleanupRemovedItemsAtom = atom(
    null,
    (get, set, currentItems: (OrganizationUnit | StorageGroup | CellGroup)[]) => {
        const openItems = get(openItemsAtom);
        const newState = { ...openItems };
        let hasChanges = false;

        // Create a set of all current item IDs
        const currentIds = new Set<string>();
        const addItemAndChildren = (item: OrganizationUnit | StorageGroup | CellGroup) => {
            currentIds.add(item.id);
            if ('children' in item) {
                item.children.forEach(addItemAndChildren);
            }
        };
        currentItems.forEach(addItemAndChildren);

        // Remove any stored state for items that no longer exist
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