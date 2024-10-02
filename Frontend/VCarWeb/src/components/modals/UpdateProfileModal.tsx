import { Button, Form, Input, message } from "antd";
import { updateProfile } from "../../store/profile/handlers";
import { getAccessToken, saveUserInfoToCookie } from "../../utils";
import { useState } from "react";

interface FieldType {
    display_name: string;
    phone_number: string;
}

const UpdateProfileModal = ({ setOpenUpdateProfileModal, refetchMe, setRefetchMe }: {
    setOpenUpdateProfileModal: (value: boolean) => void;
    refetchMe: boolean;
    setRefetchMe: (value: boolean) => void;
}) => {

    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const accessToken = getAccessToken();
    const onFinish = async (values: FieldType) => {
        setLoading(true);
        const response = await updateProfile(values);
        if (response?.success && response?.data) {
            saveUserInfoToCookie(response?.data, accessToken || '');
            message.success('Cập nhật thông tin thành công');
            setOpenUpdateProfileModal(false);
            setLoading(false);
            setRefetchMe(!refetchMe);
        } else {
            message.error('Cập nhật thông tin thất bại');
            setLoading(false);
        }
    };
    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <Form.Item<FieldType>
                label="Tên hiển thị"
                name="display_name"
                rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                    { pattern: /^[a-zA-Z ]{1,}$/, message: "Tên không hợp lệ" }
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Số điện thoại"
                name="phone_number"
                rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" }
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full" loading={loading}>Cập nhật</Button>
            </Form.Item>
        </Form>
    );
};

export default UpdateProfileModal;