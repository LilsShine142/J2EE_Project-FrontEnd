import React, { useState, type JSX } from 'react';
import CartTable from './CartTable';

interface CartItem {
  id: number;
  image: string;
  name: string;
  unitPrice: number;
  discountPrice: number;
  quantity: number;
}

interface CartContentProps {
  onContinueShopping: () => void;
  onCheckout: () => void;
}

// Sub-components
const DeleteButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="text-gray-400 hover:text-red-500 transition-colors">
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

const QuantityControl: React.FC<{
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}> = ({ quantity, onIncrease, onDecrease }) => (
  <div className="flex items-center justify-center gap-2">
    <button onClick={onDecrease} className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100 rounded">
      −
    </button>
    <span className="w-12 text-center">{quantity}</span>
    <button onClick={onIncrease} className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100 rounded">
      +
    </button>
  </div>
);

const CartContent: React.FC<CartContentProps> = ({ onContinueShopping, onCheckout }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80',
      name: 'Organic Vegetable grains 100%',
      unitPrice: 30.36,
      discountPrice: 22.36,
      quantity: 1
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=100&q=80',
      name: 'Fresh Vegetable Eggplant',
      unitPrice: 45.36,
      discountPrice: 35,
      quantity: 1
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=100&q=80',
      name: 'Fresh Delicious And Healthy',
      unitPrice: 15.36,
      discountPrice: 22.36,
      quantity: 1
    }
  ]);

  const [couponCode, setCouponCode] = useState('');

  // Configuration
  const TABLE_COLUMNS = [
    { key: 'delete', label: 'Delete', align: 'left' as const },
    { key: 'image', label: 'Image', align: 'left' as const },
    { key: 'name', label: 'Food Name', align: 'left' as const },
    { key: 'unitPrice', label: 'Unite Price', align: 'center' as const },
    { key: 'discountPrice', label: 'Discount Price', align: 'center' as const },
    { key: 'quantity', label: 'Quantity', align: 'center' as const },
    { key: 'subtotal', label: 'Subtotal', align: 'right' as const }
  ];

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.discountPrice * item.quantity, 0);
  const fees = { shipping: 15, taxExcl: 15, taxIncl: 15, taxes: 15, shippingEnter: 5 };
  const total = subtotal + Object.values(fees).reduce((a, b) => a + b, 0);

  const FEE_ITEMS = [
    { label: 'Shipping Fee', value: 'Fee', isText: true },
    { label: 'Total ( tax excl. )', value: fees.taxExcl },
    { label: 'Total ( tax incl. )', value: fees.taxIncl },
    { label: 'Taxes', value: fees.taxes },
    { label: 'Shipping Enter your address to view shipping options.', value: fees.shippingEnter }
  ];

  // Handlers
  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.quantity + delta > 0
          ? { ...item, quantity: item.quantity + delta }
          : item
      )
    );
  };

  const removeItem = (id: number) => setCartItems(prev => prev.filter(item => item.id !== id));

  // Render cell function for CartTable
  const renderCell = (item: CartItem, columnKey: string): JSX.Element => {
    const cellStyles = {
      default: 'py-6 px-4',
      center: 'py-6 px-4 text-center',
      right: 'py-6 px-4 text-right'
    };

    const cells: Record<string, JSX.Element> = {
      delete: (
        <td className={cellStyles.default}>
          <DeleteButton onClick={() => removeItem(item.id)} />
        </td>
      ),
      image: (
        <td className={cellStyles.default}>
          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
        </td>
      ),
      name: (
        <td className={cellStyles.default}>
          <span className="text-gray-900">{item.name}</span>
        </td>
      ),
      unitPrice: (
        <td className={cellStyles.center}>
          <span className="text-gray-400 line-through">${item.unitPrice}</span>
        </td>
      ),
      discountPrice: (
        <td className={cellStyles.center}>
          <span className="text-gray-900 font-semibold">${item.discountPrice}</span>
        </td>
      ),
      quantity: (
        <td className={cellStyles.default}>
          <QuantityControl
            quantity={item.quantity}
            onIncrease={() => updateQuantity(item.id, 1)}
            onDecrease={() => updateQuantity(item.id, -1)}
          />
        </td>
      ),
      subtotal: (
        <td className={cellStyles.right}>
          <span className="text-gray-900 font-semibold">
            ${(item.discountPrice * item.quantity).toFixed(2)}
          </span>
        </td>
      )
    };

    return cells[columnKey] || <td className={cellStyles.default}></td>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Cart Table */}
      <CartTable
        columns={TABLE_COLUMNS}
        data={cartItems}
        renderCell={renderCell}
        keyExtractor={(item) => item.id}
      />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coupon Code */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Coupon Code</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon Code"
              className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-amber-500"
            />
            <button className="px-6 py-3 bg-amber-600 text-white font-semibold rounded hover:bg-amber-700 transition-colors">
              Apply Code
            </button>
          </div>
        </div>

        {/* Cart Totals */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Cart Totals</h3>
          <div className="bg-gray-50 rounded-lg p-6 space-y-3">
            {/* Shipping */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="font-semibold text-gray-900">Shipping</span>
              <span className="text-gray-900">${subtotal.toFixed(2)}</span>
            </div>

            {/* Fee Items */}
            <div className="space-y-2 text-sm">
              {FEE_ITEMS.map(({ label, value, isText }, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-gray-600">{label}</span>
                  <span className="text-gray-900">{isText ? value : `$${value}`}</span>
                </div>
              ))}
              <a href="#" className="text-amber-600 hover:underline text-sm block">
                Calculate shipping
              </a>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={onContinueShopping}
              className="flex-1 px-6 py-3 border-2 border-amber-600 text-amber-600 hover:bg-amber-50 font-semibold rounded transition-colors"
            >
              Continue to shopping
            </button>
            <button
              onClick={onCheckout}
              className="flex-1 px-6 py-3 bg-amber-600 text-white font-semibold rounded hover:bg-amber-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartContent;