# UNISEX Fashion Store

Website thương mại điện tử bán thời trang & phụ kiện unisex — Full-stack (Frontend + Backend + Database).

Giao diện lấy cảm hứng từ **Uniqlo UT**: tối giản, trắng-đen-đỏ, carousel sản phẩm ngang.

## Công nghệ

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | Next.js API Routes (REST) |
| Database | **SQLite** + Prisma ORM (tối ưu MacBook Air M2 — không cần cài server DB) |

## Chức năng

### Khách hàng (USER)
- Đăng ký / đăng nhập / đăng xuất (email Gmail hoặc số điện thoại)
- Tìm kiếm & lọc sản phẩm (danh mục, giới tính, giá, sắp xếp)
- Nút danh mục: Áo, Quần, Váy, Áo khoác, Giày, Phụ kiện
- Giỏ hàng, thanh toán, nhập địa chỉ giao hàng
- Đánh giá sản phẩm (1–5 sao)
- Xem lịch sử đơn hàng, cập nhật tài khoản

### Quản trị (ADMIN)
- Thêm / xóa sản phẩm
- Quản lý trạng thái đơn hàng
- Xem danh sách khách hàng đăng ký

## Cài đặt trên MacBook Air M2

### Yêu cầu
- Node.js 18+ ([tải tại nodejs.org](https://nodejs.org))

### Các bước

```bash
# 1. Vào thư mục project
cd "/Users/mac/Desktop/github push/web"

# 2. Cài dependencies
npm install

# 3. Tạo database & seed 50 sản phẩm
npm run db:setup

# 4. Chạy website
npm run dev
```

Mở trình duyệt: **http://localhost:3000**

## Tài khoản demo

| Vai trò | Đăng nhập | Mật khẩu |
|---------|-----------|----------|
| Khách hàng | `user@gmail.com` hoặc `0901234567` | `user123` |
| Admin | `admin@unisex.vn` | `admin123` |

## Cấu trúc thư mục

```
web/
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.ts          # 50 sản phẩm + tài khoản demo
│   └── dev.db           # SQLite file (tự tạo sau db:setup)
├── src/
│   ├── app/             # Pages + API routes
│   ├── components/      # UI components
│   ├── context/         # Auth context
│   └── lib/             # Prisma, auth, utils
└── package.json
```

## API chính

- `POST /api/auth/register` — Đăng ký
- `POST /api/auth/login` — Đăng nhập
- `POST /api/auth/logout` — Đăng xuất
- `GET /api/products?q=&category=&gender=` — Danh sách + lọc
- `POST /api/cart` — Thêm giỏ hàng
- `POST /api/orders` — Đặt hàng
- `POST /api/reviews` — Đánh giá
- `POST /api/products` — Thêm SP (admin)
- `DELETE /api/products/[slug]` — Xóa SP (admin)

## Database

SQLite lưu tại `prisma/dev.db` — một file duy nhất, đọc/ghi rất nhanh trên SSD Mac M2. Phù hợp phát triển local và demo đồ án.

Để reset dữ liệu:

```bash
rm -f prisma/dev.db && npm run db:setup
```

## Ghi chú đồ án

- Ảnh sản phẩm dùng [Unsplash](https://unsplash.com) (miễn phí, cần internet khi xem ảnh).
- Đăng ký bằng email hoặc SĐT — dữ liệu lưu bảng `User` trong SQLite.
- JWT + cookie httpOnly cho phiên đăng nhập.
