import { useRef, useState } from 'react';
import { Col, DatePicker, Row, Form, Input, Select, Button, Tag, Space, message, FormProps, FormInstance } from 'antd';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
import SignatureCanvas from 'react-signature-canvas';
import { convertDateToTimestamp, getUserInfoFromCookie, handleMetaMaskSignature, handleUploadSignature } from '../../utils';
import { useDispatch } from 'react-redux';
import { HandoverFieldTypes, IVehicleHandover, IVehicleHandoverResponseData } from '../../store/rental/types';
import { createVehicleHandover } from '../../store/rental/handlers';


const CreateVehicleHandover = ({ form, rental_contract_id, setCreateHandoverLoading, setVehicleHandover }: {
    form: FormInstance<HandoverFieldTypes>
    rental_contract_id: string
    setCreateHandoverLoading: (loading: boolean) => void
    setVehicleHandover: (data: IVehicleHandoverResponseData) => void
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userInfo = getUserInfoFromCookie();
    const [damages, setDamages] = useState<string[]>([]);
    const [damageInput, setDamageInput] = useState<string>('');
    const [collateral, setCollateral] = useState<{ type: string; details: string }[]>([]);
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

    const addCollateral = () => {
        setCollateral([...collateral, { type: '', details: '' }]);
    };

    const removeCollateral = (index: number) => {
        setCollateral(collateral.filter((_, i) => i !== index));
    };

    const onFinish = async (values: HandoverFieldTypes) => {
        setCreateHandoverLoading(true);

        if (sigCanvas?.current) {
            const imageUrl = await handleUploadSignature(sigCanvas, dispatch, rental_contract_id, userInfo.id, setCreateHandoverLoading);
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
                const requestBody: IVehicleHandover = {
                    ...values,
                    rental_contract_id,
                    handover_date: convertDateToTimestamp(values.handover_date).toString(),
                    initial_condition_normal: true,
                    digital_signature,
                }
                const response = await createVehicleHandover(requestBody);
                if (response?.success) {
                    setVehicleHandover(response?.data as IVehicleHandoverResponseData);
                    setCreateHandoverLoading(false);
                    message.success('Create vehicle handover successfully');
                } else {
                    setCreateHandoverLoading(false);
                    message.error('Failed to create vehicle handover');
                }
            } else {
                setCreateHandoverLoading(false);
                message.error('Failed to upload signature');
            }
        } else {
            message.error('Failed to get signature');
            setCreateHandoverLoading(false);
        }
    };

    const onFinishFailed: FormProps<HandoverFieldTypes>["onFinishFailed"] = (
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
                    <Form.Item
                        name="handover_date"
                        label="Thời gian bàn giao"
                        rules={[{
                            required: true,
                            message: t("require"),
                        }]}
                    >
                        <DatePicker showTime />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="vehicle_condition"
                        label="Tình trạng xe"
                        rules={[{
                            required: true,
                            message: t("require"),
                        }]}
                    >
                        <Select className="w-full">
                            <Option value="normal">Bình thường</Option>
                            <Option value="damage">Hư hỏng</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="odometer_reading"
                        label="Số km đã đi"
                        rules={[{
                            required: true,
                            message: t("require"),
                        }]}
                    >
                        <Input type="number" placeholder="Nhập số km đã đi" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="personal_items"
                        label="Đồ dùng cá nhân"
                    >
                        <Input placeholder="Nhập đồ dùng cá nhân" />
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
                                    className="flex items-center justify-between"
                                    color='#f50'
                                >
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
                    <Form.Item
                        label="Tài sản thế chấp"
                        rules={[{
                            required: true,
                            message: t("require"),
                        }]}
                    >
                        <Space direction="vertical" className="w-full">
                            {collateral.map((item, index) => (
                                <Tag
                                    key={index}
                                    closable
                                    onClose={() => removeCollateral(index)}
                                    className="flex items-center justify-between"
                                    closeIcon={<CloseCircleOutlined style={{ fontSize: '30px' }} />}
                                >
                                    <Input
                                        value={item.type}
                                        onChange={(e) => {
                                            const newCollateral = [...collateral];
                                            newCollateral[index].type = e.target.value;
                                            setCollateral(newCollateral);
                                        }}
                                        placeholder="Loại tài sản"
                                        className="w-full"
                                    />
                                    <Input
                                        value={item.details}
                                        onChange={(e) => {
                                            const newCollateral = [...collateral];
                                            newCollateral[index].details = e.target.value;
                                            setCollateral(newCollateral);
                                        }}
                                        placeholder="Chi tiết tài sản"
                                        className="w-full"
                                    />
                                </Tag>
                            ))}
                            <Button type="dashed" onClick={addCollateral} icon={<PlusOutlined />}>
                                Thêm tài sản thế chấp
                            </Button>
                        </Space>
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="Chữ ký bàn giao">
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

export default CreateVehicleHandover;