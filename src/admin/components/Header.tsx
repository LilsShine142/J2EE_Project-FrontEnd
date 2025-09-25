import React from 'react';
import { FiArrowLeft, FiBell } from 'react-icons/fi';
import { Avatar, Breadcrumb, Button, Space, Badge, Input } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

const { Search } = Input;

const Header: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-4 px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
      
      {/* Top Row: Search and User Actions */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Bar - Responsive */}
        <Search
          placeholder="Search..."
          allowClear
          size="large"
          className="w-full lg:w-[400px] rounded-lg border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
          onSearch={(value) => console.log(value)}
        />
        
        {/* User Actions */}
        <Space size="middle" align="center" className="flex-shrink-0">
          <Badge 
            count={5} 
            size="small" 
            className="cursor-pointer transform hover:scale-105 transition-transform"
            style={{ 
              fontSize: '12px',
              height: '18px',
              minWidth: '18px',
              lineHeight: '18px',
              boxShadow: '0 0 0 2px white'
            }}
          >
            <Button
              type="text"
              icon={<FiBell className="w-5 h-5 text-gray-600" />}
              shape="circle"
              size="large"
              className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 w-10 h-10 flex items-center justify-center border border-gray-100"
            />
          </Badge>
          <Avatar
            size={44}
            src="https://joeschmoe.io/api/v1/random"
            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 transform hover:scale-105"
            icon={<UserOutlined />}
          />
        </Space>
      </div>

      {/* Bottom Row: Breadcrumb and Navigation */}
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<FiArrowLeft className="text-gray-600 text-lg" />}
            shape="circle"
            size="large"
            className="hover:bg-gray-100 transition-colors w-9 h-9 flex items-center justify-center border border-gray-200 hover:border-gray-300"
          />
          
          <Breadcrumb
            separator={<span className="text-gray-400">/</span>}
            className="text-gray-700 text-base hidden sm:block"
            items={[
              {
                title: (
                  <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <HomeOutlined className="text-gray-500 text-base" />
                    <span className="ml-1 font-medium">Home</span>
                  </div>
                ),
                href: '#',
              },
              {
                title: (
                  <span className="text-gray-600 font-medium hover:text-blue-600 transition-colors">
                    User Profile
                  </span>
                ),
                href: '#',
              },
              {
                title: (
                  <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-md">
                    Details
                  </span>
                ),
              },
            ]}
          />
        </div>
        
        {/* Optional: Add additional actions or info here */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Last updated: Just now</span>
        </div>
      </div>
    </div>
  );
};

export default Header;