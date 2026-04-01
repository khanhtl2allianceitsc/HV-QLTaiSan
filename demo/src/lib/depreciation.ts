/**
 * Calculate remaining value of an asset using straight-line depreciation.
 * remainingValue = originalCost - (originalCost / depreciationMonths * monthsUsed)
 * Minimum is 0 (fully depreciated).
 */
export function calcRemainingValue(
  originalCost: number,
  depreciationMonths: number,
  installDate: string
): number {
  if (depreciationMonths <= 0 || originalCost <= 0) return 0;
  const install = new Date(installDate);
  const now = new Date();
  const monthsUsed =
    (now.getFullYear() - install.getFullYear()) * 12 +
    (now.getMonth() - install.getMonth());
  const depreciated = (originalCost / depreciationMonths) * Math.max(0, monthsUsed);
  return Math.max(0, Math.round(originalCost - depreciated));
}

/**
 * Calculate depreciation percentage used.
 */
export function calcDepreciationPercent(
  depreciationMonths: number,
  installDate: string
): number {
  if (depreciationMonths <= 0) return 100;
  const install = new Date(installDate);
  const now = new Date();
  const monthsUsed =
    (now.getFullYear() - install.getFullYear()) * 12 +
    (now.getMonth() - install.getMonth());
  return Math.min(100, Math.round((Math.max(0, monthsUsed) / depreciationMonths) * 100));
}
