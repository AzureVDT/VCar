import { SecurityScanOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Row, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";

const Confirmation = ({ onRent, handleCheckboxChange }: {
    onRent: () => void,
    handleCheckboxChange: (e: CheckboxChangeEvent) => void
}) => {
    return (
        <div className="p-6 rounded-lg shadow-md bg-lite">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Typography.Title className="m-0" level={5}>
                        Xác nhận
                    </Typography.Title>
                    <Typography.Text className="text-sm text-custom-blue">Chúng tôi sắp hoàn thành. Chỉ vài cú nhấp chuột nữa và việc thuê xe của bạn sẽ sẵn sàng!</Typography.Text>
                </div>
                <Typography.Text className="text-sm text-custom-blue">Bước 4 của 4</Typography.Text>
            </div>
            <Row gutter={[0, 24]}>
                <Col span={24}>
                    <div className="w-full h-[56px] rounded-lg bg-grayf6 mt-4 px-8 py-4 font-medium">
                        <Checkbox>Tôi đồng ý nhận email tiếp thị và bản tin!</Checkbox>
                    </div>
                </Col>
                <Col span={24}>
                    <div className="w-full h-[56px] rounded-lg bg-grayf6 mt-4 px-8 py-4 font-medium">
                        <Checkbox onChange={handleCheckboxChange}>Tôi đồng ý với các điều khoản và điều kiện và chính sách bảo mật.</Checkbox>
                    </div>
                </Col>
            </Row>
            <Button type="primary" className="mt-8" onClick={onRent}>Thuê ngay</Button>
            <div className="mt-8">
                <SecurityScanOutlined className="mb-4 text-2xl" />
                <Typography.Title level={5}>Tất cả dữ liệu của bạn đều an toàn</Typography.Title>
                <Typography.Text className="text-sm text-custom-blue">Chúng tôi đang sử dụng công nghệ bảo mật tiên tiến nhất để mang đến cho bạn trải nghiệm tốt nhất.</Typography.Text>
            </div>
        </div>
    );
};

export default Confirmation;