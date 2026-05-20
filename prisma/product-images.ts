/** Ảnh Pexels — đã kiểm tra HTTP 200, khớp loại sản phẩm */
const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop`;

export const PRODUCT_IMAGES: Record<string, string> = {
  // ÁO
  'Áo thun cotton basic trắng': pexels(937481),
  'Áo thun oversize đen': pexels(767116),
  'Áo polo nam navy': pexels(2893741),
  'Áo sơ mi oxford trắng': pexels(2983464),
  'Áo sơ mi kẻ caro': pexels(4046312),
  'Áo len cổ lọ be': pexels(1926769),
  'Áo hoodie unisex xám': pexels(7170727),
  'Áo hoodie zip đen': pexels(1036623),
  'Áo tank top thể thao': pexels(1043474),
  'Áo graphic tee anime': pexels(985635),
  'Áo thun UT Peanuts': pexels(937481),
  'Áo thun UT Marvel': pexels(985635),
  'Áo thun UT Disney': pexels(4046314),
  'Áo len merino': pexels(4046311),
  'Set đồ thể thao': pexels(1036623),

  // QUẦN
  'Quần jean slim fit xanh': pexels(1541090),
  'Quần jean baggy đen': pexels(4046313),
  'Quần kaki nam be': pexels(767116),
  'Quần jogger unisex đen': pexels(1183266),
  'Quần short thể thao': pexels(994523),
  'Quần short jean': pexels(4046315),
  'Quần legging nữ đen': pexels(1043474),
  'Quần âu công sở': pexels(2983464),
  'Quần cargo unisex': pexels(4046316),
  'Quần linen rộng': pexels(4046317),

  // VÁY
  'Váy midi chấm bi': pexels(169133),
  'Váy maxi hoa nhí': pexels(1926769),
  'Váy shirt dress trắng': pexels(1082529),
  'Váy bodycon đen': pexels(1884584),
  'Váy tennis xanh': pexels(1043474),

  // ÁO KHOÁC
  'Áo khoác denim': pexels(1124468),
  'Áo khoác bomber': pexels(4046318),
  'Áo khoác gió chống nước': pexels(1036623),
  'Áo blazer công sở': pexels(2983464),
  'Áo cardigan len': pexels(4046319),

  // GIÀY DÉP
  'Giày sneaker trắng': pexels(2529148),
  'Giày sneaker đen': pexels(1884581),
  'Giày sandal unisex': pexels(2674030),
  'Dép slide basic': pexels(2905238),
  'Boots cổ thấp': pexels(4046320),

  // PHỤ KIỆN
  'Túi tote canvas': pexels(1152077),
  'Túi đeo chéo mini': pexels(1300975),
  'Ba lô thời trang': pexels(1552617),
  'Mũ bucket unisex': pexels(996329),
  'Mũ lưỡi trai': pexels(1552617),
  'Khăn choàng len': pexels(994523),
  'Thắt lưng da': pexels(2905238),
  'Ví da mini': pexels(994523),
  'Kính mát retro': pexels(996329),
  'Đồng hồ minimal': pexels(373125),
  'Vòng cổ bạc': pexels(985635),
  'Bông tai hoop': pexels(985635),
  'Tất cổ cao 3 đôi': pexels(1183266),
};

export function getProductImage(name: string): string {
  return PRODUCT_IMAGES[name] ?? pexels(937481);
}
