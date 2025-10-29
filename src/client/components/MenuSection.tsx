// import React, { useState } from 'react';

// const MenuSection: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('morning');

//   const menuTabs = [
//     { id: 'morning', label: 'MORNING' },
//     { id: 'weekday', label: 'WEEKDAY LUNCH' },
//     { id: 'dinner', label: 'DINNER' },
//     { id: 'wines', label: 'WINES' }
//   ];

//   const menuItems = {
//     morning: [
//       {
//         image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=300&q=80',
//         name: 'Greek Salad',
//         price: '$25.50',
//         description: 'Tomatoes, green bell pepper, sliced cucumber onion, olives, and feta cheese.',
//         badge: null
//       },
//       {
//         image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=300&q=80',
//         name: 'Lasagne',
//         price: '$40.00',
//         description: 'Vegetables, cheeses, ground meats, tomato sauce, seasonings and spices',
//         badge: 'SEASONAL'
//       },
//       {
//         image: 'https://images.unsplash.com/photo-1630851840633-30e2d3f14c17?auto=format&fit=crop&w=300&q=80',
//         name: 'Butternut Pumpkin',
//         price: '$10.00',
//         description: 'Typesetting industry lorem ipsum is simply dummy text of the priand.',
//         badge: null
//       }
//     ],
//     dinner: [
//       {
//         image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
//         name: 'Tokusen Wagyu',
//         price: '$39.00',
//         description: 'Vegetables, cheeses, ground meats, tomato sauce, seasonings and spices.',
//         badge: 'NEW'
//       },
//       {
//         image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=300&q=80',
//         name: 'Olivas Rellenas',
//         price: '$25.00',
//         description: 'Avocados with crab meat, red onion, crab salad stuffed red bell pepper and green bell pepper.',
//         badge: null
//       },
//       {
//         image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=300&q=80',
//         name: 'Opu Fish',
//         price: '$49.00',
//         description: 'Vegetables, cheeses, ground meats, tomato sauce, seasonings and spices',
//         badge: null
//       }
//     ]
//   };

//   const currentMenu = activeTab === 'dinner' ? menuItems.dinner : menuItems.morning;

//   return (
//     <section className="relative py-20 px-4 bg-gray-900 overflow-hidden">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-5">
//         <div className="absolute inset-0" style={{
//           backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)'
//         }}></div>
//       </div>

//       <div className="max-w-7xl mx-auto relative z-10">
//         {/* Section Title */}
//         <div className="text-center mb-12">
//           <div className="flex items-center justify-center gap-3 mb-6">
//             <svg width="60" height="40" viewBox="0 0 60 40" fill="none" className="text-amber-600">
//               <path d="M10 20L5 10L10 5L15 10L10 20Z" fill="currentColor"/>
//               <path d="M30 20L25 10L30 5L35 10L30 20Z" fill="currentColor"/>
//               <path d="M50 20L45 10L50 5L55 10L50 20Z" fill="currentColor"/>
//             </svg>
//           </div>
//           <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-2">
//             Delicious Menu
//           </h2>
//         </div>

//         {/* Menu Tabs */}
//         <div className="flex justify-center mb-12">
//           <div className="inline-flex border-t border-b border-amber-600 divide-x divide-amber-600">
//             {menuTabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`px-8 py-4 text-sm tracking-wider font-semibold transition-all duration-300 ${
//                   activeTab === tab.id
//                     ? 'bg-amber-600 text-black'
//                     : 'text-gray-300 hover:text-white hover:bg-gray-800'
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Menu Items */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 max-w-6xl mx-auto mb-12">
//           {currentMenu.map((item, index) => (
//             <div key={index} className="flex gap-6 group">
//               {/* Image */}
//               <div className="relative flex-shrink-0">
//                 <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-700 group-hover:border-amber-600 transition-all duration-300">
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                 </div>
//                 {item.badge && (
//                   <div className="absolute -top-2 -right-2 bg-amber-600 text-black text-xs font-bold px-2 py-1 rounded">
//                     {item.badge}
//                   </div>
//                 )}
//               </div>

//               {/* Content */}
//               <div className="flex-1">
//                 <div className="flex items-start justify-between mb-2">
//                   <h3 className="text-xl font-semibold text-white group-hover:text-amber-500 transition-colors duration-300">
//                     {item.name}
//                   </h3>
//                   <div className="flex items-center gap-2 ml-4">
//                     <div className="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent min-w-[40px]"></div>
//                     <span className="text-amber-500 font-bold text-lg whitespace-nowrap">
//                       {item.price}
//                     </span>
//                   </div>
//                 </div>
//                 <p className="text-gray-400 text-sm leading-relaxed">
//                   {item.description}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Operating Hours */}
//         <div className="text-center mb-8">
//           <p className="text-gray-400">
//             During winter daily from <span className="text-amber-500 font-semibold">7:00 pm</span> to{' '}
//             <span className="text-amber-500 font-semibold">9:00 pm</span>
//           </p>
//         </div>

//         {/* View All Button */}
//         <div className="text-center">
//           <button className="px-8 py-3 border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-black font-semibold tracking-wider transition-all duration-300">
//             VIEW ALL MENU
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default MenuSection;













import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  image: string;
  name: string;
  price: string;
  description: string;
  badge: string | null;
  slug: string;
}

const MenuSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('morning');
  const navigate = useNavigate();
  const menuTabs = [
    { id: 'morning', label: 'MORNING' },
    { id: 'weekday', label: 'WEEKDAY LUNCH' },
    { id: 'dinner', label: 'DINNER' },
    { id: 'wines', label: 'WINES' }
  ];

  const menuItems: Record<string, MenuItem[]> = {
    morning: [
      {
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=300&q=80',
        name: 'Greek Salad',
        price: '$25.50',
        description: 'Tomatoes, green bell pepper, sliced cucumber onion, olives, and feta cheese.',
        badge: null,
        slug: 'greek-salad'
      },
      {
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=300&q=80',
        name: 'Lasagne',
        price: '$40.00',
        description: 'Vegetables, cheeses, ground meats, tomato sauce, seasonings and spices',
        badge: 'SEASONAL',
        slug: 'lasagne'
      },
      {
        image: 'https://images.unsplash.com/photo-1630851840633-30e2d3f14c17?auto=format&fit=crop&w=300&q=80',
        name: 'Butternut Pumpkin',
        price: '$10.00',
        description: 'Typesetting industry lorem ipsum is simply dummy text of the priand.',
        badge: null,
        slug: 'butternut-pumpkin'
      }
    ],
    dinner: [
      {
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
        name: 'Tokusen Wagyu',
        price: '$39.00',
        description: 'Vegetables, cheeses, ground meats, tomato sauce, seasonings and spices.',
        badge: 'NEW',
        slug: 'tokusen-wagyu'
      },
      {
        image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=300&q=80',
        name: 'Olivas Rellenas',
        price: '$25.00',
        description: 'Avocados with crab meat, red onion, crab salad stuffed red bell pepper and green bell pepper.',
        badge: null,
        slug: 'olivas-rellenas'
      },
      {
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=300&q=80',
        name: 'Opu Fish',
        price: '$49.00',
        description: 'Vegetables, cheeses, ground meats, tomato sauce, seasonings and spices',
        badge: null,
        slug: 'opu-fish'
      }
    ]
  };

  const currentMenu = activeTab === 'dinner' ? menuItems.dinner : menuItems.morning;

  const handleItemClick = (item: MenuItem) => {
      // Store item data in sessionStorage
      sessionStorage.setItem('selectedMenuItem', JSON.stringify(item));
      
      // Navigate to dish detail page
      navigate(`/client/dish/${item.slug}`);
    };

  return (
    <section className="relative py-20 px-4 bg-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none" className="text-amber-600">
              <path d="M10 20L5 10L10 5L15 10L10 20Z" fill="currentColor"/>
              <path d="M30 20L25 10L30 5L35 10L30 20Z" fill="currentColor"/>
              <path d="M50 20L45 10L50 5L55 10L50 20Z" fill="currentColor"/>
            </svg>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-2">
            Delicious Menu
          </h2>
        </div>

        {/* Menu Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex border-t border-b border-amber-600 divide-x divide-amber-600">
            {menuTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 text-sm tracking-wider font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-amber-600 text-black'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 max-w-6xl mx-auto mb-12">
          {currentMenu.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              className="flex gap-6 group text-left w-full cursor-pointer"
            >
              {/* Image */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-700 group-hover:border-amber-600 transition-all duration-300">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {item.badge && (
                  <div className="absolute -top-2 -right-2 bg-amber-600 text-black text-xs font-bold px-2 py-1 rounded">
                    {item.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white group-hover:text-amber-500 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent min-w-[40px]"></div>
                    <span className="text-amber-500 font-bold text-lg whitespace-nowrap">
                      {item.price}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Operating Hours */}
        <div className="text-center mb-8">
          <p className="text-gray-400">
            During winter daily from <span className="text-amber-500 font-semibold">7:00 pm</span> to{' '}
            <span className="text-amber-500 font-semibold">9:00 pm</span>
          </p>
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button className="px-8 py-3 border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-black font-semibold tracking-wider transition-all duration-300">
            VIEW ALL MENU
          </button>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;