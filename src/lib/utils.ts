export function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

export const CATEGORIES = [
  { id: 'ALL', label: 'TẤT CẢ', slug: '' },
  { id: 'AO', label: 'ÁO', slug: 'ao' },
  { id: 'QUAN', label: 'QUẦN', slug: 'quan' },
  { id: 'VAY', label: 'VÁY', slug: 'vay' },
  { id: 'AO_KHOAC', label: 'ÁO KHOÁC', slug: 'ao-khoac' },
  { id: 'GIAY', label: 'GIÀY DÉP', slug: 'giay' },
  { id: 'PHU_KIEN', label: 'PHỤ KIỆN', slug: 'phu-kien' },
] as const;

export const GENDERS = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'UNISEX', label: 'Unisex' },
  { id: 'NAM', label: 'Nam' },
  { id: 'NU', label: 'Nữ' },
] as const;

export const NAV_ITEMS = [
  'HÀNG MỚI VỀ',
  'UNISEX',
  'NAM',
  'NỮ',
  'ÁO',
  'QUẦN',
  'PHỤ KIỆN',
  'GIÀY DÉP',
  'SALE',
] as const;

export function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
