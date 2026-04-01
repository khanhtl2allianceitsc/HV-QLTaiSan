import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User, Pharmacy, Asset, IncidentReport, Task, TaskComment,
  InventoryCycle, InventoryItem, Notification, ActivityLog,
  AssetCategory, SlaConfig, TaskStatus, TransferRecord,
} from '@/types';
import type { ToastItem, ToastType } from '@/components/ui/Toast';
import {
  MOCK_USERS, MOCK_PHARMACIES, MOCK_ASSETS, MOCK_INCIDENTS,
  MOCK_TASKS, MOCK_COMMENTS, MOCK_INVENTORY_CYCLES,
  MOCK_INVENTORY_ITEMS, MOCK_NOTIFICATIONS, MOCK_ACTIVITIES,
  MOCK_ASSET_CATEGORIES, MOCK_SLA_CONFIGS, MOCK_TRANSFERS,
} from '@/lib/mockData';

export interface StoreState {
  // Data
  currentUser: User | null;
  users: User[];
  pharmacies: Pharmacy[];
  assets: Asset[];
  incidents: IncidentReport[];
  tasks: Task[];
  comments: TaskComment[];
  inventoryCycles: InventoryCycle[];
  inventoryItems: InventoryItem[];
  notifications: Notification[];
  activities: ActivityLog[];
  assetCategories: AssetCategory[];
  slaConfigs: SlaConfig[];
  transfers: TransferRecord[];
  toasts: ToastItem[];

  // Auth
  login: (user: User) => void;
  logout: () => void;

  // Tasks
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  addComment: (comment: TaskComment) => void;

  // Incidents
  addIncident: (incident: IncidentReport) => void;
  updateIncident: (id: string, updates: Partial<IncidentReport>) => void;

  // Assets
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Inventory
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;

  // Toasts
  addToast: (type: ToastType, message: string) => void;
  dismissToast: (id: string) => void;

  // Activity
  logActivity: (userId: string, action: string, entityType: string, entityId: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial data
      currentUser: null,
      users: MOCK_USERS,
      pharmacies: MOCK_PHARMACIES,
      assets: MOCK_ASSETS,
      incidents: MOCK_INCIDENTS,
      tasks: MOCK_TASKS,
      comments: MOCK_COMMENTS,
      inventoryCycles: MOCK_INVENTORY_CYCLES,
      inventoryItems: MOCK_INVENTORY_ITEMS,
      notifications: MOCK_NOTIFICATIONS,
      activities: MOCK_ACTIVITIES,
      assetCategories: MOCK_ASSET_CATEGORIES,
      slaConfigs: MOCK_SLA_CONFIGS,
      transfers: MOCK_TRANSFERS,
      toasts: [],

      // Auth
      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),

      // Tasks
      updateTask: (id, updates) => set((s) => ({
        tasks: s.tasks.map((t) => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t),
      })),
      updateTaskStatus: (id, status) => {
        const updates: Partial<Task> = { status };
        if (status === 'completed') updates.completedAt = new Date().toISOString();
        get().updateTask(id, updates);
      },
      addComment: (comment) => set((s) => ({ comments: [...s.comments, comment] })),

      // Incidents
      addIncident: (incident) => set((s) => ({ incidents: [...s.incidents, incident] })),
      updateIncident: (id, updates) => set((s) => ({
        incidents: s.incidents.map((i) => i.id === id ? { ...i, ...updates } : i),
      })),

      // Assets
      addAsset: (asset) => set((s) => ({ assets: [...s.assets, asset] })),
      updateAsset: (id, updates) => set((s) => ({
        assets: s.assets.map((a) => a.id === id ? { ...a, ...updates } : a),
      })),

      // Notifications
      markNotificationRead: (id) => set((s) => ({
        notifications: s.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
      })),
      markAllNotificationsRead: () => set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      })),

      // Inventory
      updateInventoryItem: (id, updates) => set((s) => ({
        inventoryItems: s.inventoryItems.map((i) => i.id === id ? { ...i, ...updates } : i),
      })),

      // Toasts
      addToast: (type, message) => set((s) => ({
        toasts: [...s.toasts, { id: `toast-${Date.now()}`, type, message }],
      })),
      dismissToast: (id) => set((s) => ({
        toasts: s.toasts.filter((t) => t.id !== id),
      })),

      // Activity
      logActivity: (userId, action, entityType, entityId) => set((s) => ({
        activities: [
          { id: `act-${Date.now()}`, userId, action, entityType, entityId, timestamp: new Date().toISOString() },
          ...s.activities,
        ],
      })),
    }),
    {
      name: 'hv-qltaisan-storage',
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
);
