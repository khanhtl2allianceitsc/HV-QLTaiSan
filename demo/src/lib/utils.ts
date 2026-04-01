export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return formatDate(dateStr);
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    active: 'Hoạt động',
    inactive: 'Ngừng HĐ',
    needs_repair: 'Cần sửa',
    broken: 'Hỏng',
    transferred: 'Điều chuyển',
    pending: 'Chờ tiếp nhận',
    accepted: 'Đã tiếp nhận',
    in_progress: 'Đang xử lý',
    waiting_confirmation: 'Chờ xác nhận',
    completed: 'Hoàn tất',
    rejected: 'Từ chối',
    open: 'Mở',
    processing: 'Đang xử lý',
    resolved: 'Đã xử lý',
    closed: 'Đã đóng',
    planned: 'Kế hoạch',
    present_good: 'Tốt',
    present_damaged: 'Hư hỏng',
    not_found: 'Không tìm thấy',
    not_checked: 'Chưa kiểm',
    on_time: 'Trong hạn',
    at_risk: 'Sắp trễ',
    overdue: 'Quá hạn',
  };
  return map[status] || status;
}

export function getLevelLabel(level: 1 | 2 | 3): string {
  if (level === 1) return 'Cấp 1 - Gấp';
  if (level === 2) return 'Cấp 2 - Bình thường';
  return 'Cấp 3 - Cải thiện';
}

export function getLevelColor(level: 1 | 2 | 3): string {
  if (level === 1) return 'text-danger';
  if (level === 2) return 'text-warning';
  return 'text-info';
}

export function getRoleLabel(role: string): string {
  const map: Record<string, string> = {
    admin: 'Admin',
    ops_manager: 'Quản lý vận hành',
    operations: 'Bộ phận vận hành',
    counter_staff: 'Nhân viên quầy',
    inventory_staff: 'Nhân viên kiểm kê',
  };
  return map[role] || role;
}
