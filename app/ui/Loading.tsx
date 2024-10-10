'use client'

import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-[200px]">
      <Spin indicator={antIcon} tip="加载中..." />
    </div>
  );
}