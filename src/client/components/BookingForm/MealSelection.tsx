import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button, InputNumber, Typography, Spin, message, Empty } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useMeal } from '../../../hooks/useMeal';
import { getAuthToken } from '../../../service/authService';

const { Title, Text } = Typography;

// === KHAI BÁO INTERFACE MEAL ===
export interface Meal {
  mealID: number;
  mealName: string;
  price: number;
  image?: string;
  description?: string;
  slug?: string;
  categoryName: string;
}

interface SelectedMeal {
  mealID: number;
  quantity: number;
}

interface MealSelectionProps {
  onMealsSelected: (meals: SelectedMeal[]) => void;
  onMealsData?: (meals: Meal[]) => void; 
  initialMeals?: SelectedMeal[];
}

const MealSelection: React.FC<MealSelectionProps> = ({ 
  onMealsSelected, 
  onMealsData, 
  initialMeals = [] 
}) => {
  const token = getAuthToken();
  const { useMeals } = useMeal(token);
  const [selectedMeals, setSelectedMeals] = useState<SelectedMeal[]>(initialMeals);

  // === GỌI API LẤY MÓN ĂN ===
  const { data: mealData, isLoading, error } = useMeals(
    { page: 0, size: 50 },
    { enabled: !!token }
  );

  // === TRUYỀN DỮ LIỆU MÓN VỀ CARTPAGE ===
  useEffect(() => {
    if (mealData?.items) {
      onMealsData?.(mealData.items as Meal[]);
    }
  }, [mealData, onMealsData]);

  // === CẬP NHẬT KHI CHỌN MÓN ===
  useEffect(() => {
    onMealsSelected(selectedMeals.filter(m => m.quantity > 0));
  }, [selectedMeals, onMealsSelected]);

  const handleQuantityChange = (mealID: number, quantity: number | null) => {
    if (quantity === null || quantity < 0) return;

    setSelectedMeals(prev => {
      const existing = prev.find(m => m.mealID === mealID);
      if (existing) {
        if (quantity === 0) {
          return prev.filter(m => m.mealID !== mealID);
        }
        return prev.map(m => m.mealID === mealID ? { ...m, quantity } : m);
      }
      return [...prev, { mealID, quantity }];
    });
  };

  if (isLoading) {
    return <Spin tip="Đang tải menu..." size="large" className="flex justify-center py-8" />;
  }

  if (error) {
    message.error('Lỗi tải menu: ' + error.message);
    return <Empty description="Không thể tải menu" className="py-8" />;
  }

  const meals: Meal[] = mealData?.items || [];

  if (meals.length === 0) {
    return <Empty description="Chưa có món ăn nào" className="py-8" />;
  }

  return (
    <div className="py-6">
      <Title level={4} className="mb-4 text-amber-600">
        Chọn món ăn
      </Title>
      <Text type="secondary" className="block mb-4">
        Chọn món bạn muốn đặt trước. Sẽ tính tiền tại quán.
      </Text>

      <Row gutter={[16, 16]}>
        {meals.map(meal => {
          const selectedQty = selectedMeals.find(m => m.mealID === meal.mealID)?.quantity || 0;
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={meal.mealID}>
              <Card
                hoverable
                cover={
                  <div className="relative">
                    <img
                      alt={meal.mealName}
                      src={meal.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                      className="h-40 w-full object-cover rounded-t-lg"
                    />
                    {selectedQty > 0 && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {selectedQty}
                      </div>
                    )}
                  </div>
                }
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="space-y-1">
                  <Text strong className="block text-sm">{meal.mealName}</Text>
                  <Text type="secondary" className="text-xs block">{meal.categoryName}</Text>
                  <Text className="block text-amber-600 font-bold">
                    {meal.price.toLocaleString()}₫
                  </Text>

                  <div className="flex items-center justify-center gap-1 mt-3">
                    <Button
                      size="small"
                      icon={<MinusOutlined />}
                      onClick={() => handleQuantityChange(meal.mealID, selectedQty - 1)}
                      disabled={selectedQty <= 0}
                    />
                    <InputNumber
                      min={0}
                      value={selectedQty}
                      onChange={val => handleQuantityChange(meal.mealID, val)}
                      className="w-16 text-center"
                      size="small"
                    />
                    <Button
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => handleQuantityChange(meal.mealID, selectedQty + 1)}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* TỔNG MÓN ĐÃ CHỌN */}
      {selectedMeals.filter(m => m.quantity > 0).length > 0 && (
        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <Text strong>
            Tổng món đã chọn: {selectedMeals.reduce((sum, m) => sum + m.quantity, 0)}
          </Text>
        </div>
      )}
    </div>
  );
};

export default MealSelection;