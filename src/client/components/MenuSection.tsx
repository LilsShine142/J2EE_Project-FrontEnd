import React from 'react';
import { Row, Col, Card, Typography, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const MenuSection: React.FC = () => {
  const menuItems = [
    {
      image: 'https://via.placeholder.com/300x200?text=Nuc+Cam',
      name: 'Nức cam',
      price: '50.000 đ',
      description: 'Cam'
    },
    {
      image: 'https://via.placeholder.com/300x200?text=Ca+Thu+Ran',
      name: 'Cá thu rán',
      price: '500.000 đ',
      description: 'Cá thu'
    },
    {
      image: 'https://via.placeholder.com/300x200?text=Salad+Ca+Chua',
      name: 'Salad cá chua',
      price: '200.000 đ',
      description: 'Cá, Chua'
    },
    {
      image: 'https://via.placeholder.com/300x200?text=Ga+Chien+Kieu+KFC',
      name: 'Gà chiên kiểu KFC',
      price: '150.000 đ',
      description: 'Gà, Bột chiên'
    },
    {
      image: 'https://via.placeholder.com/300x200?text=Trung+Op+La',
      name: 'Trứng ốp la',
      price: '80.000 đ',
      description: 'Trứng, Rau'
    },
    {
      image: 'https://via.placeholder.com/300x200?text=Nom+Dua+Chuot',
      name: 'Nộm dưa chua',
      price: '50.000 đ',
      description: 'Dưa chua, Chanh'
    },
    {
      image: 'https://via.placeholder.com/300x200?text=Nuong+Khoai',
      name: 'Nướng khoai',
      price: '80.000 đ',
      description: 'Khoai tây'
    },
    {
      image: 'https://via.placeholder.com/300x200?text=Bo+Nuong+Khoai+Tay',
      name: 'Bò nướng khoai tây',
      price: '180.000 đ',
      description: 'Bò, Khoai tây'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Title level={2} className="text-4xl font-bold mb-4">
            <span className="text-gradient from-red-600 to-orange-600">Our Hot Dishes</span>
          </Title>
          <Paragraph className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá menu đa dạng của chúng tôi với những món ăn Ý cổ điển và sáng tạo
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {menuItems.map((item, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card 
                className="h-full hover-scale border-0 shadow-lg"
                cover={<img alt={item.name} src={item.image} className="h-48 object-cover rounded-t-xl" />}
                hoverable
              >
                <Card.Meta 
                  title={<div className="font-bold text-gray-800">{item.name}</div>} 
                  description={
                    <div>
                      <p className="text-red-600 font-semibold mb-2">{item.price}</p>
                      <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                      <Button 
                        type="link" 
                        size="small"
                        icon={<ArrowRightOutlined />}
                        className="p-0 text-red-600"
                      >
                        Thêm vào giỏ
                      </Button>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-12 text-white">
            <Title level={3} className="text-white mb-4">
              Sẵn sàng đặt món?
            </Title>
            <Paragraph className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Duyệt menu và đặt hàng trực tuyến ngay hôm nay để nhận ưu đãi đặc biệt.
            </Paragraph>
            <Button 
              size="large" 
              className="px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-red-600"
            >
              Xem toàn bộ menu
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;