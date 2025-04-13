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
export const itemOpenAtom = atomFamily((itemId: string) =>
    atom((get) => {
        const openItems = get(openItemsAtom);
        return !!openItems[itemId];
    })
);

export const toggleItemAtom = atom(
    null,
    (get, set, params: {
        itemId: string,
        item?: OrganizationUnit | StorageGroup | CellGroup,
        isClosing?: boolean
    }) => {
        const { itemId, item, isClosing } = params;
        const openItems = get(openItemsAtom);
        const newState = { ...openItems };

        // If we're closing an item or it's currently open and we're toggling it closed
        if (isClosing || openItems[itemId]) {
            delete newState[itemId];

            // If this is a parent item, also close all descendants
            if (item && 'children' in item) {
                const descendantIds = getAllDescendantIds(item);
                descendantIds.forEach(id => {
                    delete newState[id];
                });
            }
        } else {
            newState[itemId] = true;
        }

        set(openItemsAtom, newState);
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