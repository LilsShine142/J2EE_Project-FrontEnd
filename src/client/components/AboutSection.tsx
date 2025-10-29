import { Carousel, message } from 'antd';
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from './Button/ButtonCustom'; 

// Định nghĩa interface cho các ảnh trong banner
interface BannerImage {
  src: string;
  alt: string;
  caption?: string;
}

// Danh sách ảnh mẫu cho banner (bạn có thể thay bằng URL ảnh thực tế)
const bannerImages: BannerImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    alt: 'Nhà hàng sang trọng',
    caption: 'Thưởng thức ẩm thực đỉnh cao',
  },
  {
    src: 'https://images.unsplash.com/photo-1552566626-52f8b828add9',
    alt: 'Món ăn tinh tế',
    caption: 'Trải nghiệm hương vị độc đáo',
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
    alt: 'Không gian ấm cúng',
    caption: 'Không gian hoàn hảo cho mọi dịp',
  },
];

const AboutSection: React.FC = () => {
  // Hàm xử lý khi đặt bàn
  const handleBookingClick = () => {
    message.info('Chuyển hướng đến form đặt bàn...');
    // Thêm logic chuyển hướng hoặc mở modal form đặt bàn tại đây
  };

  return (
    <section className="relative w-full h-[90vh] mx-auto bg-gray-900 overflow-hidden">
      {/* Carousel Banner */}
      <Carousel
        autoplay
        autoplaySpeed={4000} // 4 giây
        effect="fade"
        dots={{ className: 'custom-carousel-dots' }}
        className="w-full h-full"
      >
        {bannerImages.map((image, index) => (
          <div key={index} className="relative w-full h-[90vh]">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover object-center"
            />
            {/* Overlay để làm mờ và tăng độ tương phản */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            {/* Caption và nút CTA */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                {image.caption}
              </h1>
              <p className="text-lg md:text-xl mb-6 max-w-2xl">
                Khám phá trải nghiệm ẩm thực tuyệt vời tại nhà hàng của chúng tôi. Đặt bàn ngay hôm nay!
              </p>
              <Button
                onClick={handleBookingClick}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Đặt Bàn Ngay
              </Button>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default AboutSection;