import { Col, Input, Row, Typography } from "antd";
import { IUser } from "../../store/auth/types";

const BillingInfo = ({ userInfo }: {
    userInfo: IUser
}) => {
    return (
        <div className="p-6 rounded-lg shadow-md bg-lite">
            <div className="flex items-center justify-between mb-8">
                <Typography.Title className="m-0" level={5}>
                    Thông tin thanh toán
                </Typography.Title>
                <Typography.Text className="text-sm text-custom-blue">Step 1 of 4</Typography.Text>
            </div>
            <Row gutter={[32, 24]}>
                <Col span={12}>
                    <Typography.Text className="font-medium">Tên</Typography.Text>
                    <Input className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" disabled value={userInfo?.display_name}></Input>
                </Col>
                <Col span={12}>
                    <Typography.Text className="font-medium">Số điện thoại</Typography.Text>
                    <Input className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" disabled value={userInfo?.phone_number}></Input>
                </Col>
                <Col span={12}>
                    <Typography.Text className="font-medium">Mail</Typography.Text>
                    <Input className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" disabled value={userInfo?.email}></Input>
                </Col>
                <Col span={12}>
                    <Typography.Text className="font-medium">Địa chỉ</Typography.Text>
                    <Input className="w-full h-[56px] rounded-lg bg-grayf6 mt-4" disabled value={"12 District, Ho Chi Minh City"}></Input>
                </Col>
            </Row>
        </div>
    );
};

export default BillingInfo;