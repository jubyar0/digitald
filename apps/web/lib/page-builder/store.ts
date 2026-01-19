// lib/page-builder/store.ts
// Zustand store for Page Builder state management

import { create, type StoreApi, type UseBoundStore, type StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import type {
    PageSchema,
    PageElement,
    DeviceType,
    HistoryEntry,
    NewPageElement
} from './types';

// Maximum history entries to keep
const MAX_HISTORY = 50;

interface EditorState {
    // Page Data
    schema: PageSchema | null;

    // Editor State
    selectedId: string | null;
    hoveredId: string | null;
    device: DeviceType;
    editorMode: 'edit' | 'preview';
    isDirty: boolean;

    // History
    history: HistoryEntry[];
    historyIndex: number;

    // Sidebar State
    activeSidebarTab: 'components' | 'properties' | 'layers';

    // Actions
    setSchema: (schema: PageSchema) => void;
    resetEditor: () => void;
    selectElement: (id: string | null) => void;
    hoverElement: (id: string | null) => void;
    setDevice: (device: DeviceType) => void;
    setEditorMode: (mode: 'edit' | 'preview') => void;
    setActiveSidebarTab: (tab: 'components' | 'properties' | 'layers') => void;

    // Element Actions
    addElement: (element: NewPageElement, parentId?: string | null, index?: number) => string;
    updateElement: (id: string, updates: Partial<PageElement>) => void;
    removeElement: (id: string) => void;
    moveElement: (id: string, newParentId: string | null, newIndex: number) => void;
    duplicateElement: (id: string) => string | null;

    // Prop Updates
    updateElementProp: (id: string, propPath: string, value: unknown) => void;
    updateElementStyle: (id: string, stylePath: string, value: unknown) => void;
    updateElementMeta: (id: string, metaPath: string, value: unknown) => void;

    // Lock/Visibility
    toggleLock: (id: string) => void;
    toggleVisibility: (id: string) => void;

    // History Actions
    undo: () => void;
    redo: () => void;
    saveToHistory: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;

    // Save State
    markClean: () => void;
    getSchema: () => PageSchema | null;
}

// Helper to find element and its parent array
function findElement(
    elements: PageElement[],
    id: string
): { element: PageElement; parent: PageElement[]; index: number } | null {
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].id === id) {
            return { element: elements[i], parent: elements, index: i };
        }
        if (elements[i].children) {
            const found = findElement(elements[i].children!, id);
            if (found) return found;
        }
    }
    return null;
}

// Deep clone helper
function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

// Set nested value by path
function setNestedValue(obj: any, path: string, value: unknown): void {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
            current[keys[i]] = {};
        }
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
}

// Recursively update IDs for duplicated elements
function updateIds(element: PageElement): PageElement {
    const newElement = { ...element, id: nanoid() };
    if (newElement.children) {
        newElement.children = newElement.children.map(updateIds);
    }
    return newElement;
}

// Export state type for external use
export type { EditorState };

// Create store with explicit typing to avoid immer internal type leaking
type ImmerSet = (fn: (state: EditorState) => void) => void;

const storeCreator: StateCreator<EditorState, [["zustand/immer", never]]> = (set, get) => ({
    // Initial State
    schema: null,
    selectedId: null,
    hoveredId: null,
    device: 'desktop',
    editorMode: 'edit',
    isDirty: false,
    history: [],
    historyIndex: -1,
    activeSidebarTab: 'components',

    // Schema Actions
    setSchema: (schema) => set((state) => {
        state.schema = schema;
        state.isDirty = false;
        state.selectedId = null;
        state.history = [{ elements: deepClone(schema.elements), timestamp: Date.now() }];
        state.historyIndex = 0;
    }),

    resetEditor: () => set((state) => {
        state.schema = null;
        state.selectedId = null;
        state.hoveredId = null;
        state.isDirty = false;
        state.history = [];
        state.historyIndex = -1;
    }),

    // Selection Actions
    selectElement: (id) => set((state) => {
        state.selectedId = id;
        if (id) {
            state.activeSidebarTab = 'properties';
        }
    }),

    hoverElement: (id) => set((state) => {
        state.hoveredId = id;
    }),

    // View Actions
    setDevice: (device) => set((state) => {
        state.device = device;
    }),

    setEditorMode: (mode) => set((state) => {
        state.editorMode = mode;
        if (mode === 'preview') {
            state.selectedId = null;
            state.hoveredId = null;
        }
    }),

    setActiveSidebarTab: (tab) => set((state) => {
        state.activeSidebarTab = tab;
    }),

    // Element CRUD
    addElement: (element, parentId = null, index) => {
        const newId = nanoid();
        set((state) => {
            if (!state.schema) return;

            const newElement: PageElement = {
                ...element,
                id: newId,
            };

            if (parentId) {
                const found = findElement(state.schema.elements, parentId);
                if (found && found.element) {
                    if (!found.element.children) {
                        found.element.children = [];
                    }
                    const insertIndex = index ?? found.element.children.length;
                    found.element.children.splice(insertIndex, 0, newElement);
                }
            } else {
                const insertIndex = index ?? state.schema.elements.length;
                state.schema.elements.splice(insertIndex, 0, newElement);
            }

            state.isDirty = true;
            state.selectedId = newId;
        });
        return newId;
    },

    updateElement: (id, updates) => set((state) => {
        if (!state.schema) return;
        const found = findElement(state.schema.elements, id);
        if (found) {
            Object.assign(found.element, updates);
            state.isDirty = true;
        }
    }),

    updateElementProp: (id, propPath, value) => set((state) => {
        if (!state.schema) return;
        const found = findElement(state.schema.elements, id);
        if (found) {
            setNestedValue(found.element.props, propPath, value);
            state.isDirty = true;
        }
    }),

    updateElementStyle: (id, stylePath, value) => set((state) => {
        if (!state.schema) return;
        const found = findElement(state.schema.elements, id);
        if (found) {
            setNestedValue(found.element.styles, stylePath, value);
            state.isDirty = true;
        }
    }),

    updateElementMeta: (id, metaPath, value) => set((state) => {
        if (!state.schema) return;
        const found = findElement(state.schema.elements, id);
        if (found) {
            setNestedValue(found.element.meta, metaPath, value);
            state.isDirty = true;
        }
    }),

    removeElement: (id) => set((state) => {
        if (!state.schema) return;
        const found = findElement(state.schema.elements, id);
        if (found && found.parent) {
            found.parent.splice(found.index, 1);
            state.isDirty = true;
            if (state.selectedId === id) {
                state.selectedId = null;
            }
        }
    }),

    moveElement: (id, newParentId, newIndex) => set((state) => {
        if (!state.schema) return;
        const found = findElement(state.schema.elements, id);
        if (!found || !found.parent) return;

        // Remove from current position
        const [element] = found.parent.splice(found.index, 1);

        // Add to new position
        if (newParentId) {
            const newParent = findElement(state.schema.elements, newParentId);
            if (newParent && newParent.element) {
                if (!newParent.element.children) {
                    newParent.element.children = [];
                }
                newParent.element.children.splice(newIndex, 0, element);
            }
        } else {
            state.schema.elements.splice(newIndex, 0, element);
        }

        state.isDirty = true;
    }),

    duplicateElement: (id) => {
        let newId: string | null = null;
        set((state) => {
            if (!state.schema) return;
            const found = findElement(state.schema.elements, id);
            if (!found || !found.parent) return;

            const duplicate = updateIds(deepClone(found.element));
            duplicate.meta.label = `${duplicate.meta.label} (Copy)`;
            newId = duplicate.id;

            found.parent.splice(found.index + 1, 0, duplicate);
            state.isDirty = true;
            state.selectedId = duplicate.id;
        });
        return newId;
    },

    // Lock/Visibility
    toggleLock: (id) => set((state) => {
        if (!state.schema) return;
        const found = findElement(state.schema.elements, id);
        if (found) {
            found.element.meta.locked = !found.element.meta.locked;
            state.isDirty = true;
        }
    }),

    toggleVisibility: (id) => set((state) => {
        if (!state.schema) return;
        const found = findElement(state.schema.elements, id);
        if (found) {
            found.element.meta.hidden = !found.element.meta.hidden;
            state.isDirty = true;
        }
    }),

    // History
    undo: () => set((state) => {
        if (state.historyIndex > 0 && state.schema) {
            state.historyIndex--;
            state.schema.elements = deepClone(state.history[state.historyIndex].elements);
            state.isDirty = true;
        }
    }),

    redo: () => set((state) => {
        if (state.historyIndex < state.history.length - 1 && state.schema) {
            state.historyIndex++;
            state.schema.elements = deepClone(state.history[state.historyIndex].elements);
            state.isDirty = true;
        }
    }),

    saveToHistory: () => set((state) => {
        if (!state.schema) return;

        // Truncate future history if we're not at the end
        state.history = state.history.slice(0, state.historyIndex + 1);

        // Add new entry
        state.history.push({
            elements: deepClone(state.schema.elements),
            timestamp: Date.now(),
        });

        // Limit history size
        if (state.history.length > MAX_HISTORY) {
            state.history = state.history.slice(-MAX_HISTORY);
        }

        state.historyIndex = state.history.length - 1;
    }),

    canUndo: () => {
        const state = get();
        return state.historyIndex > 0;
    },

    canRedo: () => {
        const state = get();
        return state.historyIndex < state.history.length - 1;
    },

    // Save State
    markClean: () => set((state) => {
        state.isDirty = false;
    }),

    getSchema: () => get().schema,
});

export const useEditorStore = create<EditorState>()(immer(storeCreator));

// Selector hooks for optimized re-renders
export const useSelectedElement = () => {
    const schema = useEditorStore((state) => state.schema);
    const selectedId = useEditorStore((state) => state.selectedId);

    if (!schema || !selectedId) return null;

    const found = findElement(schema.elements, selectedId);
    return found?.element ?? null;
};

export const useEditorDevice = () => useEditorStore((state) => state.device);
export const useEditorMode = () => useEditorStore((state) => state.editorMode);
export const useIsDirty = () => useEditorStore((state) => state.isDirty);
