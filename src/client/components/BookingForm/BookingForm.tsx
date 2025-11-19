import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  TimePicker,
  Select,
  message,
  Spin,
  Collapse,
  Typography,
} from 'antd';
import {
  CalendarFilled,
  ClockCircleFilled,
  InfoCircleFilled,
  PhoneFilled,
  MailFilled,
  EnvironmentOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import MealSelection from './MealSelection';
import { useBooking } from '../../../hooks/useBookings';
import { getCurrentUser, getAuthToken } from '../../../service/authService';
import { useNavigate } from 'react-router-dom';
import { useTableTypes, useAvailableTables } from '../../../hooks/useTable';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Text } = Typography;

interface BookingFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: (hasMeals?: boolean) => void;
}

// ============ UTILITY FUNCTIONS ============
const isBookingStillActive = (booking: any): boolean => {
  if (!booking?.endTime) return false;
  const end = dayjs(booking.endTime.split('.')[0]);
  return end.isValid() && dayjs().isBefore(end);
};

const checkExistingBooking = (): any | null => {
  const raw = localStorage.getItem('currentBooking');
  if (!raw) return null;

  try {
    const booking = JSON.parse(raw);
    if (isBookingStillActive(booking)) {
      return booking;
    }
    localStorage.removeItem('currentBooking');
    sessionStorage.removeItem('cart');
    return null;
  } catch {
    localStorage.removeItem('currentBooking');
    sessionStorage.removeItem('cart');
    return null;
  }
};

const clearBookingData = () => {
  localStorage.removeItem('currentBooking');
  sessionStorage.removeItem('cart');
};

// ============ MAIN COMPONENT ============
const BookingForm: React.FC<BookingFormProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [selectedMeals, setSelectedMeals] = useState<Array<{ 
    mealID: number; 
    mealName: string;
    price: number;
    image: string;
    quantity: number 
  }>>([]);
  const [showMealSelection, setShowMealSelection] = useState(false);
  const [hasCheckedBooking, setHasCheckedBooking] = useState(false);
  
  const token = getAuthToken();
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const { useCreateBooking } = useBooking(token);
  const { mutate: createBooking, isPending } = useCreateBooking();

  // ============ DATA FETCHING ============
  const { data: tableTypes = [], isLoading: loadingTypes } = useTableTypes(token);

  const date = Form.useWatch('date', form);
  const time = Form.useWatch('time', form);
  const guests = Form.useWatch('guests', form);
  const tableTypeId = Form.useWatch('tableTypeId', form);

  // Tính toán thời gian ISO
  const { startTimeISO, endTimeISO } = useMemo(() => {
    if (!date || !time) return { startTimeISO: '', endTimeISO: '' };
    const start = date.hour(time.hour()).minute(time.minute()).second(0);
    const end = start.add(5, 'hour');
    return {
      startTimeISO: start.toISOString(),
      endTimeISO: end.toISOString(),
    };
  }, [date, time]);

  // Lấy bàn trống
  const enabled = !!(date && time && guests && tableTypeId && startTimeISO && endTimeISO);
  const {
    data: availableTables = [],
    isFetching: loadingTables,
    refetch: refetchTables,
  } = useAvailableTables(token, startTimeISO, endTimeISO, guests, tableTypeId);

  // ============ EFFECTS ============
  
  // 2. Tự động chọn bàn đầu tiên
  useEffect(() => {
    if (loadingTables || !enabled || availableTables.length === 0) return;
    
    const firstTable = availableTables[0];
    form.setFieldsValue({
      tableID: firstTable.tableID,
      tableName: firstTable.tableName,
    });
  }, [availableTables, loadingTables, enabled, form]);

  // 3. Debounce refetch khi thay đổi điều kiện
  useEffect(() => {
    if (!enabled) return;
    
    const timer = setTimeout(() => {
      refetchTables();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [date, time, guests, tableTypeId, enabled, refetchTables]);

  // ============ HANDLERS ============
  
  const showExistingBookingModal = (booking: any) => {
    Modal.confirm({
      title: 'Bạn đã có đơn đặt bàn',
      content: (
        <div>
          <Text>Bàn </Text>
          <Text strong>{booking.tableName}</Text>
          <Text> - {dayjs(booking.bookingDate || booking.startTime).format('DD/MM/YYYY')} </Text>
          <Text strong>{dayjs(booking.startTime).format('HH:mm')}</Text>
        </div>
      ),
      okText: 'Xem đơn',
      cancelText: 'Hủy đơn cũ',
      onOk: () => {
        onCancel();
        navigate('/client/cart');
      },
      onCancel: () => {
        clearBookingData();
        message.success('Đã hủy đơn cũ. Bạn có thể đặt bàn mới.');
        form.resetFields(['tableID', 'tableName']);
      },
    });
  };

  const onFinish = async (values: any) => {
    if (!currentUser) {
      message.error('Vui lòng đăng nhập!');
      return;
    }

    // Kiểm tra lại đơn cũ trước khi submit
    const existingBooking = checkExistingBooking();
    if (existingBooking) {
      showExistingBookingModal(existingBooking);
      return;
    }

    if (!values.tableID) {
      message.warning('Không có bàn trống phù hợp!');
      return;
    }

    const bookingData = {
      userID: currentUser.userId,
      tableID: values.tableID,
      bookingDate: values.date.format('YYYY-MM-DDTHH:mm:ss'),
      startTime: startTimeISO,
      endTime: endTimeISO,
      numberOfGuests: values.guests,
      notes: values.notes?.trim() || '',
      initialPayment: 0,
      paymentMethod: 'CASH',
      meals: selectedMeals.map(m => ({
        mealID: m.mealID,
        quantity: m.quantity,
      })),
    };

    createBooking(bookingData, {
      onSuccess: (newBooking) => {
        localStorage.setItem('currentBooking', JSON.stringify(newBooking));
        message.success('Đặt bàn thành công!');

        if (selectedMeals.length > 0) {
          const cart = selectedMeals.map(m => ({
            mealID: m.mealID,
            name: m.mealName,          
            price: m.price.toString(), 
            quantity: m.quantity,
            image: m.image || '/placeholder.jpg', 
            addedAt: new Date().toISOString(),
          }));

          sessionStorage.setItem('cart', JSON.stringify(cart));
          window.dispatchEvent(new Event('cartUpdated'));

          // Nếu muốn giữ lại selectedMeals hoặc có thể clear
          setSelectedMeals([]);

          navigate('/client/cart');
          onSuccess?.(true);
        } else {
          onCancel();
          onSuccess?.(false);
        }
      },
      onError: (err: any) => message.error(err.message || 'Đặt bàn thất bại!'),
    });
  };

  const handleAddPromotionTag = (tag: string) => {
    const currentNotes = form.getFieldValue('notes') || '';
    form.setFieldsValue({ 
      notes: currentNotes ? `${currentNotes} | ${tag}` : tag 
    });
  };

  const handleMealsSelected = useCallback((meals: any[]) => {
    setSelectedMeals(meals);
  }, []);

  // ============ COMPUTED VALUES ============
  
  const tableDisplayValue = useMemo(() => {
    if (loadingTables) return 'Đang tìm bàn...';
    const tableID = form.getFieldValue('tableID');
    const tableName = form.getFieldValue('tableName');
    if (tableID && tableName) return `${tableName} (ID: ${tableID})`;
    return 'Không có bàn trống';
  }, [loadingTables, form, availableTables]);

  const promotionTags = [
    'Có trẻ em', 'Bàn tròn', 'Bàn vuông', 'Bàn cạnh cửa sổ',
    'SN ≥4 tặng bánh', 'SN ≥4 tặng món', 'SN <4 tặng món',
    'Kỷ niệm cưới', 'Sự kiện quan trọng', 'Ghế trẻ em',
    'View thoáng', 'City view',
  ];

  // ============ RENDER ============
  
  return (
    <Modal
      title={
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>King BBQ Buffet Aeon Hà Đông</div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
            <EnvironmentOutlined /> L6 12/4, Tầng 2 TTTM Aeon Mall Hà Đông, Hà Nội
          </div>
          <div style={{ fontSize: '13px', color: '#ff6b00', marginTop: '2px' }}>
            <PhoneFilled /> 02422818822
          </div>
          <div className="mt-3 border-b border-gray-300"></div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      style={{ top: 20 }}
      className="booking-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          date: dayjs(),
          time: dayjs().set('hour', 18).set('minute', 0),
          guests: 4,
        }}
        className="mt-6"
      >
        <Form.Item label={<span>Thời gian dùng bữa <span className="text-red-500">*</span></span>}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="date" noStyle rules={[{ required: true, message: 'Chọn ngày!' }]}>
                <DatePicker
                  placeholder="Chọn ngày"
                  className="w-full"
                  format="DD [Tháng] MM YYYY"
                  prefix={<CalendarFilled className="text-orange-500" />}
                  disabledDate={(d) => d.isBefore(dayjs().startOf('day'))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="time" noStyle rules={[{ required: true, message: 'Chọn giờ!' }]}>
                <TimePicker
                  placeholder="Chọn giờ"
                  className="w-full"
                  format="HH:mm"
                  minuteStep={15}
                  prefix={<ClockCircleFilled className="text-orange-500" />}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="tableTypeId"
              label={<span>Loại bàn <span className="text-red-500">*</span></span>}
              rules={[{ required: true, message: 'Chọn loại bàn!' }]}
            >
              <Select placeholder="Chọn loại bàn" loading={loadingTypes} disabled={loadingTypes}>
                {tableTypes.map(type => (
                  <Option key={type.id} value={type.id}>
                    {type.typeName} (Tối đa {type.capacity} người)
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="tableID" label={<span>Bàn <span className="text-red-500">*</span></span>}>
              <Input
                prefix={loadingTables ? <Spin size="small" /> : <InfoCircleFilled className="text-blue-600" />}
                placeholder={loadingTables ? 'Đang tìm...' : 'Chưa chọn loại bàn'}
                value={tableDisplayValue}
                disabled
                className={loadingTables ? 'animate-pulse' : ''}
                style={{
                  backgroundColor: loadingTables
                    ? '#f0f9ff'
                    : form.getFieldValue('tableID')
                    ? '#eff6ff'
                    : '#fef2f2',
                  borderColor: loadingTables
                    ? '#bae6fd'
                    : form.getFieldValue('tableID')
                    ? '#93c5fd'
                    : '#fca5a5',
                  fontWeight: form.getFieldValue('tableID') ? '600' : 'normal',
                  color: form.getFieldValue('tableID') ? '#1d4ed8' : '#dc2626',
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="guests"
              label={<span>Số lượng người <span className="text-red-500">*</span></span>}
              rules={[
                { required: true, message: 'Chọn số người!' },
                () => ({
                  validator(_, value) {
                    if (!value || !tableTypeId) return Promise.resolve();
                    const type = tableTypes.find(t => t.id === tableTypeId);
                    if (type && value > type.capacity) {
                      return Promise.reject(`Chỉ chứa tối đa ${type.capacity} người!`);
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Select placeholder="Số người">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                  <Option key={n} value={n}>{n}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="name" label={<span>Họ tên <span className="text-red-500">*</span></span>} rules={[{ required: true }]}>
              <Input prefix={<InfoCircleFilled className="text-orange-500" />} placeholder="Họ tên" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label={<span>SĐT <span className="text-red-500">*</span></span>}
              rules={[
                { required: true },
                { pattern: /^[0-9]{10,11}$/, message: 'SĐT không hợp lệ!' },
              ]}
            >
              <Input prefix={<PhoneFilled className="text-orange-500" />} placeholder="SĐT" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label={<span>Email <span className="text-red-500">*</span></span>}
              rules={[{ required: true }, { type: 'email', message: 'Email không hợp lệ!' }]}
            >
              <Input prefix={<MailFilled className="text-orange-500" />} placeholder="Email" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="notes" label="Ghi chú">
          <TextArea rows={3} placeholder="Ghi chú thêm..." />
        </Form.Item>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Ưu đãi nhanh</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {promotionTags.map(tag => (
              <Button
                key={tag}
                size="small"
                onClick={() => handleAddPromotionTag(tag)}
                className="text-xs h-8"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <Button
            type="dashed"
            block
            onClick={() => setShowMealSelection(prev => !prev)}
            className="h-12 flex items-center justify-center gap-2"
          >
            {showMealSelection ? 'Ẩn menu món ăn' : 'Chọn món ăn (tùy chọn)'}
          </Button>
        </div>

        {showMealSelection && (
          <div className="mb-4">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <MealSelection onMealsSelected={handleMealsSelected} />
            </div>
          </div>
        )}

        {selectedMeals.length > 0 && !showMealSelection && (
          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm">
            <strong>Đã chọn:</strong> {selectedMeals.reduce((s, m) => s + m.quantity, 0)} món
          </div>
        )}

        <Form.Item className="mb-0 mt-6">
          <div className="flex justify-end gap-3">
            <Button
              size="large"
              onClick={onCancel}
              className="booking-cancel-btn min-w-32 h-11 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:border-gray-400"
            >
              Huỷ bỏ
            </Button>

            <Button
              size="large"
              type="primary"
              htmlType="submit"
              disabled={isPending}
              className="booking-confirm-btn min-w-32 h-11 px-7 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl transition-all duration-300 hover:from-orange-600 hover:to-amber-600 hover:scale-105 hover:shadow-lg relative overflow-hidden"
              style={{
                minWidth: '128px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isPending ? <Spin size="small" className="text-white" /> : <span>Xác nhận</span>}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(BookingForm);