import React from "react";
import { Skeleton } from "antd";

const CarCardSkeleton: React.FC = () => {
    return (
        <div className="overflow-hidden bg-white rounded-lg shadow-md">
            <Skeleton.Image className="w-full h-64" active />
            <div className="p-4">
                <Skeleton active paragraph={{ rows: 2 }} />
                <div className="flex items-center justify-between mb-2 gap-x-2">
                    <Skeleton.Input style={{ width: 100 }} active size="small" />
                    <Skeleton.Input style={{ width: 100 }} active size="small" />
                    <Skeleton.Input style={{ width: 100 }} active size="small" />
                </div>
                <div className="flex items-center justify-between">
                    <Skeleton.Input style={{ width: 150 }} active size="small" />
                    <Skeleton.Button active size="small" />
                </div>
            </div>
        </div>
    );
};

export default CarCardSkeleton;