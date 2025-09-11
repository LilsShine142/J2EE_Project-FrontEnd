import React from 'react';
import { FiArrowLeft, FiHome, FiBell, FiSearch } from 'react-icons/fi';
import { Avatar, Breadcrumb, Button, Space, Badge, Input } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

const { Search } = Input;[]

const Header: React.FC = () => {
  return (
   <div className="flex flex-col w-full h-[10%] p-[1%] box-border">
      {/* Left side: Actions */}
      <Space size="large" align="center" className="space-x-6 justify-between">
        <Search
          placeholder="Search..."
          allowClear
          // style={{ width: 280 }}
          size="large"
          className="w-[400px] rounded-lg border-gray-300 focus-within:border-blue-500 focus-within:ring-blue-500 transition-all"
        />
        <Space size="middle" align="center">
          <Badge 
            count={5} 
            size="small" 
            className="cursor-pointer"
            style={{ 
              fontSize: '12px',
              height: '18px',
              minWidth: '18px',
              lineHeight: '18px'
            }}
          >
            <Button
              type="text"
              icon={<FiBell className="w-6 h-6 text-gray-600" />}
              shape="circle"
              size="large"
              className="hover:bg-gray-100 transition-colors w-12 h-12 flex items-center justify-center"
            />
          </Badge>
          <Avatar
            size={40}
            src="https://joeschmoe.io/api/v1/random"
            className="cursor-pointer hover:shadow-md transition-shadow border-2 border-gray-200"
          />
        </Space>
      </Space>
      {/* Breadcrumb and Navigation */}
      <div className="flex items-center space-x-6">
        <Button
          type="text"
          icon={<FiArrowLeft className="text-gray-600 text-lg" />}
          shape="circle"
          size="middle"
          className="hover:bg-gray-100 transition-colors w-10 h-10 flex items-center justify-center"
        />
        <Breadcrumb
          separator="/"
          className="text-gray-700 text-base"
          items={[
            {
              title: (
                <Space className="flex items-center">
                  <HomeOutlined className="text-gray-600 text-lg" />
                  <span className="ml-1">Home</span>
                </Space>
              ),
            },
            {
              title: <span className="text-gray-800">User Profile</span>,
            },
            {
              title: <span className="text-blue-600 font-semibold">Details</span>,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Header;