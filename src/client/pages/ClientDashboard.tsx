import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import Cookies from 'js-cookie';
import { ScrollReveal } from '../../components/ScrollReveal/ScrollReveal';
import Header from '../components/Header';
import AboutSection from '../components/AboutSection';
import MenuSection from '../components/MenuSection';
import PopularDishesSection from '../components/PopularDishesSection';
import IntroductionSection from '../components/IntroductionSection';
import PromoBanner from '../components/PromoBanner';
import Footer from '../components/Footer';
import { getPaymentByTxnRef, type VNPayParams } from '../../service/paymentService';

const ClientDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hasProcessedPayment, setHasProcessedPayment] = useState(false);
  const token = Cookies.get('authToken') || null;

  // Reset scroll lock khi vào trang
  useEffect(() => {
    const resetScroll = () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };

    resetScroll();
    return resetScroll;
  }, []);

  // Xử lý VNPAY callback khi có tham số trong URL
  useEffect(() => {
    const processVNPayCallback = async () => {
      // Kiểm tra nếu đã xử lý rồi thì bỏ qua
      if (hasProcessedPayment) return;

      // Kiểm tra các tham số VNPAY trong URL
      const vnpTxnRef = searchParams.get('vnp_TxnRef');
      const vnpResponseCode = searchParams.get('vnp_ResponseCode');
      const vnpTransactionStatus = searchParams.get('vnp_TransactionStatus');

      // Nếu có tham số VNPAY, xử lý thanh toán
      if (vnpTxnRef && vnpResponseCode && vnpTransactionStatus) {
        try {
          setHasProcessedPayment(true);

          // Gọi API để lấy thông tin thanh toán
          const paymentResult = await getPaymentByTxnRef(vnpTxnRef);

          // Xóa các tham số VNPAY khỏi URL
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('vnp_TxnRef');
          newSearchParams.delete('vnp_ResponseCode');
          newSearchParams.delete('vnp_TransactionStatus');
          newSearchParams.delete('vnp_TransactionNo');
          newSearchParams.delete('vnp_Amount');
          newSearchParams.delete('vnp_OrderInfo');
          newSearchParams.delete('vnp_PayDate');
          newSearchParams.delete('vnp_BankCode');
          newSearchParams.delete('vnp_BankTranNo');
          newSearchParams.delete('vnp_CardType');
          newSearchParams.delete('vnp_TmnCode');
          newSearchParams.delete('vnp_SecureHash');

          // Cập nhật URL mà không reload trang
          if (newSearchParams.toString()) {
            navigate(`${window.location.pathname}?${newSearchParams.toString()}`, { replace: true });
          } else {
            navigate(window.location.pathname, { replace: true });
          }

          // Hiển thị thông báo dựa trên kết quả thanh toán
          if (paymentResult.success && vnpResponseCode === '00' && vnpTransactionStatus === '00') {
            message.success({
              content: (
                <div>
                  <div className="font-semibold text-lg mb-2">🎉 Thanh toán thành công!</div>
                  <div className="text-sm">
                    <p>Mã hóa đơn: #{paymentResult.data.billID}</p>
                    <p>Số tiền: {paymentResult.data.initialPayment.toLocaleString()}₫</p>
                    <p>Mã giao dịch: {paymentResult.data.transactionNo}</p>
                    {paymentResult.data.remainingAmount > 0 && (
                      <p className="text-amber-600">
                        Còn lại: {paymentResult.data.remainingAmount.toLocaleString()}₫ (thanh toán tại quán)
                      </p>
                    )}
                  </div>
                </div>
              ),
              duration: 8,
              style: { marginTop: '20px' }
            });

            // Clear cart và currentBooking sau thanh toán thành công
            sessionStorage.removeItem('cart');
            localStorage.removeItem('currentBooking');
          } else {
            message.error({
              content: (
                <div>
                  <div className="font-semibold text-lg mb-2">❌ Thanh toán thất bại</div>
                  <div className="text-sm">
                    <p>{paymentResult.message || 'Có lỗi xảy ra trong quá trình thanh toán'}</p>
                    <p>Vui lòng thử lại hoặc liên hệ hỗ trợ</p>
                  </div>
                </div>
              ),
              duration: 6,
              style: { marginTop: '20px' }
            });
          }

        } catch (error: any) {
          console.error('Error processing VNPAY callback:', error);
          message.error({
            content: 'Không thể xác nhận kết quả thanh toán. Vui lòng kiểm tra lại.',
            duration: 5,
            style: { marginTop: '20px' }
          });
        }
      }
    };

    processVNPayCallback();
  }, [searchParams, hasProcessedPayment, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      {/* HEADER */}
      <Header />

      <main className="w-full" id="home">
        {/* HOME SECTION – BẮT BUỘC CÓ CHIỀU CAO */}
        {/* <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-red-50 px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to <span className="text-amber-600">Tastyes</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Experience the finest cuisine in town
            </p>
            <button
              onClick={() => {
                const menu = document.getElementById('menu');
                if (menu) {
                  const headerOffset = 64;
                  const elementPosition = menu.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white text-lg font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explore Menu
            </button>
          </div>
        </section> */}

        {/* ABOUT SECTION */}
        <section id="about">
          <ScrollReveal animation="fade-scale" delay={0} duration={1000}>
            <AboutSection />
          </ScrollReveal>
        </section>

        {/* INTRODUCTION */}
        <section id="introduction">
          <ScrollReveal animation="fade-scale" delay={100} duration={900}>
            <IntroductionSection />
          </ScrollReveal>
        </section>

        {/* POPULAR DISHES */}
        <section id="popular">
          <ScrollReveal animation="scale" delay={0} duration={1000}>
            <PopularDishesSection token={token} />
          </ScrollReveal>
        </section>

        {/* PROMO BANNER */}
        <section id="promo">
          <ScrollReveal animation="fade-scale" delay={150} duration={1100}>
            <PromoBanner />
          </ScrollReveal>
        </section>

        {/* MENU SECTION */}
        <section id="menu">
          <ScrollReveal animation="fade-scale" delay={0} duration={1000}>
            <MenuSection token={token} />
          </ScrollReveal>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="footer">
        <ScrollReveal animation="fade-scale" duration={800}>
          <Footer />
        </ScrollReveal>
      </footer>
    </div>
  );
};

export default ClientDashboard;