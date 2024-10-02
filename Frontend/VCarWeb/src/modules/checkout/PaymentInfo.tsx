import { Col, Image, Radio, RadioChangeEvent, Row, Typography } from "antd";

const PaymentInfo = ({
    paymentMethod,
    onChange
}: {
    paymentMethod: string,
    onChange: (e: RadioChangeEvent) => void
}) => {
    return (
        <div className="p-6 rounded-lg shadow-md bg-lite">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Typography.Title className="m-0" level={5}>
                        Phương thức thanh toán
                    </Typography.Title>
                    <Typography.Text className="text-sm text-custom-blue">Vui lòng chọn phương thức thanh toán của bạn</Typography.Text>
                </div>
                <Typography.Text className="text-sm text-custom-blue">Bước 3 của 4</Typography.Text>
            </div>
            <Row>
                <Radio.Group className="flex-1" onChange={onChange} value={paymentMethod}>
                    <Col span={24} className="mb-6">
                        <div className="flex items-center justify-between">
                            <Radio value={"VNPAY"} className="font-medium">VNPAY</Radio>
                            <Image preview={false} src="./vnpay.webp" className="w-full max-w-[100px] h-full max-h-6 object-cover ml-auto"></Image>
                        </div>
                    </Col>
                    <Col span={24} className="mb-6">
                        <div className="flex items-center justify-between">
                            <Radio value={"PAYPAL"} className="font-medium">PAYPAL</Radio>
                            <Image preview={false} src="./paypal.jpg" className="w-full max-w-[100px] h-full max-h-6 object-cover ml-auto"></Image>
                        </div>
                    </Col>
                    <Col span={24}>
                        <div className="flex items-center justify-between">
                            <Radio value={"BITCOIN"} className="font-medium">BITCOIN</Radio>
                            <Image preview={false} src="./bitcoin.jpg" className="w-full max-w-[100px] h-full max-h-6 object-cover ml-auto"></Image>
                        </div>
                    </Col>
                </Radio.Group>
            </Row>
        </div>
    );
};

export default PaymentInfo;