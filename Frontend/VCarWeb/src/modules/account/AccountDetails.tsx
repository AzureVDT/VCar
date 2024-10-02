import { Button, Col, Divider, Flex, Form, Input, message, Row, Typography, Upload, UploadFile } from "antd";
import ImageUploader from "../../components/common/ImageUploader";
import { getAccessToken, getUserInfoFromCookie, handleRecognizeCitizenIdentification, handleRecognizeLicensePlate, handleUploadFile, saveUserInfoToCookie } from "../../utils";
import { EditOutlined, SlidersOutlined, UploadOutlined } from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";
import UpdateProfileModal from "../../components/modals/UpdateProfileModal";
import { useState, useEffect, useMemo } from "react";
import { UploadProps } from "antd/es/upload";
import { useDispatch } from "react-redux";
import { getMe, updateCitizenLicense, updateLicense } from "../../store/profile/handlers";

const AccountDetails = () => {
    const dispatch = useDispatch();
    const [openUpdateProfileModal, setOpenUpdateProfileModal] = useState(false);
    const [onEdit, setOnEdit] = useState(false);
    const [onEditIdentification, setOnEditIdentification] = useState(false);
    const userInfo = getUserInfoFromCookie();
    const [imageUrl, setImageUrl] = useState<string | null>(userInfo?.car_license?.license_image_url || null);
    const [identificationImageUrl, setIdentificationImageUrl] = useState<string | null>(userInfo?.citizen_identification?.citizen_identification_image || null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [fileListIdentification, setFileListIdentification] = useState<UploadFile[]>([]);
    const [updateLicenseLoading, setUpdateLicenseLoading] = useState(false);
    const [updateIdentificationLoading, setUpdateIdentificationLoading] = useState(false);
    const [refetchMe, setRefetchMe] = useState(false);

    const handleChange: UploadProps["onChange"] = ({ fileList }) => {
        setFileList(fileList);
        if (fileList.length > 0) {
            const file = fileList[0].originFileObj as File;
            const newImageUrl = URL.createObjectURL(file);
            setImageUrl(newImageUrl);
        } else {
            setImageUrl(null);
        }
    };

    const handleChangeIdentification: UploadProps["onChange"] = ({ fileList }) => {
        console.log(fileList);
        setFileListIdentification(fileList);
        if (fileList.length > 0) {
            const file = fileList[0].originFileObj as File;
            const newImageUrl = URL.createObjectURL(file);
            setIdentificationImageUrl(newImageUrl);
        } else {
            setIdentificationImageUrl(null);
        }
    }

    const handleUpdateCitizenIdentification = async () => {
        setUpdateIdentificationLoading(true);
        const formData = new FormData();

        if (fileListIdentification.length > 0) {
            const file = fileListIdentification[0].originFileObj as File;
            formData.append("file", file);
            formData.append(
                "upload_preset",
                import.meta.env.VITE_CLOUDINARY_PRESET_NAME || ""
            );
            formData.append("public_id", file.name);
            formData.append("folder", `users/${userInfo?.id}/citizen_identification`);

            // First, upload the file to Cloudinary
            const imageUrl = await handleUploadFile(formData, dispatch);

            if (imageUrl) {
                console.log("Upload success");

                // Prepare data for driver's license recognition API
                const recognitionData = new FormData();
                recognitionData.append("image", file);

                // Send the image URL to the license recognition API
                const res = await handleRecognizeCitizenIdentification(recognitionData);
                let dob = res?.data?.dob || "";
                if (dob) {
                    const [day, month, year] = dob.split('/');
                    dob = `${year}-${month}-${day}`;
                }
                let doe = res?.data?.doe || "";
                if (doe) {
                    const [day, month, year] = doe.split('/');
                    doe = `${year}-${month}-${day}`;
                }
                const updateResponse = await updateCitizenLicense({
                    identification_number: res?.data?.id || "",
                    issued_date: doe,
                    issued_location: res?.data?.address_entities?.province || "",
                    permanent_address: res?.data?.address || "",
                    contact_address: res?.data?.address || "",
                    identification_image_url: imageUrl,
                })
                if (updateResponse?.success) {
                    setUpdateIdentificationLoading(false);
                    message.success("Update license success");
                    setOnEditIdentification(false);
                    setRefetchMe(!refetchMe);
                } else {
                    setUpdateIdentificationLoading(false);
                    message.error("Update license failed");
                }
            } else {
                setUpdateIdentificationLoading(false);
                message.error("Upload failed");
                console.log("Upload failed");
            }
        }
    }

    const handleUpdateLicense = async () => {
        setUpdateLicenseLoading(true);
        const formData = new FormData();

        if (fileList.length > 0) {
            const file = fileList[0].originFileObj as File;
            formData.append("file", file);
            formData.append(
                "upload_preset",
                import.meta.env.VITE_CLOUDINARY_PRESET_NAME || ""
            );
            formData.append("public_id", file.name);
            formData.append("folder", `users/${userInfo?.id}/car_license`);

            // First, upload the file to Cloudinary
            const imageUrl = await handleUploadFile(formData, dispatch);

            if (imageUrl) {
                console.log("Upload success");

                // Prepare data for driver's license recognition API
                const recognitionData = new FormData();
                recognitionData.append("image", file);

                // Send the image URL to the license recognition API
                const res = await handleRecognizeLicensePlate(recognitionData);
                let dob = res?.data?.dob || "";
                if (dob) {
                    const [day, month, year] = dob.split('/');
                    dob = `${year}-${month}-${day}`;
                }
                const updateResponse = await updateLicense({
                    id: res?.data?.id || "",
                    full_name: res?.data?.name || "",
                    dob: dob,
                    license_image_url: imageUrl,
                })
                if (updateResponse?.success) {
                    setUpdateLicenseLoading(false);
                    message.success("Update license success");
                    setOnEdit(false);
                    setRefetchMe(!refetchMe);
                } else {
                    setUpdateLicenseLoading(false);
                    message.error("Update license failed");
                }
            } else {
                setUpdateLicenseLoading(false);
                message.error("Upload failed");
                console.log("Upload failed");
            }
        }
    };

    const handleRemove = () => {
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
        }
        setImageUrl(null);
    };

    useMemo(() => {
        async function fetchMe() {
            const accessToken = getAccessToken();
            const res = await getMe();
            if (res?.success && res?.data) {
                saveUserInfoToCookie(res?.data, accessToken || '');
            }
        }
        fetchMe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetchMe])

    const handleRemoveIdentification = () => {
        if (identificationImageUrl) {
            URL.revokeObjectURL(identificationImageUrl);
        }
        setIdentificationImageUrl(null);
    }

    useEffect(() => {
        return () => {
            // Clean up the object URL when the component unmounts
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
            if (identificationImageUrl) {
                URL.revokeObjectURL(identificationImageUrl);
            }
        };
    }, [identificationImageUrl, imageUrl]);

    return (
        <>
            <Row gutter={[0, 16]}>
                <Col span={24} className="px-8 py-6 rounded-lg shadow-md bg-lite">
                    <Row gutter={[0, 16]}>
                        <Col span={24}>
                            <Flex align="center" justify="space-between">
                                <Flex gap={4}>
                                    <Typography.Title level={3}>Thông tin tài khoản</Typography.Title>
                                    <Button icon={<EditOutlined />} type="text" onClick={() => setOpenUpdateProfileModal(true)}></Button>
                                </Flex>
                                <Flex align="center" gap={4} className="inline-flex px-4 py-2 border rounded-lg border-text3">
                                    <SlidersOutlined className="text-lg" />
                                    <Typography.Text className="text-3xl font-bold text-primary">0</Typography.Text>
                                    <Typography.Text className="text-text3">chuyến</Typography.Text>
                                </Flex>
                            </Flex>
                        </Col>
                        <Col span={6}>
                            <Flex gap={12} vertical align="center">
                                <ImageUploader></ImageUploader>
                                <Typography.Title level={5}>{userInfo?.display_name}</Typography.Title>
                                <Typography.Text>Tham gia: 05/09/2024</Typography.Text>
                            </Flex>
                        </Col>
                        <Col span={18}>
                            <Row gutter={[0, 16]}>
                                <Col span={24}>
                                    <Flex align="center" justify="space-between">
                                        <Typography.Text>Ngày sinh</Typography.Text>
                                        <Typography.Text>{userInfo?.car_license?.dob}</Typography.Text>
                                    </Flex>
                                </Col>
                                <Col span={24}>
                                    <Flex align="center" justify="space-between">
                                        <Typography.Text>Giới tính</Typography.Text>
                                        <Typography.Text>Nam</Typography.Text>
                                    </Flex>
                                </Col>
                                <Divider className="m-0"></Divider>
                                <Col span={24}>
                                    <Flex align="center" justify="space-between">
                                        <Typography.Text>Email</Typography.Text>
                                        <Typography.Text>{userInfo?.email}</Typography.Text>
                                    </Flex>
                                </Col>
                                <Col span={24}>
                                    <Flex align="center" justify="space-between">
                                        <Typography.Text>Số điện thoại</Typography.Text>
                                        <Typography.Text>{userInfo?.phone_number}</Typography.Text>
                                    </Flex>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col span={24} className="px-8 py-6 rounded-lg shadow-md bg-lite">
                    <Row gutter={[0, 16]}>
                        <Col span={24}>
                            <Flex align="center" justify="space-between">
                                <Flex gap={4}>
                                    <Typography.Title level={3}>Giấy phép lái xe</Typography.Title>
                                </Flex>
                                {!onEdit && (<Button icon={<EditOutlined />} type="dashed" onClick={() => setOnEdit(true)}>Chỉnh sửa</Button>)}
                                {onEdit && (<Flex gap={4} align="center">
                                    <Button type="default" onClick={() => setOnEdit(false)}>Hủy</Button>
                                    <Button type="primary" onClick={handleUpdateLicense} loading={updateLicenseLoading}>Cập nhật</Button>
                                </Flex>)}
                            </Flex>
                        </Col>
                        <Col span={12}>
                            <Flex gap={5} align="center" className="mb-5">
                                <Typography.Title style={{
                                    marginBottom: 0
                                }} level={4}>Hình ảnh</Typography.Title>
                                <Upload
                                    fileList={fileList}
                                    onChange={handleChange}
                                    beforeUpload={() => false}
                                    maxCount={1}
                                    onRemove={handleRemove}
                                    disabled={!onEdit}
                                >
                                    {fileList.length < 1 && (
                                        <Button icon={<UploadOutlined />}>Select File</Button>
                                    )}
                                </Upload>
                            </Flex>
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    style={{ width: '400px', height: '260px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                            )}
                        </Col>
                        <Col span={12}>
                            <Form layout="vertical">
                                <Typography.Title level={4}>Thông tin chung</Typography.Title>
                                <Form.Item label="Số GPLX">
                                    <Input placeholder="Nhập số GPLX đã cấp" disabled value={userInfo?.car_license?.id} />
                                </Form.Item>
                                <Form.Item label="Họ và tên">
                                    <Input placeholder="Nhập đầy đủ họ tên" disabled value={userInfo?.car_license?.full_name} />
                                </Form.Item>
                                <Form.Item label="Ngày sinh">
                                    <Input placeholder="Nhập ngày sinh" disabled value={userInfo?.car_license?.dob} />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Col>
                <Col span={24} className="px-8 py-6 rounded-lg shadow-md bg-lite">
                    <Row gutter={[0, 16]}>
                        <Col span={24}>
                            <Flex align="center" justify="space-between">
                                <Typography.Title level={3}>Căn cước công dân</Typography.Title>
                                {!onEditIdentification && (<Button icon={<EditOutlined />} type="dashed" onClick={() => setOnEditIdentification(true)}>Chỉnh sửa</Button>)}
                                {onEditIdentification && (
                                    <Flex gap={4} align="center">
                                        <Button type="default" onClick={() => setOnEditIdentification(false)}>Hủy</Button>
                                        <Button type="primary" loading={updateIdentificationLoading} onClick={handleUpdateCitizenIdentification}>Cập nhật</Button>
                                    </Flex>
                                )}
                            </Flex>
                        </Col>
                        <Col span={12}>
                            <Flex gap={5} align="center" className="mb-5">
                                <Typography.Title style={{ marginBottom: 0 }} level={4}>Hình ảnh</Typography.Title>
                                <Upload
                                    fileList={fileListIdentification}
                                    onChange={handleChangeIdentification}
                                    beforeUpload={() => false}
                                    maxCount={1}
                                    onRemove={handleRemoveIdentification}
                                    disabled={!onEditIdentification}
                                >
                                    {fileList.length < 1 && (
                                        <Button icon={<UploadOutlined />}>Select File</Button>
                                    )}
                                </Upload>
                            </Flex>
                            {identificationImageUrl && (
                                <img
                                    src={identificationImageUrl}
                                    alt="Preview"
                                    style={{ width: '400px', height: '260px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                            )}
                        </Col>
                        <Col span={12}>
                            <Form layout="vertical">
                                <Typography.Title level={4}>Thông tin căn cước</Typography.Title>
                                <Form.Item label="Số căn cước">
                                    <Input placeholder="Nhập số căn cước" disabled value={userInfo?.citizen_identification?.citizen_identification_number} />
                                </Form.Item>
                                <Form.Item label="Ngày cấp">
                                    <Input placeholder="Nhập ngày cấp" disabled value={userInfo?.citizen_identification?.issued_date} />
                                </Form.Item>
                                <Form.Item label="Nơi cấp">
                                    <Input placeholder="Nhập nơi cấp" disabled value={userInfo?.citizen_identification?.issued_location} />
                                </Form.Item>
                                <Form.Item label="Địa chỉ thường trú">
                                    <Input placeholder="Nhập địa chỉ thường trú" disabled value={userInfo?.citizen_identification?.permanent_address} />
                                </Form.Item>
                                <Form.Item label="Địa chỉ liên hệ">
                                    <Input placeholder="Nhập địa chỉ liên hệ" disabled value={userInfo?.citizen_identification?.contact_address} />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal title="Cập nhật thông tin cá nhân" footer={false} open={openUpdateProfileModal} onCancel={() => setOpenUpdateProfileModal(false)}>
                <UpdateProfileModal refetchMe={refetchMe} setRefetchMe={setRefetchMe} setOpenUpdateProfileModal={setOpenUpdateProfileModal}></UpdateProfileModal>
            </Modal>
        </>
    );
};

export default AccountDetails;