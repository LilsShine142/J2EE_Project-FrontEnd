// import React from 'react';
// import { Row, Col, Card, Typography, Button } from 'antd';
// import { ArrowRightOutlined } from '@ant-design/icons';

// const { Title, Paragraph } = Typography;

// const MenuSection: React.FC = () => {
//   const menuItems = [
//     {
//       image: 'https://via.placeholder.com/300x200?text=Nuc+Cam',
//       name: 'Nức cam',
//       price: '50.000 đ',
//       description: 'Cam'
//     },
//     {
//       image: 'https://via.placeholder.com/300x200?text=Ca+Thu+Ran',
//       name: 'Cá thu rán',
//       price: '500.000 đ',
//       description: 'Cá thu'
//     },
//     {
//       image: 'https://via.placeholder.com/300x200?text=Salad+Ca+Chua',
//       name: 'Salad cá chua',
//       price: '200.000 đ',
//       description: 'Cá, Chua'
//     },
//     {
//       image: 'https://via.placeholder.com/300x200?text=Ga+Chien+Kieu+KFC',
//       name: 'Gà chiên kiểu KFC',
//       price: '150.000 đ',
//       description: 'Gà, Bột chiên'
//     },
//     {
//       image: 'https://via.placeholder.com/300x200?text=Trung+Op+La',
//       name: 'Trứng ốp la',
//       price: '80.000 đ',
//       description: 'Trứng, Rau'
//     },
//     {
//       image: 'https://via.placeholder.com/300x200?text=Nom+Dua+Chuot',
//       name: 'Nộm dưa chua',
//       price: '50.000 đ',
//       description: 'Dưa chua, Chanh'
//     },
//     {
//       image: 'https://via.placeholder.com/300x200?text=Nuong+Khoai',
//       name: 'Nướng khoai',
//       price: '80.000 đ',
//       description: 'Khoai tây'
//     },
//     {
//       image: 'https://via.placeholder.com/300x200?text=Bo+Nuong+Khoai+Tay',
//       name: 'Bò nướng khoai tây',
//       price: '180.000 đ',
//       description: 'Bò, Khoai tây'
//     }
//   ];

//   return (
//     <section className="py-20 bg-white">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//           <Title level={2} className="text-4xl font-bold mb-4">
//             <span className="text-gradient from-red-600 to-orange-600">Our Hot Dishes</span>
//           </Title>
//           <Paragraph className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Khám phá menu đa dạng của chúng tôi với những món ăn Ý cổ điển và sáng tạo
//           </Paragraph>
//         </div>

//         <Row gutter={[32, 32]}>
//           {menuItems.map((item, index) => (
//             <Col xs={24} sm={12} md={8} lg={6} key={index}>
//               <Card
//                 className="h-full hover-scale border-0 shadow-lg"
//                 cover={<img alt={item.name} src={item.image} className="h-48 object-cover rounded-t-xl" />}
//                 hoverable
//               >
//                 <Card.Meta
//                   title={<div className="font-bold text-gray-800">{item.name}</div>}
//                   description={
//                     <div>
//                       <p className="text-red-600 font-semibold mb-2">{item.price}</p>
//                       <p className="text-sm text-gray-600 mb-4">{item.description}</p>
//                       <Button
//                         type="link"
//                         size="small"
//                         icon={<ArrowRightOutlined />}
//                         className="p-0 text-red-600"
//                       >
//                         Thêm vào giỏ
//                       </Button>
//                     </div>
//                   }
//                 />
//               </Card>
//             </Col>
//           ))}
//         </Row>

//         {/* CTA Section */}
//         <div className="text-center mt-16">
//           <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-12 text-white">
//             <Title level={3} className="text-white mb-4">
//               Sẵn sàng đặt món?
//             </Title>
//             <Paragraph className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
//               Duyệt menu và đặt hàng trực tuyến ngay hôm nay để nhận ưu đãi đặc biệt.
//             </Paragraph>
//             <Button
//               size="large"
//               className="px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-red-600"
//             >
//               Xem toàn bộ menu
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default MenuSection;








// import React, { useState } from 'react';
// import { Card, Badge } from 'antd';
// import { StarFilled } from '@ant-design/icons';

// const MenuSection: React.FC = () => {
//   const [activeSlide, setActiveSlide] = useState(0);

//   const menuItems = [
//     {
//       image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
//       name: 'Beef Biriyani',
//       price: '$28',
//       rating: 5,
//       reviews: 37,
//       description: 'It is a long established fact that a reader will be distracted.'
//     },
//     {
//       image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
//       name: 'Thai Soup',
//       price: '$21',
//       rating: 5,
//       reviews: 54,
//       description: 'It is a long established fact that a reader will be distracted.'
//     },
//     {
//       image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
//       name: 'Beef Machal',
//       price: '$25',
//       rating: 4,
//       reviews: 20,
//       description: 'It is a long established fact that a reader will be distracted.'
//     },
//     {
//       image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
//       name: 'Beef Biriyani',
//       price: '$28',
//       rating: 5,
//       reviews: 37,
//       description: 'It is a long established fact that a reader will be distracted.'
//     },
//     {
//       image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
//       name: 'Thai Soup',
//       price: '$21',
//       rating: 5,
//       reviews: 54,
//       description: 'It is a long established fact that a reader will be distracted.'
//     },
//     {
//       image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
//       name: 'Beef Machal',
//       price: '$25',
//       rating: 4,
//       reviews: 20,
//       description: 'It is a long established fact that a reader will be distracted.'
//     }
//   ];

//   return (
//     <section className="relative py-20 px-4 bg-gray-900 overflow-hidden">
//       {/* Background Food Images */}
//       <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-30">
//         <img
//           src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80"
//           alt="Background food"
//           className="w-full h-full object-cover rounded-full blur-sm"
//         />
//       </div>
//       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-30">
//         <img
//           src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80"
//           alt="Background food"
//           className="w-full h-full object-cover rounded-full blur-sm"
//         />
//       </div>

//       <div className="max-w-7xl mx-auto relative z-10">
//         {/* Section Title */}
//         <div className="text-center mb-16">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="text-amber-600">
//               <path d="M2 8L8 2M8 2L14 8M8 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//               <path d="M26 8L32 2M32 2L38 8M32 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//             </svg>
//             <span className="text-amber-600 text-sm tracking-wider uppercase">Our Popular Item</span>
//             <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="text-amber-600">
//               <path d="M2 8L8 2M8 2L14 8M8 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//               <path d="M26 8L32 2M32 2L38 8M32 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//             </svg>
//           </div>
//           <h2 className="text-5xl font-serif font-bold text-white">
//             Restho Popular Item List
//           </h2>
//         </div>

//         {/* Menu Cards with Vertical Decorative Line */}
//         <div className="relative">
//           {/* Vertical Decorative Line */}
//           <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-64 hidden lg:block">
//             <div className="relative h-full">
//               <div className="absolute top-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-600 to-transparent"></div>
//               <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-600 rounded-full"></div>
//               <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-600 rounded-full"></div>
//               <div className="absolute top-3/4 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-600 rounded-full"></div>
//             </div>
//           </div>

//           {/* Cards Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:pl-16">
//             {menuItems.map((item, index) => (
//               <div
//                 key={index}
//                 className="group relative"
//               >
//                 <Card
//                   className="bg-gray-800 border-2 border-gray-700 hover:border-amber-600 transition-all duration-300 overflow-hidden"
//                   bodyStyle={{ padding: 0 }}
//                 >
//                   {/* Image with Price Badge */}
//                   <div className="relative overflow-hidden">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
//                     />
//                     <div className="absolute top-4 left-4">
//                       <div className="bg-white rounded-full px-4 py-2 shadow-lg">
//                         <span className="text-amber-600 font-bold text-lg">{item.price}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Content */}
//                   <div className="p-6">
//                     {/* Rating */}
//                     <div className="flex items-center gap-2 mb-3">
//                       {[...Array(5)].map((_, i) => (
//                         <StarFilled
//                           key={i}
//                           className={`text-sm ${
//                             i < item.rating ? 'text-amber-500' : 'text-gray-600'
//                           }`}
//                         />
//                       ))}
//                       <span className="text-gray-400 text-sm ml-2">Review({item.reviews})</span>
//                     </div>

//                     {/* Name */}
//                     <h3 className="text-white text-xl font-bold mb-3">{item.name}</h3>

//                     {/* Description */}
//                     <p className="text-gray-400 text-sm leading-relaxed">
//                       {item.description}
//                     </p>
//                   </div>
//                 </Card>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Pagination Dots */}
//         <div className="flex justify-center gap-2 mt-12">
//           {[0, 1, 2].map((index) => (
//             <button
//               key={index}
//               onClick={() => setActiveSlide(index)}
//               className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                 activeSlide === index
//                   ? 'bg-amber-600 w-8'
//                   : 'bg-gray-600 hover:bg-gray-500'
//               }`}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default MenuSection;

















// import React, { useState, useEffect } from 'react';
// import { Card } from 'antd';
// import { StarFilled } from '@ant-design/icons';

// const MenuSection: React.FC = () => {
//   const [activeSlide, setActiveSlide] = useState(0);

//   const menuItems = [
//     {
//       image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
//       name: 'Beef Biriyani',
//       price: '$28',
//       rating: 5,
//       reviews: 37,
//       description: 'It is a long established fact that a reader will be distracted.'
//     },
//     {
//       image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
//       name: 'Thai Soup',
//       price: '$21',
//       rating: 5,
//       reviews: 54,
//       description: 'It is a long established fact that a reader will be distracted.'
//     },
//     {
//       image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
//       name: 'Beef Machal',
//       price: '$25',
//       rating: 4,
//       reviews: 20,
//       description: 'It is a long established fact that a reader will be distracted.'
//     },
//     {
//       image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
//       name: 'Beef Biriyani',
//       price: '$28',
//       rating: 5,
//       reviews: 37,
//       description: 'It is a long established fact that a reader will be distracted.'
//     },
//     {
//       image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
//       name: 'Thai Soup',
//       price: '$21',
//       rating: 5,
//       reviews: 54,
//       description: 'It is a long established fact that a reader will be distracted.'
//     },
//     {
//       image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
//       name: 'Beef Machal',
//       price: '$25',
//       rating: 4,
//       reviews: 20,
//       description: 'It is a long established fact that a reader will be distracted.'
//     }
//   ];

//   // Tính số lượng slides dựa trên số lượng items (3 items mỗi slide)
//   const itemsPerSlide = 3;
//   const totalSlides = Math.ceil(menuItems.length / itemsPerSlide);

//   // Lấy items cho slide hiện tại
//   const getCurrentSlideItems = () => {
//     const startIndex = activeSlide * itemsPerSlide;
//     return menuItems.slice(startIndex, startIndex + itemsPerSlide);
//   };

//   // Tự động chuyển slide
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveSlide((prev) => (prev + 1) % totalSlides);
//     }, 5000); // Chuyển slide mỗi 5 giây

//     return () => clearInterval(interval);
//   }, [totalSlides]);

//   return (
//     <section className="relative py-20 px-4 bg-gray-900 overflow-hidden">
//       {/* Background Food Images */}
//       <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-30">
//         <img
//           src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80"
//           alt="Background food"
//           className="w-full h-full object-cover rounded-full blur-sm"
//         />
//       </div>
//       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-30">
//         <img
//           src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80"
//           alt="Background food"
//           className="w-full h-full object-cover rounded-full blur-sm"
//         />
//       </div>

//       <div className="max-w-7xl mx-auto relative z-10">
//         {/* Section Title */}
//         <div className="text-center mb-16">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="text-amber-600">
//               <path d="M2 8L8 2M8 2L14 8M8 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//               <path d="M26 8L32 2M32 2L38 8M32 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//             </svg>
//             <span className="text-amber-600 text-sm tracking-wider uppercase">Our Popular Item</span>
//             <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="text-amber-600">
//               <path d="M2 8L8 2M8 2L14 8M8 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//               <path d="M26 8L32 2M32 2L38 8M32 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//             </svg>
//           </div>
//           <h2 className="text-5xl font-serif font-bold text-white">
//             Restho Popular Item List
//           </h2>
//         </div>

//         {/* Menu Cards with Vertical Decorative Line */}
//         <div className="relative">
//           {/* Vertical Decorative Line */}
//           <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-64 hidden lg:block">
//             <div className="relative h-full">
//               <div className="absolute top-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-600 to-transparent"></div>
//               <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-600 rounded-full"></div>
//               <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-600 rounded-full"></div>
//               <div className="absolute top-3/4 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-600 rounded-full"></div>
//             </div>
//           </div>

//           {/* Cards Grid - Chỉ hiển thị 3 items mỗi slide */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:pl-16">
//             {getCurrentSlideItems().map((item, index) => (
//               <div
//                 key={index}
//                 className="group relative"
//               >
//                 <Card
//                   className="bg-gray-800 border-2 border-gray-700 hover:border-amber-600 transition-all duration-300 overflow-hidden"
//                   bodyStyle={{ padding: 0 }}
//                 >
//                   {/* Image with Price Badge */}
//                   <div className="relative overflow-hidden">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
//                     />
//                     <div className="absolute top-4 left-4">
//                       <div className="bg-white rounded-full px-4 py-2 shadow-lg">
//                         <span className="text-amber-600 font-bold text-lg">{item.price}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Content */}
//                   <div className="p-6">
//                     {/* Rating */}
//                     <div className="flex items-center gap-2 mb-3">
//                       {[...Array(5)].map((_, i) => (
//                         <StarFilled
//                           key={i}
//                           className={`text-sm ${
//                             i < item.rating ? 'text-amber-500' : 'text-gray-600'
//                           }`}
//                         />
//                       ))}
//                       <span className="text-gray-400 text-sm ml-2">Review({item.reviews})</span>
//                     </div>

//                     {/* Name */}
//                     <h3 className="text-white text-xl font-bold mb-3">{item.name}</h3>

//                     {/* Description */}
//                     <p className="text-gray-400 text-sm leading-relaxed">
//                       {item.description}
//                     </p>
//                   </div>
//                 </Card>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Pagination Dots */}
//         <div className="flex justify-center gap-2 mt-12">
//           {Array.from({ length: totalSlides }).map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setActiveSlide(index)}
//               className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                 activeSlide === index
//                   ? 'bg-amber-600 w-8'
//                   : 'bg-gray-600 hover:bg-gray-500'
//               }`}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default MenuSection;







import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'antd';
import { StarFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';

const PopularDishesSection: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const menuItems = [
    {
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      name: 'Beef Biriyani',
      price: '$28',
      rating: 5,
      reviews: 37,
      description: 'It is a long established fact that a reader will be distracted.'
    },
    {
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
      name: 'Thai Soup',
      price: '$21',
      rating: 5,
      reviews: 54,
      description: 'It is a long established fact that a reader will be distracted.'
    },
    {
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      name: 'Beef Machal',
      price: '$25',
      rating: 4,
      reviews: 20,
      description: 'It is a long established fact that a reader will be distracted.'
    },
    {
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      name: 'Beef Biriyani',
      price: '$28',
      rating: 5,
      reviews: 37,
      description: 'It is a long established fact that a reader will be distracted.'
    },
    {
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
      name: 'Thai Soup',
      price: '$21',
      rating: 5,
      reviews: 54,
      description: 'It is a long established fact that a reader will be distracted.'
    },
    {
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      name: 'Beef Machal',
      price: '$25',
      rating: 4,
      reviews: 20,
      description: 'It is a long established fact that a reader will be distracted.'
    },
    {
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      name: 'Chicken Curry',
      price: '$22',
      rating: 4,
      reviews: 28,
      description: 'It is a long established fact that a reader will be distracted.'
    },
    {
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
      name: 'Vegetable Salad',
      price: '$18',
      rating: 4,
      reviews: 42,
      description: 'It is a long established fact that a reader will be distracted.'
    },
    {
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      name: 'Seafood Pasta',
      price: '$32',
      rating: 5,
      reviews: 35,
      description: 'It is a long established fact that a reader will be distracted.'
    }
  ];

  // Chia menuItems thành các nhóm 3 items mỗi slide
  const chunkArray = (array: any[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const slides = chunkArray(menuItems, 3);
  const totalSlides = slides.length;

  // Scroll đến slide cụ thể
  const scrollToSlide = (slideIndex: number) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: slideIndex * slideWidth,
        behavior: 'smooth'
      });
    }
    setActiveSlide(slideIndex);
  };

  // Tự động chuyển slide
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      const nextSlide = (activeSlide + 1) % totalSlides;
      scrollToSlide(nextSlide);
    }, 4000); // Chuyển slide mỗi 4 giây

    return () => clearInterval(interval);
  }, [activeSlide, totalSlides, isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    const prevSlide = (activeSlide - 1 + totalSlides) % totalSlides;
    scrollToSlide(prevSlide);
    
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    const nextSlide = (activeSlide + 1) % totalSlides;
    scrollToSlide(nextSlide);
    
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Xử lý scroll để cập nhật activeSlide
  const handleScroll = () => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      const scrollPosition = carouselRef.current.scrollLeft;
      const newActiveSlide = Math.round(scrollPosition / slideWidth);
      if (newActiveSlide !== activeSlide) {
        setActiveSlide(newActiveSlide);
      }
    }
  };

  return (
    <section className="relative py-20 px-4 bg-gray-900 overflow-hidden">
      {/* Background Food Images */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80"
          alt="Background food"
          className="w-full h-full object-cover rounded-full blur-sm"
        />
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80"
          alt="Background food"
          className="w-full h-full object-cover rounded-full blur-sm"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="text-amber-600">
              <path d="M2 8L8 2M8 2L14 8M8 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M26 8L32 2M32 2L38 8M32 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-amber-600 text-sm tracking-wider uppercase">Our Popular Item</span>
            <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="text-amber-600">
              <path d="M2 8L8 2M8 2L14 8M8 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M26 8L32 2M32 2L38 8M32 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-5xl font-serif font-bold text-white">
            Restho Popular Item List
          </h2>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 mb-6">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 z-20"
          >
            <LeftOutlined />
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 z-20"
          >
            <RightOutlined />
          </button>
        </div>

        {/* Menu Cards Carousel */}
        <div className="relative">
          {/* Vertical Decorative Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-64 hidden lg:block z-10">
            <div className="relative h-full">
              <div className="absolute top-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-600 to-transparent"></div>
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-600 rounded-full"></div>
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-600 rounded-full"></div>
              <div className="absolute top-3/4 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-600 rounded-full"></div>
            </div>
          </div>

          {/* Custom Carousel với scroll horizontal */}
          <div className="lg:pl-16">
            <div
              ref={carouselRef}
              className="flex overflow-x-hidden scroll-smooth snap-x snap-mandatory"
              onScroll={handleScroll}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {slides.map((slideItems, slideIndex) => (
                <div
                  key={slideIndex}
                  className="flex-shrink-0 w-full snap-center"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                    {slideItems.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="group relative"
                      >
                        {/* Thêm margin để tạo khoảng trống cho hover effect */}
                        <div className="my-2"> {/* Thêm margin dọc để tạo khoảng trống */}
                          <Card
                            className="bg-gray-800 border-2 border-gray-700 hover:border-amber-600 transition-all duration-300 overflow-hidden h-full relative transform hover:-translate-y-2" // Thêm transform hover
                            bodyStyle={{ padding: 0 }}
                          >
                            {/* Image container */}
                            <div className="relative overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute top-4 left-4 z-10">
                                <div className="bg-white rounded-full px-4 py-2 shadow-lg">
                                  <span className="text-amber-600 font-bold text-lg">{item.price}</span>
                                </div>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                              {/* Rating */}
                              <div className="flex items-center gap-2 mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <StarFilled
                                    key={i}
                                    className={`text-sm ${
                                      i < item.rating ? 'text-amber-500' : 'text-gray-600'
                                    }`}
                                  />
                                ))}
                                <span className="text-gray-400 text-sm ml-2">Review({item.reviews})</span>
                              </div>

                              {/* Name */}
                              <h3 className="text-white text-xl font-bold mb-3">{item.name}</h3>

                              {/* Description */}
                              <p className="text-gray-400 text-sm leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                scrollToSlide(index);
                setTimeout(() => setIsAutoPlaying(true), 10000);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSlide === index
                  ? 'bg-amber-600 w-8'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thêm CSS để ẩn scrollbar */}
      <style >{`
        .flex::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default PopularDishesSection;