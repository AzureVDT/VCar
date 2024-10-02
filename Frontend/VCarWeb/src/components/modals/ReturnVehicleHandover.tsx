import { useRef, useState } from 'react';
import { Col, DatePicker, Row, Form, Input, Select, Button, Tag, Space, message, FormProps, FormInstance, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
import SignatureCanvas from 'react-signature-canvas';
import { convertDateToTimestamp, getUserInfoFromCookie, handleMetaMaskSignature, handleUploadSignature } from '../../utils';
import { useDispatch } from 'react-redux';
import { IVehicleHandoverResponseData, ReturnHandoverFieldTypes } from '../../store/rental/types';
import { lesseeReturnVehicle } from '../../store/rental/handlers';

const ReturnVehicleHandover = ({ form, vehicle_handover_id, setReturnVehicleLoading, setVehicleHandover }: {
    form: FormInstance<ReturnHandoverFieldTypes>
    vehicle_handover_id: string
    setReturnVehicleLoading: (loading: boolean) => void
    setVehicleHandover: (data: IVehicleHandoverResponseData) => void
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userInfo = getUserInfoFromCookie();
    const [damages, setDamages] = useState<string[]>([]);
    const [damageInput, setDamageInput] = useState<string>('');
    const [returnedItems, setReturnedItems] = useState<string[]>([]);
    const [returnedItemInput, setReturnedItemInput] = useState<string>('');
    const sigCanvas = useRef<SignatureCanvas>(null);

    const addDamage = () => {
        if (damageInput.trim()) {
            setDamages([...damages, damageInput]);
            setDamageInput('');
        }
    };

    const removeDamage = (index: number) => {
        setDamages(damages.filter((_, i) => i !== index));
    };

    const addReturnedItem = () => {
        if (returnedItemInput.trim()) {
            setReturnedItems([...returnedItems, returnedItemInput]);
            setReturnedItemInput('');
        }
    };

    const removeReturnedItem = (index: number) => {
        setReturnedItems(returnedItems.filter((_, i) => i !== index));
    };

    const onFinish = async (values: ReturnHandoverFieldTypes) => {
        console.log("onFinish ~ values:", values)
        setReturnVehicleLoading(true);
        if (sigCanvas?.current) {
            const imageUrl = await handleUploadSignature(sigCanvas, dispatch, vehicle_handover_id, userInfo.id, setReturnVehicleLoading);
            if (imageUrl) {
                const signatureResult = await handleMetaMaskSignature(userInfo.id);
                if (!signatureResult) {
                    message.error('Failed to sign the document');
                    return;
                }
                const digital_signature = {
                    signature: signatureResult.signature,
                    message: signatureResult.msg,
                    address: signatureResult.account,
                    signature_url: imageUrl
                };
                const requestBody = {
                    ...values,
                    return_date: convertDateToTimestamp(values.return_date),
                    damages,
                    returned_items: returnedItems,
                    digital_signature
                };
                const response = await lesseeReturnVehicle(requestBody, vehicle_handover_id);
                if (response?.success) {
                    setVehicleHandover(response?.data as IVehicleHandoverResponseData);
                    setReturnVehicleLoading(false);
                    message.success('Create return vehicle handover successfully');
                } else {
                    setReturnVehicleLoading(false);
                    message.error('Failed to create return vehicle handover');
                }
            } else {
                setReturnVehicleLoading(false);
                message.error('Failed to upload signature');
            }
        } else {
            message.error('Failed to get signature');
            setReturnVehicleLoading(false);
        }
        setReturnVehicleLoading(false);
    };

    const onFinishFailed: FormProps<ReturnHandoverFieldTypes>["onFinishFailed"] = (
        errorInfo
    ) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Form.Item<ReturnHandoverFieldTypes>
                        name="return_date"
                        label="Thời gian trả xe"
                        required
                        rules={[{
                            required: true,
                            message: t("require"),
                        }]}>
                        <DatePicker showTime />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item<ReturnHandoverFieldTypes>
                        name="vehicle_condition"
                        label="Tình trạng xe"
                        required
                        rules={[{
                            required: true,
                            message: t("require"),
                        }]}>
                        <Select className="w-full">
                            <Option value="normal">Bình thường</Option>
                            <Option value="damage">Hư hỏng</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item<ReturnHandoverFieldTypes>
                        name="odometer_reading"
                        label="Số km đã đi"
                        required
                        rules={[{
                            required: true,
                            message: t("require"),
                        }]}>
                        <Input type="number" placeholder="Nhập số km đã đi" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item<ReturnHandoverFieldTypes>
                        name="fuel_level"
                        label="Mức nhiên liệu"
                        required
                        rules={[{
                            required: true,
                            message: t("require"),
                        }]}>
                        <Input type="number" placeholder="Nhập mức nhiên liệu" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item<ReturnHandoverFieldTypes>
                        name="personal_items"
                        label="Đồ dùng cá nhân">
                        <Input placeholder="Nhập đồ dùng cá nhân" />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item<ReturnHandoverFieldTypes>
                        name={"condition_matches_initial"}
                        required
                        label="Tình trạng xe trả khớp với tình trạng ban đầu"
                        valuePropName="checked"
                        rules={[{
                            required: true,
                            message: t("require"),
                        }]}
                    >
                        <Checkbox></Checkbox>
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="Thiệt hại" className="overflow-auto max-h-32">
                        <Space direction="horizontal" wrap className="w-full">
                            {damages.map((damage, index) => (
                                <Tag
                                    key={index}
                                    closable
                                    onClose={() => removeDamage(index)}
                                    color='#f50'>
                                    {damage}
                                </Tag>
                            ))}
                        </Space>
                        <Space direction="horizontal" className={`${damages?.length > 0 ? 'mt-2' : ''} w-full`}>
                            <Input
                                value={damageInput}
                                onChange={(e) => setDamageInput(e.target.value)}
                                placeholder="Nhập thiệt hại"
                                className="w-full"
                            />
                            <Button type="dashed" onClick={addDamage} icon={<PlusOutlined />}>
                                Thêm thiệt hại
                            </Button>
                        </Space>
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="Tài sản trả lại">
                        <Space direction="horizontal" wrap className="w-full">
                            {returnedItems.map((item, index) => (
                                <Tag
                                    key={index}
                                    closable
                                    onClose={() => removeReturnedItem(index)}
                                    color='#2db7f5'>
                                    {item}
                                </Tag>
                            ))}
                        </Space>
                        <Space direction="horizontal" className={`${returnedItems?.length > 0 ? 'mt-2' : ''} w-full`}>
                            <Input
                                value={returnedItemInput}
                                onChange={(e) => setReturnedItemInput(e.target.value)}
                                placeholder="Nhập tài sản trả lại"
                                className="w-full"
                            />
                            <Button type="dashed" onClick={addReturnedItem} icon={<PlusOutlined />}>
                                Thêm tài sản
                            </Button>
                        </Space>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label="Chữ ký bàn giao"
                        required
                        rules={[{
                            required: true,
                            message: t("require"),
                        }]}
                    >
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="black"
                            canvasProps={{
                                className: 'sigCanvas',
                                width: 400,
                                height: 150,
                                style: { border: '1px solid #000' }
                            }}
                        />
                        <Button onClick={() => sigCanvas.current?.clear()} type='text'>Xóa chữ ký</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form >
    );
};

export default ReturnVehicleHandover;
