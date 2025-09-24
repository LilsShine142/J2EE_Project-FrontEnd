import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, Select, DatePicker, TimePicker } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ReservationSection: React.FC = () => {
  const [form] = Form.useForm();

  const dishes = [
    { value: 'bo-nuong-khoai-tay', label: 'Bò nướng khoai tây', price: '80.000 đ' },
    { value: 'nom-dua-chuot', label: 'Nộm dưa chua', price: '50.000 đ' },
    { value: 'ga-chien-kieu-kfc', label: 'Gà chiên kiểu KFC', price: '150.000 đ' },
    { value: 'trung-op-la', label: 'Trứng ốp la', price: '80.000 đ' }
  ];

  const handleSubmit = (values: any) => {
    console.log('Reservation form values:', values);
    // Handle form submission here (e.g., API call)
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-red-50 relative overflow-hidden border-b border-gray-200">
      <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: "url('https://via.placeholder.com/1920x1080?text=Reservation+BG')" }}></div>
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-2xl font-bold"> FORM ĐẶT BÀN </h1>
      </div>
    </section>
  );
};

export default ReservationSection;