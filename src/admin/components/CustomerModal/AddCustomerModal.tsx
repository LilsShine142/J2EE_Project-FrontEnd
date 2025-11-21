import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { UserPlus } from 'lucide-react';
import { useCreateUser } from '../../../hooks/useUserHooks';
import { RoleID } from '../../../lib/constants/constants';
import '../../css/AddCustomerModal.css';

interface AddCustomerModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (newUser: any) => void;
  token: string | null;
}

interface CustomerFormData {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
}

// Vì này tạo cho customer nên gắn cứng roleID và statusID
const CUSTOMER_ROLE_ID = RoleID.CUSTOMER; 
const ACTIVE_STATUS_ID = 1;
const WORKING_STATUS = 1

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  visible,
  onClose,
  onSuccess,
  token
}) => {
  const [form] = Form.useForm();
  const createUserMutation = useCreateUser(token);

  const handleSubmit = async (values: CustomerFormData) => {
    try {
      const userData = {
        fullName: values.fullName,
        phoneNumber: values.phone, 
        email: values.email || `${values.phone}@customer.temp`,
        address: values.address || '',
        password: values.phone, // Mặc định password = phone
        roleId: CUSTOMER_ROLE_ID,
        statusId: ACTIVE_STATUS_ID,
        statusWork: WORKING_STATUS,
      };

      console.log('Sending user data:', userData);

      const response = await createUserMutation.mutateAsync(userData);
      
      console.log('Response:', response);

      // Extract user data from response
      const newUser = {
        userID: (response as any).userID || (response as any).id,
        fullName: (response as any).fullName || (response as any).name,
        phone: (response as any).phoneNumber || (response as any).phone,
        email: (response as any).email,
      };

      onSuccess(newUser);
      form.resetFields();
      onClose();
    } catch (error: any) {
      console.error('Submit error:', error);
      
      // Show specific error messages if available
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          console.error(`Field ${key}:`, errors[key]);
        });
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-bold">
          <div className="p-2 bg-green-100 rounded-lg">
            <UserPlus className="w-5 h-5 text-green-600" />
          </div>
          <span>Thêm khách hàng mới</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose
      className="add-customer-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[
            { required: true, message: 'Vui lòng nhập họ tên!' },
            { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' },
            { max: 50, message: 'Họ tên không được quá 50 ký tự!' },
          ]}
        >
          <Input
            placeholder="Nhập họ và tên"
            size="large"
            prefix={<span className="text-gray-400">👤</span>}
            maxLength={50}
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { 
              pattern: /^(0|\+84)[0-9]{9}$/, 
              message: 'Số điện thoại không hợp lệ (VD: 0912345678)!' 
            },
          ]}
        >
          <Input
            placeholder="Nhập số điện thoại (VD: 0912345678)"
            size="large"
            prefix={<span className="text-gray-400">📱</span>}
            maxLength={11}
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email (tùy chọn)"
          rules={[
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input
            placeholder="Nhập email"
            size="large"
            prefix={<span className="text-gray-400">📧</span>}
            type="email"
          />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ (tùy chọn)"
        >
          <Input.TextArea
            placeholder="Nhập địa chỉ"
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>

        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <p className="text-sm text-blue-600 mb-1 font-semibold">
            <span className="text-base">💡</span> Lưu ý:
          </p>
          <ul className="text-xs text-blue-600 space-y-1 ml-4">
            <li>• Mật khẩu mặc định sẽ là <strong>số điện thoại</strong></li>
            <li>• Khách hàng có thể đổi mật khẩu sau khi đăng nhập</li>
            <li>• Thông tin này sẽ được lưu vào hệ thống ngay lập tức</li>
            <li>• Email tạm nếu không nhập: <code className="bg-blue-100 px-1 rounded">phone@customer.temp</code></li>
            <li>• Tài khoản sẽ được kích hoạt tự động</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleCancel}
            size="large"
            block
            disabled={createUserMutation.isPending}
            className="cancel-btn"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={createUserMutation.isPending}
            icon={<UserPlus className="w-4 h-4" />}
            className="submit-btn"
          >
            {createUserMutation.isPending ? 'Đang thêm...' : 'Thêm khách hàng'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddCustomerModal;