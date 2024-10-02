import { Col, Divider, Image, Rate, Row, Typography } from "antd";
import { formatPrice } from "../../utils";
import { ICar } from "../../store/car/types";
import { DEFAULT_AVATAR } from "../../config/apiConfig";

const RentalSummary = ({ car, totalDays }: {
    car: ICar,
    totalDays: number
}) => {
    return (
        <div className="p-6 rounded-lg shadow-md bg-lite">
            <Typography.Title level={5}>Tóm tắt thuê xe</Typography.Title>
            <Typography.Paragraph className="text-sm text-custom-blue">Giá có thể thay đổi tùy thuộc vào thời gian thuê và giá của xe thuê của bạn.</Typography.Paragraph>
            <Row justify={"center"} gutter={[16, 0]}>
                <Col span={8}>
                    <Image preview={false} src={car?.image_url[0] ?? DEFAULT_AVATAR} alt={car?.name} className="object-contain w-full h-full rounded-lg"></Image>
                </Col>
                <Col span={16}>
                    <Typography.Title level={4}>{car?.name}</Typography.Title>
                    <Row justify={"center"} align={"middle"}>
                        <Col span={14}>
                            <Rate disabled defaultValue={car?.average_rating} className="text-lg"></Rate>
                        </Col>
                        <Col span={10}>
                            <Typography.Text className="text-sm font-normal">440+ Đánh giá</Typography.Text>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Divider></Divider>
            <div className="flex items-center justify-between">
                <Typography.Text className="text-custom-blue">Đơn giá</Typography.Text>
                <Typography.Text>{formatPrice(car?.daily_rate)} VNĐ</Typography.Text>
            </div>
            <div className="flex items-center justify-between mt-6">
                <Typography.Text className="text-custom-blue">Thuế</Typography.Text>
                <Typography.Text>0 VNĐ</Typography.Text>
            </div>
            <div className="w-full h-[56px] bg-grayf6 px-8 py-4 flex items-center justify-between rounded-lg my-8">
                <Typography.Text className="text-sm text-custom-blue">Áp dụng mã khuyến mãi</Typography.Text>
                <Typography.Text className="text-sm font-medium cursor-pointer">Áp dụng ngay</Typography.Text>
            </div>
            <Row>
                <Col span={16}>
                    <Typography.Title level={5}>Tổng giá thuê xe</Typography.Title>
                    <Typography.Text className="text-sm text-custom-blue">Giá tổng thể và bao gồm giảm giá thuê xe</Typography.Text>
                </Col>
                <Col span={8}>
                    <Typography.Title className="text-right" level={4}>{formatPrice(car?.daily_rate * totalDays)} VNĐ</Typography.Title>
                </Col>
            </Row>
        </div>
    );
};

export default RentalSummary;