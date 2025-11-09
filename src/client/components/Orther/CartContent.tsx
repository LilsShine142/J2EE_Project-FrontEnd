import React, { useState, useEffect, type JSX } from 'react';
import CartTable from './CartTable';

interface CartItem {
  mealID: number;
  image: string;
  name: string;
  price: string;
  description?: string;
  slug: string;
  quantity: number;
  addedAt: string;
}

interface CartContentProps {
  onContinueShopping: () => void;
  onCheckout: () => void;
}

// === SUB-COMPONENTS ===
const DeleteButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-gray-400 hover:text-red-600 transition-colors duration-200"
    title="Xóa món"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

const QuantityControl: React.FC<{
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}> = ({ quantity, onIncrease, onDecrease }) => (
  <div className="flex items-center justify-center gap-2 select-none">
    <button
      onClick={onDecrease}
      className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={quantity <= 1}
    >
      −
    </button>
    <span className="w-12 text-center font-medium">{quantity}</span>
    <button
      onClick={onIncrease}
      className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100 rounded transition-colors"
    >
      +
    </button>
  </div>
);

const CartContent: React.FC<CartContentProps> = ({ onContinueShopping, onCheckout }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');

  // === 1. LẤY DỮ LIỆU TỪ sessionStorage ===
  useEffect(() => {
    const loadCart = () => {
      try {
        const stored = sessionStorage.getItem('cart');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          }
        }
      } catch (err) {
        console.error('Lỗi đọc giỏ hàng:', err);
        setCartItems([]);
      }
    };

    loadCart();

    const handleUpdate = () => loadCart();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('cartUpdated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('cartUpdated', handleUpdate);
    };
  }, []);

  // === 2. CẬP NHẬT sessionStorage ===
  const updateSessionCart = (items: CartItem[]) => {
    if (items.length > 0) {
      sessionStorage.setItem('cart', JSON.stringify(items));
    } else {
      sessionStorage.removeItem('cart');
    }
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // === 3. XỬ LÝ XÓA & SỐ LƯỢNG ===
  const removeItem = (mealID: number) => {
    const newItems = cartItems.filter((item) => item.mealID !== mealID);
    setCartItems(newItems);
    updateSessionCart(newItems);
    alert('Đã xóa món khỏi giỏ hàng!');
  };

  const updateQuantity = (mealID: number, delta: number) => {
    const newItems = cartItems.map((item) => {
      if (item.mealID === mealID) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty < 1 ? 1 : newQty };
      }
      return item;
    });
    setCartItems(newItems);
    updateSessionCart(newItems);
  };

  // === 4. TÍNH TOÁN ===
  const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(/[^0-9.-]+/g, '')) || 0;
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + parsePrice(item.price) * item.quantity;
  }, 0);

  const prepayment = Math.round(subtotal * 0.3); // 30%
  const remaining = subtotal - prepayment;

  // === 5. CẤU HÌNH BẢNG ===
  const TABLE_COLUMNS = [
    { key: 'delete', label: '', align: 'left' as const },
    { key: 'image', label: 'Hình', align: 'left' as const },
    { key: 'name', label: 'Tên món', align: 'left' as const },
    { key: 'unitPrice', label: 'Giá', align: 'center' as const },
    { key: 'quantity', label: 'SL', align: 'center' as const },
    { key: 'subtotal', label: 'Thành tiền', align: 'right' as const },
  ];

  // === 6. RENDER CELL ===
  const renderCell = (item: CartItem, columnKey: string): JSX.Element => {
    const cellStyles = {
      default: 'py-5 px-3',
      center: 'py-5 px-3 text-center',
      right: 'py-5 px-3 text-right',
    };

    const price = parsePrice(item.price);
    const subtotalItem = price * item.quantity;

    const cells: Record<string, JSX.Element> = {
      delete: (
        <td className={cellStyles.default}>
          <DeleteButton onClick={() => removeItem(item.mealID)} />
        </td>
      ),
      image: (
        <td className={cellStyles.default}>
          <img
            src={item.image}
            alt={item.name}
            className="w-14 h-14 object-cover rounded-md shadow-sm"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/56?text=No+Image';
            }}
          />
        </td>
      ),
      name: (
        <td className={cellStyles.default}>
          <div>
            <p className="font-medium text-gray-900">{item.name}</p>
            {item.description && (
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            )}
          </div>
        </td>
      ),
      unitPrice: (
        <td className={cellStyles.center}>
          <span className="font-semibold text-amber-600">
            {item.price.includes('$')
              ? item.price
              : `${parseInt(item.price).toLocaleString()}₫`}
          </span>
        </td>
      ),
      quantity: (
        <td className={cellStyles.center}>
          <QuantityControl
            quantity={item.quantity}
            onIncrease={() => updateQuantity(item.mealID, 1)}
            onDecrease={() => updateQuantity(item.mealID, -1)}
          />
        </td>
      ),
      subtotal: (
        <td className={cellStyles.right}>
          <span className="font-semibold text-gray-900">
            {subtotalItem.toLocaleString()}₫
          </span>
        </td>
      ),
    };

    return cells[columnKey] || <td className={cellStyles.default}></td>;
  };

  // === 7. RENDER KHI TRỐNG ===
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Giỏ hàng trống</h3>
        <p className="text-gray-600 mb-6">Bạn chưa chọn món nào để đặt bàn.</p>
        <button
          onClick={onContinueShopping}
          className="px-8 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
        >
          Chọn món ngay
        </button>
      </div>
    );
  }

  // === 8. RENDER CHÍNH ===
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng đặt bàn</h2>

      {/* Bảng giỏ hàng */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-10">
        <CartTable
          columns={TABLE_COLUMNS}
          data={cartItems}
          renderCell={renderCell}
          keyExtractor={(item) => item.mealID}
        />
      </div>

      {/* Phần dưới */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mã khuyến mãi */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Mã khuyến mãi</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Nhập mã tại quán"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button className="px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap">
              Áp dụng
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Chỉ áp dụng khi dùng tại quán</p>
        </div>

        {/* Tổng thanh toán - 30% */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Tổng thanh toán</h3>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg text-gray-700">Tạm tính</span>
              <span className="text-lg font-medium text-gray-900">
                {subtotal.toLocaleString()}₫
              </span>
            </div>

            <div className="flex justify-between items-center mb-4 p-3 bg-amber-100 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-amber-800">
                  Thanh toán trước (30%)
                </span>
                <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-full">Bắt buộc</span>
              </div>
              <span className="text-xl font-bold text-amber-700">
                {prepayment.toLocaleString()}₫
              </span>
            </div>

            <div className="pt-4 border-t-2 border-dashed border-amber-300">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">Tổng cộng</span>
                <span className="text-3xl font-bold text-amber-600">
                  {subtotal.toLocaleString()}₫
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Còn lại <strong>{remaining.toLocaleString()}₫</strong> thanh toán tại quán
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={onContinueShopping}
              className="flex-1 px-6 py-3 border-2 border-amber-600 text-amber-600 hover:bg-amber-50 font-semibold rounded-lg transition-colors"
            >
              Chọn món thêm
            </button>
            <button
              onClick={onCheckout}
              className="flex-1 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Thanh toán trước
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartContent;