import React from 'react';
import { Row, Col, Typography, Input, Button } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  SendOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    'Trang chủ',
    'Menu',
    'Tin tức',
    'Giới thiệu',
    'Liên hệ',
    'Đặt bàn'
  ];

  const services = [
    'Ẩm thực Ý',
    'Đặt bàn trực tuyến',
    'Dịch vụ tiệc',
    'Giao hàng',
    'Ưu đãi đặc biệt',
    'Sự kiện'
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <Row gutter={[48, 48]}>
          {/* Company Info */}
          <Col xs={24} md={12} lg={6}>
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <div>
                  <Title level={4} className="text-white mb-0">Feliciano</Title>
                  <Text className="text-gray-400 text-sm">Italian Excellence</Text>
                </div>
              </div>
              
              <Paragraph className="text-gray-300 mb-6 leading-relaxed">
                Feliciano mang đến trải nghiệm ẩm thực Ý đích thực với những món ăn tinh tế 
                và dịch vụ tận tâm. Hãy đến với chúng tôi để thưởng thức hương vị Ý.
              </Paragraph>

              {/* Social Media */}
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors duration-300">
                  <FacebookOutlined className="text-lg" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors duration-300">
                  <TwitterOutlined className="text-lg" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-300">
                  <LinkedinOutlined className="text-lg" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors duration-300">
                  <YoutubeOutlined className="text-lg" />
                </a>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={24} md={12} lg={6}>
            <Title level={4} className="text-white mb-6">Liên kết nhanh</Title>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                  >
                    <span className="link-dot w-2 h-2 bg-red-600 rounded-full mr-3 opacity-0 transition-opacity duration-300"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          {/* Services */}
          <Col xs={24} md={12} lg={6}>
            <Title level={4} className="text-white mb-6">Dịch vụ</Title>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                  >
                    <span className="link-dot w-2 h-2 bg-orange-600 rounded-full mr-3 opacity-0 transition-opacity duration-300"></span>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          {/* Contact & Newsletter */}
          <Col xs={24} md={12} lg={6}>
            <Title level={4} className="text-white mb-6">Liên hệ</Title>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <PhoneOutlined className="text-red-400" />
                <Text className="text-gray-300">+1 978 123 4567</Text>
              </div>
              <div className="flex items-center gap-3">
                <MailOutlined className="text-red-400" />
                <Text className="text-gray-300">info@feliciano.com</Text>
              </div>
              <div className="flex items-start gap-3">
                <EnvironmentOutlined className="text-red-400 mt-1" />
                <Text className="text-gray-300">
                  123 Đường ABC, Quận XYZ<br />
                  Hà Nội, Việt Nam
                </Text>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <Title level={5} className="text-white mb-4">Đăng ký nhận tin</Title>
              <Paragraph className="text-gray-400 text-sm mb-4">
                Nhận ưu đãi mới nhất và thông tin sự kiện từ Feliciano
              </Paragraph>
              <div className="flex gap-2">
                <Input 
                  placeholder="Email của bạn"
                  className="flex-1"
                  size="large"
                />
                <Button 
                  type="primary" 
                  icon={<SendOutlined />}
                  size="large"
                  className="px-4 bg-gradient-to-r from-red-600 to-orange-600"
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <Row justify="space-between" align="middle">
            <Col xs={24} md={12}>
              <Text className="text-gray-400">
                © {currentYear} Feliciano. All rights reserved.
              </Text>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex flex-wrap gap-6 justify-start md:justify-end mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Chính sách bảo mật
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Điều khoản sử dụng
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Sitemap
                </a>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Thêm CSS cho hover effect */}
      <style>{`
        a:hover .link-dot {
          opacity: 1 !important;
        }
      `}</style>
    </footer>
  );
};

export default Footer;