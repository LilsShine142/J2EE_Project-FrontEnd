import React, { useState, useEffect, type JSX } from 'react';
import CartTable from './CartTable';
import { Button, message, Modal } from 'antd';
import Cookies from 'js-cookie';

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
  currentBooking: any;
  onContinueShopping: () => void;
  onCheckout: () => void;
  onRequireBooking: () => void;
  onOpenMealSelection: () => void;
  onCancelBooking: () => void;
  isCancelling?: boolean;
}

const DeleteButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="text-gray-400 hover:text-red-600 transition-colors" title="Xóa món">
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
      className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
      disabled={quantity <= 1}
    >−</button>
    <span className="w-12 text-center font-medium">{quantity}</span>
    <button
      onClick={onIncrease}
      className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100 rounded transition-colors"
    >+</button>
  </div>
);

const CartContent: React.FC<CartContentProps> = ({
  currentBooking,
  onContinueShopping,
  onCheckout,
  onRequireBooking,
  onOpenMealSelection,
  onCancelBooking,
  isCancelling = false,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  // Lấy thông tin user từ cookies
  const userCookie = Cookies.get('user');
  let user = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch (e) {
      console.error('Error parsing user cookie:', e);
    }
  }
  const isLoggedIn = user && user.userId;

  // === LẤY GIỎ HÀNG ===
  useEffect(() => {
    const loadCart = () => {
      const stored = sessionStorage.getItem('cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setCartItems(parsed);
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

  const updateSessionCart = (items: CartItem[]) => {
    if (items.length > 0) {
      sessionStorage.setItem('cart', JSON.stringify(items));
    } else {
      sessionStorage.removeItem('cart');
    }
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (mealID: number) => {
    const newItems = cartItems.filter(i => i.mealID !== mealID);
    setCartItems(newItems);
    updateSessionCart(newItems);
    message.success('Đã xóa món!');
  };

  const updateQuantity = (mealID: number, delta: number) => {
    const newItems = cartItems.map(i => {
      if (i.mealID === mealID) {
        const newQty = i.quantity + delta;
        return { ...i, quantity: newQty < 1 ? 1 : newQty };
      }
      return i;
    });
    setCartItems(newItems);
    updateSessionCart(newItems);
  };

  const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(/[^0-9.-]+/g, '')) || 0;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
  const prepayment = Math.round(subtotal * 0.3);
  const remaining = subtotal - prepayment;

  const TABLE_COLUMNS = [
    { key: 'delete', label: '', align: 'left' as const },
    { key: 'image', label: 'Hình', align: 'left' as const },
    { key: 'name', label: 'Tên món', align: 'left' as const },
    { key: 'unitPrice', label: 'Giá', align: 'center' as const },
    { key: 'quantity', label: 'SL', align: 'center' as const },
    { key: 'subtotal', label: 'Thành tiền', align: 'right' as const },
  ];

  const renderCell = (item: CartItem, columnKey: string): JSX.Element => {
    const price = parsePrice(item.price);
    const subtotalItem = price * item.quantity;

    const cells: Record<string, JSX.Element> = {
      delete: <td className="py-5 px-3"><DeleteButton onClick={() => removeItem(item.mealID)} /></td>,
      image: <td className="py-5 px-3"><img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-md" onError={e => e.currentTarget.src = 'https://via.placeholder.com/56?text=No+Image'} /></td>,
      name: <td className="py-5 px-3"><div><p className="font-medium">{item.name}</p>{item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}</div></td>,
      unitPrice: <td className="py-5 px-3 text-center"><span className="font-semibold text-amber-600">{item.price.includes('$') ? item.price : `${parseInt(item.price).toLocaleString()}₫`}</span></td>,
      quantity: <td className="py-5 px-3 text-center"><QuantityControl quantity={item.quantity} onIncrease={() => updateQuantity(item.mealID, 1)} onDecrease={() => updateQuantity(item.mealID, -1)} /></td>,
      subtotal: <td className="py-5 px-3 text-right"><span className="font-semibold">{subtotalItem.toLocaleString()}₫</span></td>,
    };
    return cells[columnKey] || <td></td>;
  };

  // === COMPONENT: THÔNG TIN ĐẶT BÀN + NÚT HỦY ===
  const BookingInfoCard: React.FC<{ variant?: 'success' | 'warning' }> = ({ variant = 'warning' }) => {
    const colorClasses = variant === 'success' 
      ? 'from-green-50 to-emerald-50 border-green-200'
      : 'from-amber-50 to-orange-50 border-amber-200';
    
    const titleColor = variant === 'success' ? 'text-green-900' : 'text-amber-900';

    return (
      <div className={`bg-gradient-to-r ${colorClasses} p-6 rounded-xl mb-8 border`}>
        <div className="flex justify-between items-start mb-3">
          <h3 className={`text-lg font-semibold ${titleColor}`}>Thông tin đặt bàn</h3>
          <Button
            danger
            size="middle"
            onClick={onCancelBooking}
            loading={isCancelling}
            className="hover:scale-105 transition-transform"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
          >
            Hủy đặt bàn
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div><strong>Bàn:</strong> {currentBooking.tableName || 'Bàn 1'}</div>
          <div><strong>Thời gian:</strong> {currentBooking.bookingDate.split('T')[0]} - {currentBooking.startTime.split('T')[1].slice(0,5)}</div>
          <div><strong>Số khách:</strong> {currentBooking.numberOfGuests} người</div>
        </div>
        
        {variant === 'success' && (
          <p className="text-sm text-green-700 mt-3">
            Vui lòng đến quầy để gọi món hoặc bấm nút bên dưới để chọn trước.
          </p>
        )}
      </div>
    );
  };

  const handleBookingClick = async () => {
    setIsBookingLoading(true);
    try {
      await onRequireBooking();
    } finally {
      setIsBookingLoading(false);
    }
  };

  // === 1. CHƯA ĐĂNG NHẬP → CHỈ HIỆN NÚT ĐẶT BÀN ===
  if (!isLoggedIn) {
    return (
      <div className="mx-auto px-4 py-20 text-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Chưa đăng nhập</h3>
        <p className="text-gray-600 mb-6">Vui lòng đăng nhập để đặt bàn và gọi món.</p>
        {/* <button
          onClick={handleBookingClick}
          disabled={isBookingLoading}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isBookingLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Loading...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
              </svg>
              ĐẶT BÀN NGAY
            </>
          )}
        </button> */}
      </div>
    );
  }

  // === 2. CHƯA ĐẶT BÀN → BẮT BUỘC ĐẶT ===
  if (!currentBooking) {
    return (
      <div className="mx-auto px-4 py-20 text-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Chưa đặt bàn</h3>
        <p className="text-gray-600 mb-6">Vui lòng đặt bàn trước khi chọn món.</p>
        {/* <button
          onClick={handleBookingClick}
          disabled={isBookingLoading}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isBookingLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Loading...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
              </svg>
              ĐẶT BÀN NGAY
            </>
          )}
        </button> */}
      </div>
    );
  }

  // === 3. ĐÃ ĐẶT BÀN NHƯNG CHƯA GỌI MÓN → NÚT "GỌI MÓN" ===
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Đặt bàn thành công!</h2>

        <BookingInfoCard variant="success" />

        {/* === NÚT GỌI MÓN === */}
        <div className="text-center">
          <Button
            type="primary"
            size="large"
            onClick={onOpenMealSelection}
            className="bg-amber-600 hover:bg-amber-700 h-12 px-8 text-lg font-semibold"
          >
            Gọi món ngay
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            Bạn có thể gọi món tại quán hoặc chọn trước ở đây.
          </p>
        </div>
      </div>
    );
  }

  // === 4. ĐÃ GỌI MÓN → THANH TOÁN TRƯỚC 30% ===
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng đặt bàn</h2>

      <BookingInfoCard variant="warning" />

      {/* === BẢNG GIỎ HÀNG === */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-10">
        <CartTable columns={TABLE_COLUMNS} data={cartItems} renderCell={renderCell} keyExtractor={i => i.mealID} />
      </div>

      {/* === TỔNG + THANH TOÁN === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Mã khuyến mãi</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              placeholder="Nhập mã tại quán"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
            />
            <Button className="bg-amber-600 text-white hover:bg-amber-700">Áp dụng</Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Chỉ áp dụng khi dùng tại quán</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Tổng thanh toán</h3>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
            <div className="flex justify-between mb-3">
              <span className="text-lg text-gray-700">Tạm tính</span>
              <span className="text-lg font-medium">{subtotal.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between items-center mb-4 p-3 bg-amber-100 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-amber-800">Thanh toán trước (30%)</span>
                <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-full">Bắt buộc</span>
              </div>
              <span className="text-xl font-bold text-amber-700">{prepayment.toLocaleString()}₫</span>
            </div>
            <div className="pt-4 border-t-2 border-dashed border-amber-300">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">Tổng cộng</span>
                <span className="text-3xl font-bold text-amber-600">{subtotal.toLocaleString()}₫</span>
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