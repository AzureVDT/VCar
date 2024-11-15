import { Avatar, Button, Col, Divider, Modal, Row, Spin, Tag, Typography } from "antd";
import { IContractData, IVehicleHandoverResponseData } from "../../store/rental/types";
import RentalSummary from "../../modules/checkout/RentalSummary";
import { calculateDays, connectWallet, fetchImageFromUrl, getUserInfoFromCookie, getWalletBalance, handleMetaMaskSignature, handleUploadSignature, sendTransaction } from "../../utils";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_CAR_BY_ID } from "../../store/car/action";
import { RootState } from "../../store/store";
import { DEFAULT_AVATAR } from "../../config/apiConfig";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { getVehicleHandoverByContractId, lesseeApproveHandover, signContract } from "../../store/rental/handlers";
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import SignatureCanvas from 'react-signature-canvas';
import { message } from "antd";
import ReturnVehicleHandover from "./ReturnVehicleHandover";
import { useForm } from "antd/es/form/Form";
import ImageModule from 'docxtemplater-image-module-free';
import CreateReviewModal from "./CreateReviewModal";
import { useTranslation } from "react-i18next";

const LesseeContractModal = ({ record }: {
    record: IContractData;
}) => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false);
    const [vehicleHandover, setVehicleHandover] = useState<IVehicleHandoverResponseData>({} as IVehicleHandoverResponseData);
    const userInfo = getUserInfoFromCookie();
    const [signLoading, setSignLoading] = useState(false);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewHandoverLoading, setViewHandoverLoading] = useState(false);
    const numberOfDays = calculateDays(record?.rental_start_date, record?.rental_end_date);
    const { carDetail, loading: carLoading } = useSelector((state: RootState) => state.car);
    const [isSignaturePadVisible, setIsSignaturePadVisible] = useState(false);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [openReturnModal, setOpenReturnModal] = useState(false);
    const [returnHandoverForm] = useForm();

    const sigCanvas = useRef<SignatureCanvas>(null);
    const { car } = carDetail;
    const handleApproveVehicleHandover = async () => {
        setSignLoading(true);
        const signatureResult = await handleMetaMaskSignature(userInfo.id);
        if (!signatureResult) {
            message.error("Failed to get signature from MetaMask");
            setSignLoading(false);
            return;
        }
        const { account, signature, msg } = signatureResult;
        if (sigCanvas?.current) {
            const imageUrl = await handleUploadSignature(sigCanvas, dispatch, record?.id, userInfo.id, setLoading);
            if (imageUrl) {
                const response = await lesseeApproveHandover({
                    signature,
                    message: msg,
                    address: account,
                    signature_url: imageUrl
                }, vehicleHandover?.id);
                if (response?.success) {
                    message.success("Approved vehicle handover successfully");
                    setSignLoading(false);
                    setVehicleHandover(response?.data as IVehicleHandoverResponseData);
                    return;
                } else {
                    message.error("Failed to approve vehicle handover");
                    setSignLoading(false);
                    return;
                }
            } else {
                message.error("Failed to upload signature");
                setSignLoading(false);
                return;
            }
        }
    }
    const handleSignContract = async () => {
        setSignLoading(true);
        const signatureResult = await handleMetaMaskSignature(userInfo.id);
        if (!signatureResult) {
            message.error("Failed to get signature from MetaMask");
            setSignLoading(false);
            return;
        }
        const { account, signature, msg } = signatureResult;

        if (sigCanvas?.current) {
            const imageUrl = await handleUploadSignature(sigCanvas, dispatch, record?.id, userInfo.id, setLoading);
            if (imageUrl) {
                const address = await connectWallet();
                if (address) {
                    const balance = await getWalletBalance(address, t);
                    if (balance !== null && parseFloat(balance) < 0.05) {
                        message.error('Số dư trong ví không đủ để thực hiện giao dịch');
                        setLoading(false);
                        return;
                    } else {
                        const transactionResult = await sendTransaction(import.meta.env.VITE_VCAR_OWNER_METAMASK_ADDRESS, '0.05');
                        if (transactionResult.success) {
                            const response = await signContract(record?.id, {
                                signature,
                                message: msg,
                                address: account,
                                signature_url: imageUrl
                            });
                            if (response?.success) {
                                const vnpayUrl = response?.data;
                                if (typeof vnpayUrl === 'string' || vnpayUrl instanceof URL) {
                                    window.location.href = vnpayUrl.toString();
                                }
                            } else {
                                message.error('Lỗi hệ thống, chúng tôi sẽ chuyển lại phí giao dịch cho bạn trong vòng 24h');
                                setSignLoading(false);
                                return;
                            }
                            setSignLoading(false);
                        } else {
                            setLoading(false);
                            message.error(transactionResult.message)
                        }
                    }
                } else {
                    setLoading(false);
                    message.error('Vui lòng kết nối ví để thực hiện giao dịch');
                }
            } else {
                message.error("Failed to upload signature");
                setSignLoading(false);
                return;
            }
        }
    };
    const handleViewHandoverDocument = async () => {
        setViewHandoverLoading(true);

        // Load template from public folder
        const templateUrl = "/vehicle_handover_template.docx";
        const response = await fetch(templateUrl);
        const content = await response.arrayBuffer();

        // Initialize PizZip
        const zip = new PizZip(content);

        // Initialize ImageModule
        const imageOpts = {
            centered: false,
            getImage: async (tagValue: string) => {
                // Use utility function to fetch image from URL
                const imageBuffer = await fetchImageFromUrl(tagValue);
                return imageBuffer;
            },
            getSize: () => [150, 50] as [number, number] // Set image size, can be customized
        };

        const doc = new Docxtemplater(zip, {
            modules: [new ImageModule(imageOpts)],
            paragraphLoop: true,
            linebreaks: true,
        });

        // Load signature URLs from vehicleHandover (assuming they are in the data)
        const data = {
            D: new Date(vehicleHandover?.handover_date).getDate() || '',
            M: new Date(vehicleHandover?.handover_date).getMonth() + 1 || '',
            Y: new Date(vehicleHandover?.handover_date).getFullYear() || '',
            Location: vehicleHandover?.location || '',
            Lessor: vehicleHandover?.lessor_name || '',
            Lessee: vehicleHandover?.lessee_name || '',
            CarLabel: car?.name || '',
            CarType: 'Sedan',
            CarPaint: 'Black',
            CarYearManufacture: vehicleHandover?.car_manufacturing_year || '',
            CarLicensePlate: vehicleHandover?.car_license_plate || '',
            CarSeat: vehicleHandover?.car_seat || '',
            RHour: vehicleHandover?.handover_hour || '',
            RDay: new Date(vehicleHandover?.handover_date).getDate() || '',
            RMonth: new Date(vehicleHandover?.handover_date).getMonth() + 1 || '',
            RYear: new Date(vehicleHandover?.handover_date).getFullYear() || '',
            X: vehicleHandover?.initial_condition_normal ? 'X' : '',
            Odo: vehicleHandover?.odometer_reading || '',
            Fuel: vehicleHandover?.fuel_level || '',
            PersonalItems: vehicleHandover?.personal_items || '',
            x1: 'X',
            x2: '',
            CMND: '',
            MotoType: '',
            MotoLicensePlate: '',
            MotoLicense: '',
            MoneyCollateral: '',
            OtherCollateral: '',
            // Insert signatures from URL into the docx file
            LessorHandoverSign: vehicleHandover?.lessor_signature || '',
            LesseeHandoverSign: vehicleHandover?.lessee_signature || '',
            LessorReturnSign: vehicleHandover?.return_lessor_signature || '',
            LesseeReturnSign: vehicleHandover?.return_lessee_signature || '',
            ReHour: vehicleHandover?.return_hour || '',
            ReDay: new Date(vehicleHandover?.return_date).getDate() || '',
            ReMonth: new Date(vehicleHandover?.return_date).getMonth() + 1 || '',
            ReYear: new Date(vehicleHandover?.return_date).getFullYear() || '',
            x3: vehicleHandover?.condition_matches_initial ? 'X' : '',
            ReOdo: vehicleHandover?.return_odometer_reading || '',
            ReFuel: vehicleHandover?.return_fuel_level || '',
            RePersonalItem: vehicleHandover?.personal_items || '',
            x4: '',
        };

        // Render data into template
        doc.render(data);

        // Export filled contract
        const blob = doc.getZip().generate({ type: 'blob' });
        saveAs(blob, 'bien-ban-ban-giao-xe.docx');

        setViewHandoverLoading(false);
    };
    const handleViewContract = async () => {
        setViewLoading(true);

        // Tải template từ thư mục public
        const templateUrl = "/template_contract.docx";
        const response = await fetch(templateUrl);
        const content = await response.arrayBuffer();

        // Sử dụng PizZip để đọc file docx
        const zip = new PizZip(content);

        // Khởi tạo Docxtemplater với dữ liệu từ file docx
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Điền dữ liệu vào template
        const data = {
            Day: new Date(record?.created_at).getDate(),
            Month: new Date(record?.created_at).getMonth() + 1,
            Year: new Date(record?.created_at).getFullYear(),
            DiaDiem: record?.vehicle_hand_over_location || '',
            TenBenA: record?.vehicle_owner_name || '',
            CMNDBenA: record?.lessor_identity_number || '',
            A1_D: '01',
            A1_M: '01',
            A1_Y: '2020',
            A1_Z: 'Hồ Chí Minh',
            DiaChiBenA: record?.lessor_contact_address,
            DienThoaiBenA: record?.lessor_phone_number,
            TenBenB: userInfo?.display_name || '',
            CMNDBenB: '987654321',
            B1_D: '01',
            B1_M: '01',
            B1_Y: '2020',
            B1_Z: 'Hà Nội',
            PassportBenB: 'P123456',
            B2_D: '01',
            B2_M: '01',
            B2_Y: '2020',
            B2_Z: 'Hà Nội',
            GPLXBenB: 'G123456',
            B3_D: '01',
            B3_M: '01',
            B3_Y: '2020',
            B3_Z: 'Hà Nội',
            DiaChiBenB: '',
            DienThoaiBenB: userInfo?.phone_number,
            BienSoXe: record?.vehicle_license_plate || '',
            NhanHieu: car?.name,
            NamSanXuat: record?.vehicle_manufacturing_year || '2021',
            MauXe: 'Đen',
            SoDKXe: record?.vehicle_registration_number || '',
            NgayCapGiayDK: record?.vehicle_registration_date || '',
            NoiCapGiayDK: record?.vehicle_registration_location || '',
            TenChuXe: record?.vehicle_owner_name || '',
            DonGiaThue: record?.rental_price_per_day?.toString() || '',
            GioiHanQuangDuong: record?.mileage_limit_per_day?.toString() || '',
            PhiVuotQuangDuong: record?.extra_mileage_charge?.toString() || '',
            GioBDThue: new Date(record?.rental_start_date).getHours().toString() || '',
            PhutBDThue: new Date(record?.rental_start_date).getMinutes().toString() || '',
            NgayBDThue: new Date(record?.rental_start_date).toLocaleDateString() || '',
            GioKTThue: new Date(record?.rental_end_date).getHours().toString() || '',
            PhutKTThue: new Date(record?.rental_end_date).getMinutes().toString() || '',
            NgayKTThue: new Date(record?.rental_end_date).toLocaleDateString() || '',
            PhiVuotTGThue: record?.extra_hourly_charge?.toString() || '',
            TongTienThue: record?.total_rental_value?.toString() || '',
            DiaDiemBanGiaoXe: record?.vehicle_hand_over_location || ''
        };
        doc.render(data);

        // Xuất file hợp đồng đã điền
        const blob = doc.getZip().generate({ type: 'blob' });
        saveAs(blob, 'Hop-dong-thue-xe.docx');

        setViewLoading(false);
    };
    const handleReturnVehicle = async () => {
        try {
            // Trigger form validation
            await returnHandoverForm.validateFields();

            // If the form is valid, submit the form
            returnHandoverForm.submit();
            setOpenReturnModal(false);
        } catch (errorInfo) {
            console.log("Failed:", errorInfo);
            message.error("Please fill in all required fields");
        }
    };
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: GET_CAR_BY_ID, payload: record?.car_id });
    }, [dispatch, record?.car_id])

    useEffect(() => {
        async function fetchVehicleHandover() {
            const response = await getVehicleHandoverByContractId(record?.id);
            if (response?.success) {
                setLoading(false);
                setVehicleHandover(response?.data as IVehicleHandoverResponseData);
            } else {
                setLoading(false);
            }
        }
        fetchVehicleHandover();
    }, [record?.id])

    if (!record) return null;
    return (
        <>
            {(loading || carLoading) && <div className='flex items-center justify-center'><Spin size="large"></Spin></div>}
            {record.id && <Row gutter={[12, 0]} justify={"start"}>
                <Col span={12}>
                    <div className='w-full h-full p-4 rounded-lg shadow-md'>
                        <Typography.Title level={4}>Chủ xe</Typography.Title>
                        <Divider></Divider>
                        <div className='flex items-start gap-x-2'>
                            <Avatar size={"large"} src={DEFAULT_AVATAR} className='cursor-pointer' alt='Avatar'></Avatar>
                            <div>
                                <Typography.Title level={5} className='cursor-pointer'>{car?.owner?.display_name}</Typography.Title>
                                <div className='flex flex-col gap-y-2'>
                                    <Typography.Text><PhoneOutlined className='mr-2 text-xl' />{car?.owner?.phone_number}</Typography.Text>
                                    <Typography.Text><MailOutlined className='mr-2 text-xl' />{car?.owner?.email}</Typography.Text>
                                </div>
                            </div>
                            <Button type='primary' className='ml-auto'>Nhắn tin</Button>
                        </div>
                        <Divider></Divider>
                        <Row gutter={[0, 12]}>
                            <Col span={24}>
                                <Typography.Title level={5}>Ngày bắt đầu thuê:</Typography.Title>
                                <Typography.Text>{new Date(record?.rental_start_date).toLocaleString()}</Typography.Text>
                            </Col>
                            <Divider className="m-0"></Divider>
                            <Col span={24}>
                                <Typography.Title level={5}>Ngày kết thúc thuê:</Typography.Title>
                                <Typography.Text>{new Date(record?.rental_end_date).toLocaleString()}</Typography.Text>
                            </Col>
                            <Divider className="m-0"></Divider>
                            <Col span={24}>
                                <Typography.Title level={5}>Địa điểm lấy xe:</Typography.Title>
                                <Typography.Text>{record?.vehicle_hand_over_location}</Typography.Text>
                            </Col>
                            <Divider className="m-0"></Divider>
                            <Col span={24}>
                                <Typography.Title level={5}>Trạng thái: <Tag color={
                                    record.rental_status === 'SIGNED' ? 'green' :
                                        record.rental_status === 'PENDING' ? 'orange' :
                                            record.rental_status === 'CANCELED' ? 'red' : 'blue'
                                }>{record.rental_status}</Tag></Typography.Title>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={12}>
                    <RentalSummary
                        car={car}
                        totalDays={numberOfDays}
                    ></RentalSummary>
                </Col>
                <Divider className="m-2"></Divider>
                <Col span={10} offset={14}>
                    <Typography.Title level={5}>Trạng thái xe: <Tag color={
                        vehicleHandover?.lessee_approved ? 'green' : 'orange'
                    }>{vehicleHandover?.lessee_approved ? 'Đã bàn giao' : 'Chưa bàn giao'}</Tag></Typography.Title>
                    <Typography.Title level={5}>Trạng thái đơn thuê: <Tag color={
                        vehicleHandover?.status === 'RETURNED' ? 'green' : 'orange'
                    }>{vehicleHandover?.status === 'RETURNED' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</Tag></Typography.Title>
                </Col>
                <Divider className="m-0"></Divider>
                <Col span={24}>
                    <Col span={24}>
                        <div className="flex items-center justify-end h-10 rounded-lg gap-x-3 bg-lite">
                            {record?.rental_status === 'SIGNED' && vehicleHandover?.id && <Button type="text" onClick={handleViewHandoverDocument} loading={viewHandoverLoading}>View handover document</Button>}
                            <Button type="text" danger onClick={handleViewContract} loading={viewLoading} disabled={signLoading}>View Contract</Button>
                            {record?.rental_status === 'SIGNED' && vehicleHandover?.status === 'CREATED' && <Button type="primary" loading={signLoading} onClick={() => setIsSignaturePadVisible(true)}>Approve handover</Button>}
                            {record?.rental_status === 'SIGNED' && vehicleHandover?.status === 'RENDING' && <Button type="primary" onClick={() => setOpenReturnModal(true)} disabled={loading}>Return Vehicle</Button>}
                            {record.rental_status === 'PENDING' && <Button type="primary" onClick={() => setIsSignaturePadVisible(true)} loading={signLoading}>Sign Contract</Button>}
                            {record.rental_status === 'SIGNED' && vehicleHandover?.status === 'RETURNED' && <Button type="primary" onClick={() => setOpenReviewModal(true)} loading={signLoading}>Review</Button>}
                        </div>
                    </Col>
                </Col>
                <Modal
                    title="Sign to Approve"
                    open={isSignaturePadVisible}
                    onOk={() => {
                        sigCanvas.current?.clear();
                        setIsSignaturePadVisible(false);
                        if (record?.rental_status === 'SIGNED' && !vehicleHandover?.lessee_approved) {
                            handleApproveVehicleHandover();
                        } else {
                            handleSignContract();
                        }
                    }}
                    onCancel={() => setIsSignaturePadVisible(false)}
                    okText="Approve"
                    cancelText="Cancel"
                >
                    <SignatureCanvas
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                    />
                </Modal>
                <Modal
                    title="Tạo biên bản giao trả xe"
                    open={openReturnModal}
                    onOk={handleReturnVehicle}
                    onCancel={() => setOpenReturnModal(false)}
                >
                    <ReturnVehicleHandover
                        form={returnHandoverForm}
                        setVehicleHandover={setVehicleHandover}
                        setReturnVehicleLoading={setLoading}
                        vehicle_handover_id={vehicleHandover?.id}
                    ></ReturnVehicleHandover>
                </Modal>
                <Modal
                    title="Đánh giá xe"
                    open={openReviewModal}
                    onCancel={() => setOpenReviewModal(false)}
                    footer={false}
                >
                    <CreateReviewModal contract_id={record?.id} setOpen={setOpenReviewModal}></CreateReviewModal>
                </Modal>
            </Row>}
        </>
    );
};

export default LesseeContractModal;