import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined, DeleteOutlined, PictureOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

interface Column {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "tel" | "number" | "date" | "select" | "file" | "textarea";
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: Array<{ label: string; value: string | number }>;
}

interface ModalFormProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  title: string;
  columns: Column[];
  initialData?: any;
  submitText?: string;
  onFileUpload?: (file: File) => Promise<string>;
}

const ModalForm: React.FC<ModalFormProps> = ({
  show,
  onClose,
  onSubmit,
  title,
  columns,
  initialData = {},
  submitText = "Lưu",
  onFileUpload,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (show) {
      form.setFieldsValue(initialData);
    }
  }, [show, initialData, form]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await onSubmit(values);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!onFileUpload) return false;

    try {
      setUploading(true);
      const url = await onFileUpload(file);
      form.setFieldValue("avatar", url);
      message.success("Tải file thành công!");
      return false;
    } catch (error) {
      message.error("Lỗi tải file!");
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    form.setFieldValue("avatar", "");
  };

  const renderField = (col: Column) => {
    switch (col.type) {
      case "select":
        return (
          <Select 
            placeholder={col.placeholder || `Chọn ${col.label}`}
            allowClear
          >
            {col.options?.map((opt, idx) => (
              <Option key={idx} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        );

      case "textarea":
        return (
          <TextArea 
            placeholder={col.placeholder}
            rows={2}
          />
        );

      case "file":
        return (
          <div className="space-y-3">
            <Upload
              beforeUpload={handleFileUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} loading={uploading} size="small">
                {uploading ? "Đang tải..." : "Chọn ảnh"}
              </Button>
            </Upload>
            
            <Form.Item noStyle shouldUpdate>
              {() => 
                form.getFieldValue(col.name) ? (
                  <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <img 
                      src={form.getFieldValue(col.name)} 
                      alt="Preview" 
                      className="max-h-32 mx-auto rounded"
                    />
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      danger
                      size="small"
                      className="absolute top-1 right-1 bg-white rounded-full shadow"
                      onClick={handleRemoveImage}
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    <PictureOutlined className="text-2xl text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Preview ảnh</p>
                  </div>
                )
              }
            </Form.Item>
          </div>
        );

      case "password":
        return <Input.Password placeholder={col.placeholder} size="small" />;

      default:
        return (
          <Input 
            type={col.type} 
            placeholder={col.placeholder}
            size="small"
          />
        );
    }
  };

  return (
    <Modal
      title={title}
      open={show}
      onCancel={onClose}
      footer={null}
      width={700}
      // style={{ top: 20 }}
      bodyStyle={{ 
        maxHeight: '60vh',
        overflowY: 'auto',
        padding: '16px'
      }}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="small"
      >
        <div className="grid grid-cols-2 gap-3">
          {columns.map((col) => (
            <Form.Item
              key={col.name}
              name={col.name}
              label={<span className="text-sm">{col.label}</span>}
              rules={col.required ? [{ required: true, message: `${col.label} là bắt buộc` }] : []}
              className={col.type === "file" ? "col-span-2 mb-1" : "mb-1"}
            >
              {renderField(col)}
            </Form.Item>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t mt-3">
          <Button onClick={onClose} disabled={loading} size="small">
            Hủy
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            disabled={uploading}
            size="small"
          >
            {submitText}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalForm;