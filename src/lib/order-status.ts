export const ORDER_STATUS_LABELS: Record<string, string> = {
  NEW: 'جديد',
  PREPARING: 'جاري التجهيز',
  SHIPPING: 'جاري التوصيل',
  DELIVERED: 'تم التوصيل',
};

export const ORDER_STATUSES = ['NEW', 'PREPARING', 'SHIPPING', 'DELIVERED'] as const;
