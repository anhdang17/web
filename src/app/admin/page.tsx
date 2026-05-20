'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/fetcher';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

type Tab = 'products' | 'orders' | 'users';

interface AdminOrder {
  id: string;
  status: string;
  total: number;
  user: { name: string };
  createdAt: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  _count: { orders: number };
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'AO',
    gender: 'UNISEX',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
    stock: '100',
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push('/login?redirect=/admin');
      else if (user.role !== 'ADMIN') router.push('/');
    }
  }, [user, authLoading, router]);

  const loadProducts = () =>
    api<{ products: Product[] }>('/api/products?limit=50').then((d) => setProducts(d.products));

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadProducts();
      api<AdminOrder[]>('/api/admin/orders').then(setOrders);
      api<AdminUser[]>('/api/admin/users').then(setUsers);
    }
  }, [user]);

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await api('/api/products', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        description: form.description || form.name,
      }),
    });
    setShowForm(false);
    loadProducts();
  };

  const deleteProduct = async (slug: string) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    await api(`/api/products/${slug}`, { method: 'DELETE' });
    loadProducts();
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await api('/api/admin/orders', {
      method: 'PUT',
      body: JSON.stringify({ orderId, status }),
    });
    const data = await api<AdminOrder[]>('/api/admin/orders');
    setOrders(data);
  };

  if (authLoading || !user || user.role !== 'ADMIN') {
    return <div className="p-16 text-center">Đang tải...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <h1 className="text-2xl font-black mb-6">QUẢN TRỊ</h1>

      <div className="flex gap-4 border-b mb-8">
        {(['products', 'orders', 'users'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 text-sm font-bold tracking-wide ${tab === t ? 'border-b-2 border-black' : 'text-brand-gray'}`}
          >
            {t === 'products' ? 'SẢN PHẨM' : t === 'orders' ? 'ĐƠN HÀNG' : 'KHÁCH HÀNG'}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mb-6 bg-brand-red text-white px-6 py-2 text-sm font-bold"
          >
            + THÊM SẢN PHẨM
          </button>
          {showForm && (
            <form onSubmit={addProduct} className="border p-4 mb-8 grid grid-cols-2 gap-4">
              <input placeholder="Tên" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border px-3 py-2 text-sm col-span-2" />
              <input placeholder="Giá" required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border px-3 py-2 text-sm" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border px-3 py-2 text-sm">
                <option value="AO">Áo</option>
                <option value="QUAN">Quần</option>
                <option value="VAY">Váy</option>
                <option value="AO_KHOAC">Áo khoác</option>
                <option value="GIAY">Giày</option>
                <option value="PHU_KIEN">Phụ kiện</option>
              </select>
              <input placeholder="URL ảnh" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="border px-3 py-2 text-sm col-span-2" />
              <button type="submit" className="bg-black text-white py-2 text-sm font-bold col-span-2">LƯU</button>
            </form>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Ảnh</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Kho</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="py-2">
                      <div className="relative w-10 h-10">
                        <Image src={p.image} alt="" fill className="object-cover" />
                      </div>
                    </td>
                    <td>{p.name}</td>
                    <td>{formatPrice(p.price)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button onClick={() => deleteProduct(p.slug)} className="text-brand-red text-xs font-bold">
                        XÓA
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="border p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">#{o.id.slice(-8)} — {o.user.name}</p>
                <p className="text-xs text-brand-gray">{formatPrice(o.total)} · {new Date(o.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
              <select
                value={o.status}
                onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                className="border text-sm px-2 py-1"
              >
                <option value="PENDING">Chờ xác nhận</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="SHIPPING">Đang giao</option>
                <option value="DELIVERED">Đã giao</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Tên</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Vai trò</th>
                <th>Đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="py-2">{u.name}</td>
                  <td>{u.email || '—'}</td>
                  <td>{u.phone || '—'}</td>
                  <td>{u.role}</td>
                  <td>{u._count.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
