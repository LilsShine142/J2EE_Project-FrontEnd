import React, { useState } from 'react';
import { Modal, Form, Input, Button, Row, Col, DatePicker, TimePicker, Select, Space } from 'antd';
import { CalendarFilled, ClockCircleFilled, InfoCircleFilled, PhoneFilled , MailFilled , EnvironmentOutlined } from '@ant-design/icons';
import { FaUserAlt } from "react-icons/fa";
import dayjs from 'dayjs';
import type { BookingFormData } from '../../../types/index';

const { Option } = Select;
const { TextArea } = Input;

interface BookingFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: (data: BookingFormData) => void;
  initialData?: Partial<BookingFormData>;
}

const BookingForm: React.FC<BookingFormProps> = ({ visible, onCancel, onSuccess, initialData }) => {
  const [form] = Form.useForm();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const onFinish = (values: any) => {
    const rawDate = values?.date;
    const rawTime = values?.time;
    const date = rawDate ? (dayjs.isDayjs(rawDate) ? rawDate.toDate() : rawDate) : undefined;
    const time = rawTime ? (dayjs.isDayjs(rawTime) ? rawTime.format('HH:mm') : rawTime) : undefined;
    
    const data: BookingFormData = {
      ...values,
      date,
      time,
      options: selectedOptions,
    };
    console.log('Booking data:', data);
    // TODO: Call API /api/bookings
    onSuccess?.(data);
    form.resetFields();
    setSelectedOptions([]);
  };

  const handleOptionToggle = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const promotionTags = [
    'Có trẻ em', 'Bàn tròn', 'Bàn vuông', 'Bàn cạnh cửa sổ',
    'SN ≥4 tặng bánh', 'SN ≥4 tặng món', 'SN <4 tặng món',
    'Kỷ niệm cưới', 'Sự kiện quan trọng', 'Ghế trẻ em',
    'View thoáng', 'City view',
  ];

  return (
    <Modal
      title={
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>King BBQ Buffet Aeon Hà Đông</div>
          <div style={{ fontSize: '13px', fontWeight: 'normal', color: '#666', marginTop: '4px' }}>
            <EnvironmentOutlined /> L6 12/4, Tầng 2 TTTM Aeon Mall Hà Đông, Phường Dương Nội, Quận Hà Đông, Hà Nội
          </div>
          <div style={{ fontSize: '13px', fontWeight: 'normal', color: '#ff6b00', marginTop: '2px' }}>
            <PhoneFilled /> 02422818822
          </div>
          {/* ĐƯỜNG KẺ NGANG */}
          <div className="mt-3 border-b border-gray-300"></div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[null]}
      width={600}
      style={{ top: 20 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          date: dayjs('2025-10-28', 'YYYY-MM-DD'),
          time: dayjs('17:45', 'HH:mm'),
          guests: 5,
          ...initialData
        }}
        className='mt-6'
      >
        <Form.Item
          label={<span>Thời gian dùng bữa <span className="text-red-500">*</span></span>}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="date"
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <DatePicker
                  placeholder="Chọn ngày"
                  className="w-full"
                  format="DD [Tháng] MM YYYY"
                  prefix={<CalendarFilled className="text-orange-500" />}
                  suffixIcon={null} // Ẩn icon mặc định
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="time"
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
              >
                <TimePicker
                  placeholder="Chọn giờ"
                  className="w-full"
                  format="HH:mm"
                  prefix={<ClockCircleFilled className="text-orange-500" />}
                  suffixIcon={null} // Ẩn icon mặc định
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="guests"
              label={<span>Số lượng người <span className="text-red-500">*</span></span>}
              rules={[{ required: true, message: 'Vui lòng chọn số người!' }]}
            >
              <Select
                placeholder="Chọn số người"
                prefix={<FaUserAlt className="text-orange-500" />}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <Option key={num} value={num}>{num}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label={<span>Họ tên <span className="text-red-500">*</span></span>}
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input prefix={<InfoCircleFilled className="text-orange-500" />} placeholder="Nhập họ tên" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label={<span>Số điện thoại <span className="text-red-500">*</span></span>}
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input prefix={<PhoneFilled className="text-orange-500" />} placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label={<span>Email <span className="text-red-500">*</span></span>}
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input prefix={<MailFilled className="text-orange-500" />} placeholder="Nhập email" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="notes" label="Ghi chú">
          <TextArea rows={3} placeholder="Nhập ghi chú" className="resize-none" />
        </Form.Item>

        {/* GHI CHÚ TAGS */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Ưu đãi & Ghi chú</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {promotionTags.map(tag => (
              <Button
                key={tag}
                size="small"
                className="booking-tag-btn text-xs font-medium rounded-lx px-3 py-1 h-8 transition-all duration-200 shadow-sm"
                onClick={() => {
                  const current = form.getFieldValue('notes') || '';
                  form.setFieldsValue({ 
                    notes: current ? `${current} | ${tag}` : tag 
                  });
                }}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </Form>
      {/* === 2 NÚT HÀNH ĐỘNG - ĐẸP, ĐỒNG BỘ === */}
      <div className="flex justify-end gap-3 mt-6">
        {/* NÚT HUỶ BỎ - XÁM, HOVER ĐẬM */}
        <Button
          size="large"
          onClick={onCancel}
          className="booking-cancel-btn min-w-32 h-11 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:border-gray-400"
        >
          Huỷ bỏ
        </Button>

        {/* NÚT XÁC NHẬN - CAM GRADIENT, HOVER ĐẬM */}
        <Button
          size="large"
          onClick={() => form.submit()}
          className="booking-confirm-btn min-w-32 h-11 px-7 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl transition-all duration-300 hover:from-orange-600 hover:to-amber-600 hover:scale-105 hover:shadow-lg"
        >
          Xác nhận
        </Button>
      </div>
    </Modal>
  );
};

export default BookingForm;