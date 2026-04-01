// User roles
export type UserRole = 'counter_staff' | 'inventory_staff' | 'operations' | 'ops_manager' | 'admin';

// Asset statuses
export type AssetStatus = 'active' | 'needs_repair' | 'broken' | 'inactive' | 'transferred';

// Task statuses - this is the workflow
export type TaskStatus = 'pending' | 'accepted' | 'in_progress' | 'waiting_confirmation' | 'completed' | 'rejected';

// Incident severity
export type IncidentLevel = 1 | 2 | 3;

// Inventory item check status
export type InventoryItemStatus = 'present_good' | 'present_damaged' | 'not_found' | 'not_checked';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  pharmacyIds: string[]; // assigned pharmacies
  avatarUrl?: string;
  status: 'active' | 'inactive';
  themeColor: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  managerId: string;
  assetCount: number;
  status: 'active' | 'inactive';
}

export interface Asset {
  id: string;
  code: string; // e.g. "TS-001"
  name: string;
  category: string; // e.g. "Thiết bị IT", "Nội thất", "Điện lạnh"
  type: string; // e.g. "Máy tính", "Kệ", "Điều hòa"
  pharmacyId: string;
  location: string; // e.g. "Khu vực quầy", "Phòng kho"
  status: AssetStatus;
  originalCost: number; // đơn giá ban đầu (VND)
  depreciationMonths: number; // thời gian khấu hao (tháng)
  installDate: string;
  responsibleUserId: string;
  imageUrl?: string;
  notes?: string;
  totalRepairCost: number;
}

export interface IncidentReport {
  id: string;
  code: string; // e.g. "SC-001"
  assetId: string;
  pharmacyId: string;
  reporterId: string;
  level: IncidentLevel;
  title: string;
  description: string;
  imageUrls: string[];
  status: 'open' | 'processing' | 'resolved' | 'closed';
  createdAt: string;
  taskId?: string;
}

export interface Task {
  id: string;
  code: string; // e.g. "TASK-001"
  incidentId?: string;
  assetId: string;
  pharmacyId: string;
  title: string;
  description: string;
  status: TaskStatus;
  level: IncidentLevel;
  assigneeId: string | null;
  creatorId: string;
  solution: 'self_repair' | 'replace_parts' | 'outsource' | null;
  estimatedCost: number;
  actualCost: number;
  // Cost breakdown
  laborCost: number;        // công thợ
  materialCost: number;     // vật tư
  supervisionCost: number;  // giám sát (only when solution = 'outsource')
  responseSla: string; // deadline ISO
  completionSla: string; // deadline ISO
  slaStatus: 'on_time' | 'at_risk' | 'overdue';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  beforeImages: string[];
  duringImages: string[];
  afterImages: string[];
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  imageUrls: string[];
  createdAt: string;
}

export interface InventoryCycle {
  id: string;
  code: string; // e.g. "KK-2024-01"
  name: string;
  pharmacyIds: string[];
  assigneeIds: string[];
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'completed';
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  cycleId: string;
  assetId: string;
  pharmacyId: string;
  checkStatus: InventoryItemStatus;
  condition?: string;
  notes?: string;
  checkedById?: string;
  checkedAt?: string;
}

export interface Notification {
  id: string;
  type:
    | 'new_task'
    | 'task_assigned'
    | 'comment_update'
    | 'status_change'
    | 'awaiting_confirmation'
    | 'sla_breach'
    | 'new_inventory'
    | 'asset_transfer'
    | 'request_completed'
    | 'request_rejected';
  title: string;
  message: string;
  recipientId: string;
  relatedEntityType: 'task' | 'asset' | 'incident' | 'inventory';
  relatedEntityId: string;
  isRead: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
}

export interface TransferRecord {
  id: string;
  code: string;
  assetId: string;
  type: 'pharmacy_transfer' | 'responsibility_transfer';
  fromPharmacyId?: string;
  toPharmacyId?: string;
  fromUserId?: string;
  toUserId?: string;
  reason: string;
  transferDate: string;
  performedById: string;
  status: 'draft' | 'approved' | 'awaiting_recipient' | 'completed' | 'cancelled';
  notes?: string;
  approvedById?: string;
  approvedAt?: string;
  recipientConfirmed?: boolean;
  recipientConfirmedById?: string;
  recipientConfirmedAt?: string;
  recipientNotes?: string;
}

// For the settings/config
export interface AssetCategory {
  id: string;
  name: string;
  types: string[];
}

export interface SlaConfig {
  level: IncidentLevel;
  label: string;
  responseHours: number;
  completionHours: number;
  color: string;
}
