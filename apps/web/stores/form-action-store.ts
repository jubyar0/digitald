import { create } from 'zustand'

interface FormActionState {
    isVisible: boolean
    isDirty: boolean
    isPending: boolean
    onSave: () => void | Promise<void>
    onDiscard: () => void | Promise<void>

    showActions: (actions: { onSave: () => void | Promise<void>; onDiscard: () => void | Promise<void> }) => void
    hideActions: () => void
    setIsDirty: (isDirty: boolean) => void
    setIsPending: (isPending: boolean) => void
}

export const useFormActionStore = create<FormActionState>((set) => ({
    isVisible: false,
    isDirty: false,
    isPending: false,
    onSave: () => { },
    onDiscard: () => { },

    showActions: ({ onSave, onDiscard }) => set({ isVisible: true, onSave, onDiscard }),
    hideActions: () => set({ isVisible: false, isDirty: false, isPending: false, onSave: () => { }, onDiscard: () => { } }),
    setIsDirty: (isDirty) => set({ isDirty }),
    setIsPending: (isPending) => set({ isPending }),
}))
