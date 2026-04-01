import type {
  User, Pharmacy, Asset, IncidentReport, Task, TaskComment,
  InventoryCycle, InventoryItem, Notification, ActivityLog,
  AssetCategory, SlaConfig,
} from '@/types';

// ─── Theme Colors ───────────────────────────────────────────
export const THEME_COLORS = [
  '#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706',
  '#0891B2', '#DB2777', '#4F46E5', '#16A34A', '#EA580C',
];

// ─── Users ──────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Nguyễn Văn An', email: 'an@hv.vn', phone: '0901000001', role: 'admin', pharmacyIds: [], status: 'active', themeColor: THEME_COLORS[0] },
  { id: 'u2', name: 'Trần Thị Bình', email: 'binh@hv.vn', phone: '0901000002', role: 'ops_manager', pharmacyIds: [], status: 'active', themeColor: THEME_COLORS[1] },
  { id: 'u3', name: 'Lê Minh Châu', email: 'chau@hv.vn', phone: '0901000003', role: 'operations', pharmacyIds: [], status: 'active', themeColor: THEME_COLORS[2] },
  { id: 'u4', name: 'Phạm Thị Dung', email: 'dung@hv.vn', phone: '0901000004', role: 'operations', pharmacyIds: [], status: 'active', themeColor: THEME_COLORS[3] },
  { id: 'u5', name: 'Hoàng Văn Em', email: 'em@hv.vn', phone: '0901000005', role: 'counter_staff', pharmacyIds: ['ph1'], status: 'active', themeColor: THEME_COLORS[4] },
  { id: 'u6', name: 'Vũ Thị Phương', email: 'phuong@hv.vn', phone: '0901000006', role: 'counter_staff', pharmacyIds: ['ph2'], status: 'active', themeColor: THEME_COLORS[5] },
  { id: 'u7', name: 'Đỗ Quang Huy', email: 'huy@hv.vn', phone: '0901000007', role: 'counter_staff', pharmacyIds: ['ph3'], status: 'active', themeColor: THEME_COLORS[6] },
  { id: 'u8', name: 'Ngô Thị Lan', email: 'lan@hv.vn', phone: '0901000008', role: 'inventory_staff', pharmacyIds: ['ph1', 'ph2', 'ph3'], status: 'active', themeColor: THEME_COLORS[7] },
  { id: 'u9', name: 'Bùi Văn Khoa', email: 'khoa@hv.vn', phone: '0901000009', role: 'inventory_staff', pharmacyIds: ['ph4', 'ph5'], status: 'active', themeColor: THEME_COLORS[8] },
  { id: 'u10', name: 'Mai Thị Hồng', email: 'hong@hv.vn', phone: '0901000010', role: 'counter_staff', pharmacyIds: ['ph4'], status: 'active', themeColor: THEME_COLORS[9] },
];

// ─── Pharmacies ─────────────────────────────────────────────
export const MOCK_PHARMACIES: Pharmacy[] = [
  { id: 'ph1', name: 'Nhà thuốc Hoàng Việt - Nguyễn Trãi', address: '123 Nguyễn Trãi, Q.5, TP.HCM', phone: '028 3800 0001', managerId: 'u5', assetCount: 15, status: 'active' },
  { id: 'ph2', name: 'Nhà thuốc Hoàng Việt - Lê Văn Sỹ', address: '456 Lê Văn Sỹ, Q.3, TP.HCM', phone: '028 3800 0002', managerId: 'u6', assetCount: 12, status: 'active' },
  { id: 'ph3', name: 'Nhà thuốc Hoàng Việt - Cách Mạng T8', address: '789 CMT8, Q.10, TP.HCM', phone: '028 3800 0003', managerId: 'u7', assetCount: 10, status: 'active' },
  { id: 'ph4', name: 'Nhà thuốc Hoàng Việt - Hai Bà Trưng', address: '321 Hai Bà Trưng, Q.1, TP.HCM', phone: '028 3800 0004', managerId: 'u10', assetCount: 14, status: 'active' },
  { id: 'ph5', name: 'Nhà thuốc Hoàng Việt - Phan Xích Long', address: '55 Phan Xích Long, Phú Nhuận, TP.HCM', phone: '028 3800 0005', managerId: 'u10', assetCount: 8, status: 'inactive' },
];

// ─── Assets ─────────────────────────────────────────────────
export const MOCK_ASSETS: Asset[] = [
  // Pharmacy 1 (ph1)
  { id: 'a1', code: 'TS-001', name: 'Máy tính quầy 1', category: 'Thiết bị IT', type: 'Máy tính', pharmacyId: 'ph1', location: 'Quầy thu ngân', status: 'active', installDate: '2024-01-15', responsibleUserId: 'u5', totalRepairCost: 0 },
  { id: 'a2', code: 'TS-002', name: 'Màn hình quầy 1', category: 'Thiết bị IT', type: 'Màn hình', pharmacyId: 'ph1', location: 'Quầy thu ngân', status: 'active', installDate: '2024-01-15', responsibleUserId: 'u5', totalRepairCost: 0 },
  { id: 'a3', code: 'TS-003', name: 'Máy in hóa đơn', category: 'Thiết bị IT', type: 'Máy in', pharmacyId: 'ph1', location: 'Quầy thu ngân', status: 'needs_repair', installDate: '2024-01-15', responsibleUserId: 'u5', totalRepairCost: 500000 },
  { id: 'a4', code: 'TS-004', name: 'Điều hòa Daikin 12000BTU', category: 'Điện lạnh', type: 'Điều hòa', pharmacyId: 'ph1', location: 'Khu vực bán hàng', status: 'active', installDate: '2023-06-01', responsibleUserId: 'u5', totalRepairCost: 1200000 },
  { id: 'a5', code: 'TS-005', name: 'Kệ trưng bày thuốc A', category: 'Nội thất', type: 'Kệ', pharmacyId: 'ph1', location: 'Khu vực bán hàng', status: 'active', installDate: '2023-03-10', responsibleUserId: 'u5', totalRepairCost: 0 },
  { id: 'a6', code: 'TS-006', name: 'Kệ trưng bày thuốc B', category: 'Nội thất', type: 'Kệ', pharmacyId: 'ph1', location: 'Khu vực bán hàng', status: 'active', installDate: '2023-03-10', responsibleUserId: 'u5', totalRepairCost: 0 },
  { id: 'a7', code: 'TS-007', name: 'Camera an ninh - Cửa chính', category: 'An ninh', type: 'Camera', pharmacyId: 'ph1', location: 'Cửa chính', status: 'active', installDate: '2023-06-01', responsibleUserId: 'u5', totalRepairCost: 0 },
  { id: 'a8', code: 'TS-008', name: 'Router WiFi TP-Link', category: 'Thiết bị mạng', type: 'Router', pharmacyId: 'ph1', location: 'Phòng kho', status: 'active', installDate: '2024-02-01', responsibleUserId: 'u5', totalRepairCost: 0 },
  { id: 'a9', code: 'TS-009', name: 'Máy quét mã vạch', category: 'Thiết bị IT', type: 'Máy quét', pharmacyId: 'ph1', location: 'Quầy thu ngân', status: 'broken', installDate: '2024-01-15', responsibleUserId: 'u5', totalRepairCost: 350000 },
  { id: 'a10', code: 'TS-010', name: 'Tủ thuốc lạnh', category: 'Thiết bị y tế', type: 'Tủ lạnh', pharmacyId: 'ph1', location: 'Phòng kho', status: 'active', installDate: '2023-09-15', responsibleUserId: 'u5', totalRepairCost: 0 },

  // Pharmacy 2 (ph2)
  { id: 'a11', code: 'TS-011', name: 'Máy tính quầy 1', category: 'Thiết bị IT', type: 'Máy tính', pharmacyId: 'ph2', location: 'Quầy thu ngân', status: 'active', installDate: '2024-02-01', responsibleUserId: 'u6', totalRepairCost: 0 },
  { id: 'a12', code: 'TS-012', name: 'Điều hòa Samsung 18000BTU', category: 'Điện lạnh', type: 'Điều hòa', pharmacyId: 'ph2', location: 'Khu vực bán hàng', status: 'needs_repair', installDate: '2023-04-20', responsibleUserId: 'u6', totalRepairCost: 800000 },
  { id: 'a13', code: 'TS-013', name: 'Kệ trưng bày thuốc', category: 'Nội thất', type: 'Kệ', pharmacyId: 'ph2', location: 'Khu vực bán hàng', status: 'active', installDate: '2023-04-20', responsibleUserId: 'u6', totalRepairCost: 0 },
  { id: 'a14', code: 'TS-014', name: 'Bồn rửa tay', category: 'Hạ tầng', type: 'Bồn rửa', pharmacyId: 'ph2', location: 'Khu vệ sinh', status: 'broken', installDate: '2023-04-20', responsibleUserId: 'u6', totalRepairCost: 200000 },
  { id: 'a15', code: 'TS-015', name: 'Camera an ninh - Trong quầy', category: 'An ninh', type: 'Camera', pharmacyId: 'ph2', location: 'Trong quầy', status: 'active', installDate: '2024-01-10', responsibleUserId: 'u6', totalRepairCost: 0 },
  { id: 'a16', code: 'TS-016', name: 'Máy in hóa đơn', category: 'Thiết bị IT', type: 'Máy in', pharmacyId: 'ph2', location: 'Quầy thu ngân', status: 'active', installDate: '2024-02-01', responsibleUserId: 'u6', totalRepairCost: 0 },
  { id: 'a17', code: 'TS-017', name: 'Bàn phím + Chuột', category: 'Thiết bị IT', type: 'Phụ kiện', pharmacyId: 'ph2', location: 'Quầy thu ngân', status: 'active', installDate: '2024-02-01', responsibleUserId: 'u6', totalRepairCost: 0 },

  // Pharmacy 3 (ph3)
  { id: 'a18', code: 'TS-018', name: 'Máy tính quầy 1', category: 'Thiết bị IT', type: 'Máy tính', pharmacyId: 'ph3', location: 'Quầy thu ngân', status: 'active', installDate: '2024-03-01', responsibleUserId: 'u7', totalRepairCost: 0 },
  { id: 'a19', code: 'TS-019', name: 'Điều hòa Panasonic 12000BTU', category: 'Điện lạnh', type: 'Điều hòa', pharmacyId: 'ph3', location: 'Khu vực bán hàng', status: 'active', installDate: '2024-03-01', responsibleUserId: 'u7', totalRepairCost: 0 },
  { id: 'a20', code: 'TS-020', name: 'Kệ trưng bày A', category: 'Nội thất', type: 'Kệ', pharmacyId: 'ph3', location: 'Khu vực bán hàng', status: 'active', installDate: '2024-03-01', responsibleUserId: 'u7', totalRepairCost: 0 },
  { id: 'a21', code: 'TS-021', name: 'Bảng hiệu LED', category: 'Hạ tầng', type: 'Bảng hiệu', pharmacyId: 'ph3', location: 'Mặt tiền', status: 'needs_repair', installDate: '2023-12-01', responsibleUserId: 'u7', totalRepairCost: 600000 },
  { id: 'a22', code: 'TS-022', name: 'Ghế nhân viên', category: 'Nội thất', type: 'Ghế', pharmacyId: 'ph3', location: 'Quầy thu ngân', status: 'active', installDate: '2024-03-01', responsibleUserId: 'u7', totalRepairCost: 0 },

  // Pharmacy 4 (ph4)
  { id: 'a23', code: 'TS-023', name: 'Máy tính quầy 1', category: 'Thiết bị IT', type: 'Máy tính', pharmacyId: 'ph4', location: 'Quầy thu ngân', status: 'active', installDate: '2024-01-20', responsibleUserId: 'u10', totalRepairCost: 0 },
  { id: 'a24', code: 'TS-024', name: 'Máy tính quầy 2', category: 'Thiết bị IT', type: 'Máy tính', pharmacyId: 'ph4', location: 'Quầy tư vấn', status: 'active', installDate: '2024-01-20', responsibleUserId: 'u10', totalRepairCost: 0 },
  { id: 'a25', code: 'TS-025', name: 'Điều hòa LG 24000BTU', category: 'Điện lạnh', type: 'Điều hòa', pharmacyId: 'ph4', location: 'Khu vực bán hàng', status: 'active', installDate: '2023-08-15', responsibleUserId: 'u10', totalRepairCost: 500000 },
  { id: 'a26', code: 'TS-026', name: 'Hệ thống ống nước', category: 'Hạ tầng', type: 'Ống nước', pharmacyId: 'ph4', location: 'Khu vệ sinh', status: 'needs_repair', installDate: '2022-01-01', responsibleUserId: 'u10', totalRepairCost: 1500000 },
  { id: 'a27', code: 'TS-027', name: 'Camera an ninh x3', category: 'An ninh', type: 'Camera', pharmacyId: 'ph4', location: 'Cửa chính + Trong quầy', status: 'active', installDate: '2024-01-20', responsibleUserId: 'u10', totalRepairCost: 0 },

  // Pharmacy 5 (ph5)
  { id: 'a28', code: 'TS-028', name: 'Máy tính quầy', category: 'Thiết bị IT', type: 'Máy tính', pharmacyId: 'ph5', location: 'Quầy thu ngân', status: 'inactive', installDate: '2023-06-01', responsibleUserId: 'u10', totalRepairCost: 0 },
  { id: 'a29', code: 'TS-029', name: 'Kệ trưng bày', category: 'Nội thất', type: 'Kệ', pharmacyId: 'ph5', location: 'Khu vực bán hàng', status: 'inactive', installDate: '2023-06-01', responsibleUserId: 'u10', totalRepairCost: 0 },
  { id: 'a30', code: 'TS-030', name: 'Điều hòa Daikin 12000BTU', category: 'Điện lạnh', type: 'Điều hòa', pharmacyId: 'ph5', location: 'Khu vực bán hàng', status: 'inactive', installDate: '2023-06-01', responsibleUserId: 'u10', totalRepairCost: 0 },
];

// ─── Incidents ──────────────────────────────────────────────
export const MOCK_INCIDENTS: IncidentReport[] = [
  { id: 'inc1', code: 'SC-001', assetId: 'a3', pharmacyId: 'ph1', reporterId: 'u5', level: 1, title: 'Máy in hóa đơn không hoạt động', description: 'Máy in hóa đơn tại quầy thu ngân bị kẹt giấy và không in được. Ảnh hưởng trực tiếp đến bán hàng.', imageUrls: [], status: 'processing', createdAt: '2026-03-28T08:30:00Z', taskId: 'task1' },
  { id: 'inc2', code: 'SC-002', assetId: 'a9', pharmacyId: 'ph1', reporterId: 'u5', level: 2, title: 'Máy quét mã vạch hỏng', description: 'Máy quét không đọc được mã vạch, phải nhập thủ công.', imageUrls: [], status: 'processing', createdAt: '2026-03-27T14:00:00Z', taskId: 'task2' },
  { id: 'inc3', code: 'SC-003', assetId: 'a12', pharmacyId: 'ph2', reporterId: 'u6', level: 2, title: 'Điều hòa không mát', description: 'Điều hòa chạy nhưng không mát, nhiệt độ trong quầy rất nóng.', imageUrls: [], status: 'open', createdAt: '2026-03-29T10:00:00Z', taskId: 'task3' },
  { id: 'inc4', code: 'SC-004', assetId: 'a14', pharmacyId: 'ph2', reporterId: 'u6', level: 2, title: 'Bồn rửa tay bị tắc', description: 'Bồn rửa tay khu vệ sinh bị tắc, nước thoát rất chậm.', imageUrls: [], status: 'resolved', createdAt: '2026-03-20T09:00:00Z', taskId: 'task4' },
  { id: 'inc5', code: 'SC-005', assetId: 'a21', pharmacyId: 'ph3', reporterId: 'u7', level: 3, title: 'Bảng hiệu LED bị nhấp nháy', description: 'Bảng hiệu LED mặt tiền bị nhấp nháy liên tục vào buổi tối, ảnh hưởng thẩm mỹ.', imageUrls: [], status: 'processing', createdAt: '2026-03-30T07:00:00Z', taskId: 'task5' },
  { id: 'inc6', code: 'SC-006', assetId: 'a26', pharmacyId: 'ph4', reporterId: 'u10', level: 1, title: 'Rò rỉ ống nước khu vệ sinh', description: 'Ống nước bị rò rỉ gây ngập khu vệ sinh. Cần xử lý gấp.', imageUrls: [], status: 'processing', createdAt: '2026-03-31T06:00:00Z', taskId: 'task6' },
  { id: 'inc7', code: 'SC-007', assetId: 'a4', pharmacyId: 'ph1', reporterId: 'u5', level: 2, title: 'Điều hòa có tiếng ồn lạ', description: 'Điều hòa phát ra tiếng ồn lớn khi chạy, cần kiểm tra.', imageUrls: [], status: 'closed', createdAt: '2026-03-15T11:00:00Z', taskId: 'task7' },
  { id: 'inc8', code: 'SC-008', assetId: 'a25', pharmacyId: 'ph4', reporterId: 'u10', level: 3, title: 'Điều hòa cần vệ sinh định kỳ', description: 'Điều hòa cần vệ sinh, bảo dưỡng định kỳ.', imageUrls: [], status: 'open', createdAt: '2026-03-31T09:00:00Z' },
];

// ─── Tasks ──────────────────────────────────────────────────
export const MOCK_TASKS: Task[] = [
  { id: 'task1', code: 'TASK-001', incidentId: 'inc1', assetId: 'a3', pharmacyId: 'ph1', title: 'Sửa máy in hóa đơn - NT Nguyễn Trãi', description: 'Máy in kẹt giấy, cần kiểm tra và sửa chữa gấp.', status: 'in_progress', level: 1, assigneeId: 'u3', creatorId: 'u5', solution: 'self_repair', estimatedCost: 200000, actualCost: 0, responseSla: '2026-03-28T09:30:00Z', completionSla: '2026-03-28T16:30:00Z', slaStatus: 'at_risk', createdAt: '2026-03-28T08:30:00Z', updatedAt: '2026-03-28T10:00:00Z', beforeImages: [], duringImages: [], afterImages: [] },
  { id: 'task2', code: 'TASK-002', incidentId: 'inc2', assetId: 'a9', pharmacyId: 'ph1', title: 'Thay máy quét mã vạch - NT Nguyễn Trãi', description: 'Máy quét hỏng cần thay thế.', status: 'accepted', level: 2, assigneeId: 'u3', creatorId: 'u5', solution: 'replace_parts', estimatedCost: 800000, actualCost: 0, responseSla: '2026-03-27T18:00:00Z', completionSla: '2026-03-29T14:00:00Z', slaStatus: 'on_time', createdAt: '2026-03-27T14:00:00Z', updatedAt: '2026-03-27T15:00:00Z', beforeImages: [], duringImages: [], afterImages: [] },
  { id: 'task3', code: 'TASK-003', incidentId: 'inc3', assetId: 'a12', pharmacyId: 'ph2', title: 'Kiểm tra điều hòa - NT Lê Văn Sỹ', description: 'Điều hòa không mát, cần kiểm tra gas và vệ sinh.', status: 'pending', level: 2, assigneeId: null, creatorId: 'u6', solution: null, estimatedCost: 0, actualCost: 0, responseSla: '2026-03-29T14:00:00Z', completionSla: '2026-03-31T10:00:00Z', slaStatus: 'overdue', createdAt: '2026-03-29T10:00:00Z', updatedAt: '2026-03-29T10:00:00Z', beforeImages: [], duringImages: [], afterImages: [] },
  { id: 'task4', code: 'TASK-004', incidentId: 'inc4', assetId: 'a14', pharmacyId: 'ph2', title: 'Thông bồn rửa tay - NT Lê Văn Sỹ', description: 'Bồn rửa tay bị tắc cần thông.', status: 'waiting_confirmation', level: 2, assigneeId: 'u4', creatorId: 'u6', solution: 'outsource', estimatedCost: 300000, actualCost: 250000, responseSla: '2026-03-20T13:00:00Z', completionSla: '2026-03-22T09:00:00Z', slaStatus: 'on_time', createdAt: '2026-03-20T09:00:00Z', updatedAt: '2026-03-21T16:00:00Z', beforeImages: [], duringImages: [], afterImages: [] },
  { id: 'task5', code: 'TASK-005', incidentId: 'inc5', assetId: 'a21', pharmacyId: 'ph3', title: 'Sửa bảng hiệu LED - NT CMT8', description: 'Bảng hiệu LED nhấp nháy, cần kiểm tra mạch.', status: 'in_progress', level: 3, assigneeId: 'u4', creatorId: 'u7', solution: 'self_repair', estimatedCost: 500000, actualCost: 0, responseSla: '2026-03-30T11:00:00Z', completionSla: '2026-04-01T07:00:00Z', slaStatus: 'on_time', createdAt: '2026-03-30T07:00:00Z', updatedAt: '2026-03-30T10:00:00Z', beforeImages: [], duringImages: [], afterImages: [] },
  { id: 'task6', code: 'TASK-006', incidentId: 'inc6', assetId: 'a26', pharmacyId: 'ph4', title: 'Xử lý rò rỉ ống nước - NT HBT', description: 'Ống nước rò rỉ khu vệ sinh, cần xử lý gấp.', status: 'in_progress', level: 1, assigneeId: 'u3', creatorId: 'u10', solution: 'outsource', estimatedCost: 2000000, actualCost: 0, responseSla: '2026-03-31T07:00:00Z', completionSla: '2026-03-31T14:00:00Z', slaStatus: 'overdue', createdAt: '2026-03-31T06:00:00Z', updatedAt: '2026-03-31T08:00:00Z', beforeImages: [], duringImages: [], afterImages: [] },
  { id: 'task7', code: 'TASK-007', incidentId: 'inc7', assetId: 'a4', pharmacyId: 'ph1', title: 'Kiểm tra tiếng ồn điều hòa - NT Nguyễn Trãi', description: 'Điều hòa có tiếng ồn lạ khi vận hành.', status: 'completed', level: 2, assigneeId: 'u4', creatorId: 'u5', solution: 'self_repair', estimatedCost: 500000, actualCost: 400000, responseSla: '2026-03-15T15:00:00Z', completionSla: '2026-03-17T11:00:00Z', slaStatus: 'on_time', createdAt: '2026-03-15T11:00:00Z', updatedAt: '2026-03-16T14:00:00Z', completedAt: '2026-03-16T14:00:00Z', beforeImages: [], duringImages: [], afterImages: [] },
  { id: 'task8', code: 'TASK-008', assetId: 'a25', pharmacyId: 'ph4', title: 'Bảo dưỡng điều hòa - NT HBT', description: 'Vệ sinh và bảo dưỡng định kỳ điều hòa.', status: 'pending', level: 3, assigneeId: null, creatorId: 'u10', solution: null, estimatedCost: 0, actualCost: 0, responseSla: '2026-04-01T13:00:00Z', completionSla: '2026-04-03T09:00:00Z', slaStatus: 'on_time', createdAt: '2026-03-31T09:00:00Z', updatedAt: '2026-03-31T09:00:00Z', beforeImages: [], duringImages: [], afterImages: [] },
];

// ─── Task Comments ──────────────────────────────────────────
export const MOCK_COMMENTS: TaskComment[] = [
  { id: 'c1', taskId: 'task1', userId: 'u3', content: 'Đã tiếp nhận, đang di chuyển đến quầy.', imageUrls: [], createdAt: '2026-03-28T09:00:00Z' },
  { id: 'c2', taskId: 'task1', userId: 'u3', content: 'Đã kiểm tra, máy bị kẹt giấy bên trong. Đang tháo ra vệ sinh.', imageUrls: [], createdAt: '2026-03-28T10:00:00Z' },
  { id: 'c3', taskId: 'task4', userId: 'u4', content: 'Đã liên hệ đơn vị thông cống, họ sẽ đến lúc 14h.', imageUrls: [], createdAt: '2026-03-20T10:30:00Z' },
  { id: 'c4', taskId: 'task4', userId: 'u4', content: 'Đơn vị thông cống đã hoàn tất. Bồn rửa tay hoạt động bình thường.', imageUrls: [], createdAt: '2026-03-21T16:00:00Z' },
  { id: 'c5', taskId: 'task5', userId: 'u4', content: 'Đã kiểm tra, mạch driver LED bị lỏng. Đang sửa.', imageUrls: [], createdAt: '2026-03-30T10:00:00Z' },
  { id: 'c6', taskId: 'task6', userId: 'u3', content: 'Rò rỉ khá nghiêm trọng, đã tạm khóa van nước. Liên hệ thợ sửa ống.', imageUrls: [], createdAt: '2026-03-31T07:30:00Z' },
  { id: 'c7', taskId: 'task7', userId: 'u4', content: 'Tiếng ồn do cánh quạt bị bẩn. Đã vệ sinh xong.', imageUrls: [], createdAt: '2026-03-16T10:00:00Z' },
  { id: 'c8', taskId: 'task7', userId: 'u5', content: 'Xác nhận điều hòa đã chạy êm, hoàn tất.', imageUrls: [], createdAt: '2026-03-16T14:00:00Z' },
];

// ─── Inventory Cycles ───────────────────────────────────────
export const MOCK_INVENTORY_CYCLES: InventoryCycle[] = [
  { id: 'inv1', code: 'KK-2026-Q1', name: 'Kiểm kê Quý 1/2026', pharmacyIds: ['ph1', 'ph2', 'ph3'], assigneeIds: ['u8'], startDate: '2026-03-01', endDate: '2026-03-31', status: 'completed', createdAt: '2026-02-25T00:00:00Z' },
  { id: 'inv2', code: 'KK-2026-Q2', name: 'Kiểm kê Quý 2/2026', pharmacyIds: ['ph1', 'ph2', 'ph3', 'ph4'], assigneeIds: ['u8', 'u9'], startDate: '2026-04-01', endDate: '2026-04-30', status: 'in_progress', createdAt: '2026-03-25T00:00:00Z' },
  { id: 'inv3', code: 'KK-2026-PH4', name: 'Kiểm kê đặc biệt - NT HBT', pharmacyIds: ['ph4'], assigneeIds: ['u9'], startDate: '2026-03-15', endDate: '2026-03-20', status: 'completed', createdAt: '2026-03-10T00:00:00Z' },
];

// ─── Inventory Items ────────────────────────────────────────
export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  // Cycle 1 - ph1 assets
  { id: 'ii1', cycleId: 'inv1', assetId: 'a1', pharmacyId: 'ph1', checkStatus: 'present_good', checkedById: 'u8', checkedAt: '2026-03-05T09:00:00Z' },
  { id: 'ii2', cycleId: 'inv1', assetId: 'a2', pharmacyId: 'ph1', checkStatus: 'present_good', checkedById: 'u8', checkedAt: '2026-03-05T09:05:00Z' },
  { id: 'ii3', cycleId: 'inv1', assetId: 'a3', pharmacyId: 'ph1', checkStatus: 'present_damaged', notes: 'Máy in bị kẹt giấy', checkedById: 'u8', checkedAt: '2026-03-05T09:10:00Z' },
  { id: 'ii4', cycleId: 'inv1', assetId: 'a4', pharmacyId: 'ph1', checkStatus: 'present_good', checkedById: 'u8', checkedAt: '2026-03-05T09:15:00Z' },
  { id: 'ii5', cycleId: 'inv1', assetId: 'a9', pharmacyId: 'ph1', checkStatus: 'present_damaged', notes: 'Không quét được mã', checkedById: 'u8', checkedAt: '2026-03-05T09:20:00Z' },
  // Cycle 1 - ph2 assets
  { id: 'ii6', cycleId: 'inv1', assetId: 'a11', pharmacyId: 'ph2', checkStatus: 'present_good', checkedById: 'u8', checkedAt: '2026-03-10T09:00:00Z' },
  { id: 'ii7', cycleId: 'inv1', assetId: 'a12', pharmacyId: 'ph2', checkStatus: 'present_damaged', notes: 'Không mát', checkedById: 'u8', checkedAt: '2026-03-10T09:10:00Z' },
  { id: 'ii8', cycleId: 'inv1', assetId: 'a14', pharmacyId: 'ph2', checkStatus: 'present_damaged', notes: 'Bị tắc', checkedById: 'u8', checkedAt: '2026-03-10T09:20:00Z' },
  // Cycle 2 (in progress)
  { id: 'ii9', cycleId: 'inv2', assetId: 'a1', pharmacyId: 'ph1', checkStatus: 'present_good', checkedById: 'u8', checkedAt: '2026-04-01T08:00:00Z' },
  { id: 'ii10', cycleId: 'inv2', assetId: 'a2', pharmacyId: 'ph1', checkStatus: 'not_checked' },
  { id: 'ii11', cycleId: 'inv2', assetId: 'a11', pharmacyId: 'ph2', checkStatus: 'not_checked' },
  // Cycle 3 - special
  { id: 'ii12', cycleId: 'inv3', assetId: 'a23', pharmacyId: 'ph4', checkStatus: 'present_good', checkedById: 'u9', checkedAt: '2026-03-16T10:00:00Z' },
  { id: 'ii13', cycleId: 'inv3', assetId: 'a24', pharmacyId: 'ph4', checkStatus: 'present_good', checkedById: 'u9', checkedAt: '2026-03-16T10:05:00Z' },
  { id: 'ii14', cycleId: 'inv3', assetId: 'a26', pharmacyId: 'ph4', checkStatus: 'present_damaged', notes: 'Rò rỉ nước', checkedById: 'u9', checkedAt: '2026-03-16T10:10:00Z' },
];

// ─── Notifications ──────────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'sla_breach', title: 'SLA vi phạm', message: 'Task TASK-006 đã quá hạn SLA hoàn thành', recipientId: 'u2', relatedEntityType: 'task', relatedEntityId: 'task6', isRead: false, createdAt: '2026-03-31T14:30:00Z' },
  { id: 'n2', type: 'new_task', title: 'Task mới', message: 'Task mới TASK-008: Bảo dưỡng điều hòa - NT HBT', recipientId: 'u3', relatedEntityType: 'task', relatedEntityId: 'task8', isRead: false, createdAt: '2026-03-31T09:00:00Z' },
  { id: 'n3', type: 'task_assigned', title: 'Phân công task', message: 'Bạn được phân công TASK-006: Xử lý rò rỉ ống nước', recipientId: 'u3', relatedEntityType: 'task', relatedEntityId: 'task6', isRead: false, createdAt: '2026-03-31T06:30:00Z' },
  { id: 'n4', type: 'awaiting_confirmation', title: 'Chờ xác nhận', message: 'Task TASK-004 chờ quầy xác nhận hoàn tất', recipientId: 'u6', relatedEntityType: 'task', relatedEntityId: 'task4', isRead: false, createdAt: '2026-03-21T16:00:00Z' },
  { id: 'n5', type: 'comment_update', title: 'Comment mới', message: 'Lê Minh Châu đã cập nhật comment trên TASK-001', recipientId: 'u5', relatedEntityType: 'task', relatedEntityId: 'task1', isRead: true, createdAt: '2026-03-28T10:00:00Z' },
  { id: 'n6', type: 'status_change', title: 'Cập nhật trạng thái', message: 'TASK-005 chuyển sang trạng thái "Đang xử lý"', recipientId: 'u7', relatedEntityType: 'task', relatedEntityId: 'task5', isRead: true, createdAt: '2026-03-30T09:30:00Z' },
  { id: 'n7', type: 'request_completed', title: 'Hoàn thành', message: 'Yêu cầu SC-007 đã được xử lý hoàn tất', recipientId: 'u5', relatedEntityType: 'task', relatedEntityId: 'task7', isRead: true, createdAt: '2026-03-16T14:00:00Z' },
  { id: 'n8', type: 'new_inventory', title: 'Kiểm kê mới', message: 'Kỳ kiểm kê KK-2026-Q2 đã được tạo. Bắt đầu 01/04/2026', recipientId: 'u8', relatedEntityType: 'inventory', relatedEntityId: 'inv2', isRead: false, createdAt: '2026-03-25T08:00:00Z' },
  { id: 'n9', type: 'sla_breach', title: 'SLA vi phạm', message: 'Task TASK-003 chưa được tiếp nhận, đã quá hạn phản hồi', recipientId: 'u2', relatedEntityType: 'task', relatedEntityId: 'task3', isRead: false, createdAt: '2026-03-29T14:00:00Z' },
  { id: 'n10', type: 'asset_transfer', title: 'Điều chuyển tài sản', message: 'Tài sản TS-028 được điều chuyển từ NT PXL', recipientId: 'u10', relatedEntityType: 'asset', relatedEntityId: 'a28', isRead: true, createdAt: '2026-03-20T10:00:00Z' },
];

// ─── Activity Logs ──────────────────────────────────────────
export const MOCK_ACTIVITIES: ActivityLog[] = [
  { id: 'act1', userId: 'u10', action: 'Tạo phiếu báo hỏng SC-006', entityType: 'incident', entityId: 'inc6', timestamp: '2026-03-31T06:00:00Z' },
  { id: 'act2', userId: 'u3', action: 'Tiếp nhận task TASK-006', entityType: 'task', entityId: 'task6', timestamp: '2026-03-31T06:30:00Z' },
  { id: 'act3', userId: 'u10', action: 'Tạo phiếu báo hỏng SC-008', entityType: 'incident', entityId: 'inc8', timestamp: '2026-03-31T09:00:00Z' },
  { id: 'act4', userId: 'u4', action: 'Cập nhật comment trên TASK-005', entityType: 'task', entityId: 'task5', timestamp: '2026-03-30T10:00:00Z' },
  { id: 'act5', userId: 'u5', action: 'Xác nhận hoàn tất TASK-007', entityType: 'task', entityId: 'task7', timestamp: '2026-03-16T14:00:00Z' },
  { id: 'act6', userId: 'u8', action: 'Bắt đầu kiểm kê KK-2026-Q2', entityType: 'inventory', entityId: 'inv2', timestamp: '2026-04-01T08:00:00Z' },
];

// ─── Config / Catalog Data ──────────────────────────────────
export const MOCK_ASSET_CATEGORIES: AssetCategory[] = [
  { id: 'cat1', name: 'Thiết bị IT', types: ['Máy tính', 'Màn hình', 'Máy in', 'Máy quét', 'Phụ kiện'] },
  { id: 'cat2', name: 'Điện lạnh', types: ['Điều hòa', 'Quạt'] },
  { id: 'cat3', name: 'Nội thất', types: ['Kệ', 'Tủ', 'Bàn', 'Ghế'] },
  { id: 'cat4', name: 'An ninh', types: ['Camera', 'Cửa từ'] },
  { id: 'cat5', name: 'Thiết bị mạng', types: ['Router', 'Switch', 'Access Point'] },
  { id: 'cat6', name: 'Hạ tầng', types: ['Ống nước', 'Bồn rửa', 'Vòi nước', 'Bảng hiệu', 'Hệ thống điện'] },
  { id: 'cat7', name: 'Thiết bị y tế', types: ['Tủ lạnh', 'Tủ thuốc'] },
];

export const MOCK_SLA_CONFIGS: SlaConfig[] = [
  { level: 1, label: 'Cấp 1 - Gấp', responseHours: 1, completionHours: 8, color: '#EF4444' },
  { level: 2, label: 'Cấp 2 - Bình thường', responseHours: 4, completionHours: 48, color: '#F59E0B' },
  { level: 3, label: 'Cấp 3 - Cải thiện', responseHours: 4, completionHours: 48, color: '#3B82F6' },
];

export const INCIDENT_TYPES = [
  'Hư hỏng thiết bị', 'Rò rỉ nước', 'Sự cố điện', 'Hỏng nội thất',
  'Lỗi mạng/Internet', 'Hỏng camera', 'Vấn đề điều hòa', 'Khác',
];
