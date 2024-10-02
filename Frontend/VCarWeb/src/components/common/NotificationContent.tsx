import { Avatar, Divider, Empty, Typography } from "antd";
import { DEFAULT_AVATAR } from "../../config/apiConfig";

const NotificationContent = () => {
    return (
        <div className="w-[432px] h-auto max-h-[445px] overflow-auto">
            <Divider className="my-2"></Divider>
            {Array.from({ length: 2 }).map((_, index) => (
                <div className="flex items-start px-4 py-2 gap-x-2" key={index}>
                    <Avatar src={DEFAULT_AVATAR} alt="avatar" className="w-[56px] h-[56px] object-cover"></Avatar>
                    <div className="flex flex-col">
                        <Typography.Title level={5} className="mb-1">Thong Dinh</Typography.Title>
                        <Typography.Text>Chào mừng bạn đến với VCar</Typography.Text>
                        <Typography.Text className="font-medium text-custom-blue">1 giờ trước</Typography.Text>
                    </div>
                </div>
            ))}
            {/* <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty> */}
        </div>
    );
};

export default NotificationContent;