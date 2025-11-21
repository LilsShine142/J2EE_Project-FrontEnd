import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CartContent from '../components/Orther/CartContent';
import Footer from '../components/Footer';
import Header from '../components/Header';
import BookingForm from '../components/BookingForm/BookingForm';
import MealSelection from '../components/BookingForm/MealSelection';
import { message, Modal, Button } from 'antd';
import { useBooking } from '../../hooks/useBookings';
import { getAuthToken } from '../../service/authService';

interface Meal {
  mealID: number;
  mealName: string;
  price: number;
  image?: string;
  description?: string;
  slug?: string;
  categoryName: string;
}

interface SelectedMeal {
  mealID: number;
  quantity: number;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const token = getAuthToken();
  const { useMyBookings, useCancel } = useBooking(token);
  const { data: bookingsData } = useMyBookings(0, 10, { enabled: !!token });
  const cancelMutation = useCancel();

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMealSelection, setShowMealSelection] = useState(false);
  const [tempMeals, setTempMeals] = useState<SelectedMeal[]>([]);
  const [allMeals, setAllMeals] = useState<Meal[]>([]);

  const currentBooking = useMemo(() => {
    if (!bookingsData?.content) return null;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
    return bookingsData.content.find(booking => 
      (booking.statusId === 3 || booking.statusId === 4) && 
      new Date(booking.startTime) > today &&
      new Date(booking.endTime) > today
    ) || null;
  }, [bookingsData]);

  console.log('Current Booking:', currentBooking);

  // === 2. ĐẶT BÀN THÀNH CÔNG ===
  const handleBookingSuccess = (hasMeals: boolean = false) => {
    if (hasMeals) {
      window.dispatchEvent(new Event('cartUpdated'));
      setShowMealSelection(true);
    } else {
      message.success('Đặt bàn thành công! Bạn có thể gọi món tại quán hoặc chọn trước.');
    }
    setShowBookingModal(false);
  };

  // === 3. MỞ MODAL CHỌN MÓN ===
  const handleOpenMealSelection = () => {
    if (!currentBooking) {
      message.warning('Vui lòng đặt bàn trước!');
      setShowBookingModal(true);
      return;
    }

    const cart = sessionStorage.getItem('cart');
    if (cart) {
      try {
        const items = JSON.parse(cart);
        setTempMeals(items.map((i: any) => ({ mealID: i.mealID, quantity: i.quantity })));
      } catch {
        setTempMeals([]);
      }
    } else {
      setTempMeals([]);
    }

    setShowMealSelection(true);
  };

  // === 4. NHẬN DỮ LIỆU MÓN TỪ MealSelection ===
  const handleMealsData = (meals: Meal[]) => {
    setAllMeals(meals);
  };

  // === 5. XÁC NHẬN ===
  const handleConfirmMeals = () => {
    const validMeals = tempMeals.filter(m => m.quantity > 0);
    if (validMeals.length === 0) {
      sessionStorage.removeItem('cart');
      message.info('Bạn chưa chọn món nào.');
      setShowMealSelection(false);
      return;
    }

    const cart = validMeals.map(m => {
      const meal = allMeals.find(meal => meal.mealID === m.mealID);
      if (!meal) {
        return null;
      }
      return {
        mealID: meal.mealID,
        name: meal.mealName,
        price: meal.price.toString(),
        image: meal.image || '/placeholder.jpg',
        description: meal.description || '',
        slug: meal.slug,
        quantity: m.quantity,
        addedAt: new Date().toISOString(),
      };
    }).filter(Boolean);

    sessionStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    message.success(`Đã lưu ${validMeals.reduce((s, m) => s + m.quantity, 0)} món!`);
    setShowMealSelection(false);
  };

  // === 6. HỦY CHỌN MÓN ===
  const handleCancelMeals = () => {
    setTempMeals([]);
    setShowMealSelection(false);
  };

  // === 7. HỦY ĐẶT BÀN ===
  const handleCancelBooking = () => {
    console.log('Attempting to cancel booking:', currentBooking);
    if (!currentBooking || !currentBooking.bookingID) {
      message.error('Không tìm thấy thông tin đặt bàn');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận hủy đặt bàn',
      content: 'Bạn có chắc chắn muốn hủy đặt bàn này không? Hành động này không thể hoàn tác.',
      okText: 'Xác nhận hủy',
      cancelText: 'Không',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await cancelMutation.mutateAsync(currentBooking.bookingID);
          
          // Xóa giỏ hàng
          sessionStorage.removeItem('cart');
          
          // Trigger cập nhật giỏ hàng
          window.dispatchEvent(new Event('cartUpdated'));
          
          message.success('Đã hủy đặt bàn thành công!');
          
          // Chuyển về trang dashboard sau 1.5s
          setTimeout(() => {
            navigate('/client/dashboard');
          }, 1500);
        } catch (error: any) {
          message.error(error.message || 'Hủy đặt bàn thất bại');
        }
      },
    });
  };

  // === 8. TIẾP TỤC MUA SẮM ===
  const handleContinueShopping = () => {
    navigate('/client/dashboard');
  };

  // === 9. THANH TOÁN ===
  const handleCheckout = () => {
    if (!currentBooking) {
      setShowBookingModal(true);
      return;
    }

    const cart = sessionStorage.getItem('cart');
    if (!cart || JSON.parse(cart).length === 0) {
      message.warning('Vui lòng chọn món trước khi thanh toán!');
      setShowMealSelection(true);
      return;
    }

    navigate('/client/checkout');
  };

  const breadcrumbs = [
    { label: 'Home', href: '/client/dashboard' },
    { label: 'Cart', active: true }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection title="Giỏ hàng & Đặt bàn" breadcrumbs={breadcrumbs} />

      <CartContent
        currentBooking={currentBooking}
        onContinueShopping={handleContinueShopping}
        onCheckout={handleCheckout}
        onRequireBooking={() => setShowBookingModal(true)}
        onOpenMealSelection={handleOpenMealSelection}
        onCancelBooking={handleCancelBooking}
        isCancelling={cancelMutation.isPending}
      />

      <BookingForm
        visible={showBookingModal}
        onCancel={() => {
          setShowBookingModal(false);
          if (!currentBooking) navigate('/client/dashboard');
        }}
        onSuccess={handleBookingSuccess}
      />

      {/* === MODAL CHỌN MÓN === */}
      <Modal
        title={<span className="text-xl font-bold text-amber-600">Chọn món ăn</span>}
        open={showMealSelection}
        onCancel={handleCancelMeals}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        <MealSelection
          onMealsSelected={setTempMeals}
          onMealsData={handleMealsData}
          initialMeals={tempMeals}
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button
            size="large"
            onClick={handleCancelMeals}
            className="booking-cancel-btn min-w-32 h-11 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:border-gray-400"
          >
            Huỷ bỏ
          </Button>

          <Button
            size="large"
            type="primary"
            onClick={handleConfirmMeals}
            className="booking-confirm-btn min-w-32 h-11 px-7 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl transition-all duration-300 hover:from-orange-600 hover:to-amber-600 hover:scale-105 hover:shadow-lg"
            style={{ minWidth: '128px' }}
          >
            Xác nhận
          </Button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default CartPage;