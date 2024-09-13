import { Avatar, Button, Col, Divider, Row, Tag, Typography } from "antd";
import { IContractData } from "../../store/rental/types";
import RentalSummary from "../../modules/checkout/RentalSummary";
import { calculateDays, getUserInfoFromCookie } from "../../utils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_CAR_BY_ID } from "../../store/car/action";
import { RootState } from "../../store/store";
import { DEFAULT_AVATAR } from "../../config/apiConfig";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { signContract } from "../../store/rental/handlers";
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

const LesseeContractModal = ({ record }: {
    record: IContractData;
}) => {
    const userInfo = getUserInfoFromCookie();
    const [signLoading, setSignLoading] = useState(false);
    const [viewLoading, setViewLoading] = useState(false);
    const numberOfDays = calculateDays(record?.rental_start_date, record?.rental_end_date);
    const { carDetail } = useSelector((state: RootState) => state.car);
    const { car } = carDetail;
    const handleSignContract = async () => {
        setSignLoading(true);
        const response = await signContract(record?.id);
        if (response?.success) {
            const vnpayUrl = response?.data;
            if (typeof vnpayUrl === 'string' || vnpayUrl instanceof URL) {
                window.location.href = vnpayUrl.toString();
            }
        }
        setSignLoading(false);
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

        // Dữ liệu mẫu để thay thế trong file hợp đồng
        // const data = {
        //     Day: new Date().getDate(),
        //     Month: new Date().getMonth() + 1,
        //     Year: new Date().getFullYear(),
        //     DiaDiem: 'Hồ Chí Minh',
        //     TenBenA: 'Công ty TNHH VCar',
        //     CMNDBenA: '123456789',
        //     A1_D: '01',
        //     A1_M: '01',
        //     A1_Y: '2020',
        //     A1_Z: 'Hồ Chí Minh',
        //     DiaChiBenA: '123 Đường ABC, Quận XYZ, TP.HCM',
        //     DienThoaiBenA: '0123456789',
        //     TenBenB: 'Nguyễn Văn A',
        //     CMNDBenB: '987654321',
        //     B1_D: '01',
        //     B1_M: '01',
        //     B1_Y: '2020',
        //     B1_Z: 'Hà Nội',
        //     PassportBenB: 'P123456',
        //     B2_D: '01',
        //     B2_M: '01',
        //     B2_Y: '2020',
        //     B2_Z: 'Hà Nội',
        //     GPLXBenB: 'G123456',
        //     B3_D: '01',
        //     B3_M: '01',
        //     B3_Y: '2020',
        //     B3_Z: 'Hà Nội',
        //     DiaChiBenB: '456 Đường XYZ, Quận ABC, TP.HCM',
        //     DienThoaiBenB: '0987654321',
        //     BienSoXe: '51A-12345',
        //     NhanHieu: 'Toyota',
        //     NamSanXuat: '2021',
        //     MauXe: 'Đen',
        //     SoDKXe: '123456789',
        //     NgayCapGiayDK: '01/01/2021',
        //     NoiCapGiayDK: 'Hồ Chí Minh',
        //     TenChuXe: 'Công ty TNHH VCar',
        //     DonGiaThue: '1.000.000',
        //     GioiHanQuangDuong: '300',
        //     PhiVuotQuangDuong: '5.000',
        //     GioBDThue: '08',
        //     PhutBDThue: '00',
        //     NgayBDThue: '01/01/2023',
        //     GioKTThue: '08',
        //     PhutKTThue: '00',
        //     NgayKTThue: '05/01/2023',
        //     PhiVuotTGThue: '100.000',
        //     TongTienThue: '10.000.000',
        //     DiaDiemBanGiaoXe: '123 Đường ABC, Quận XYZ, TP.HCM'
        // };

        // Điền dữ liệu vào template
        const data = {
            Day: new Date().getDate(),
            Month: new Date().getMonth() + 1,
            Year: new Date().getFullYear(),
            DiaDiem: record.vehicle_hand_over_location || '',
            TenBenA: record.owner || '',
            CMNDBenA: '123456789',
            A1_D: '01',
            A1_M: '01',
            A1_Y: '2020',
            A1_Z: 'Hồ Chí Minh',
            DiaChiBenA: '123 Đường ABC, Quận XYZ, TP.HCM',
            DienThoaiBenA: '0123456789',
            TenBenB: userInfo.display_name || '',
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
            DienThoaiBenB: userInfo.phone_number,
            BienSoXe: record.vehicle_license_plate || '',
            NhanHieu: car.name,
            NamSanXuat: record.vehicle_manufacturing_year || '2021',
            MauXe: 'Đen',
            SoDKXe: record.vehicle_registration_number || '',
            NgayCapGiayDK: record.vehicle_registration_date || '',
            NoiCapGiayDK: record.vehicle_registration_location || '',
            TenChuXe: record.vehicle_owner_name || '',
            DonGiaThue: record.rental_price_per_day?.toString() || '',
            GioiHanQuangDuong: record.mileage_limit_per_day?.toString() || '',
            PhiVuotQuangDuong: record.extra_mileage_charge?.toString() || '',
            GioBDThue: new Date(record.rental_start_date).getHours().toString() || '',
            PhutBDThue: new Date(record.rental_start_date).getMinutes().toString() || '',
            NgayBDThue: new Date(record.rental_start_date).toLocaleDateString() || '',
            GioKTThue: new Date(record.rental_end_date).getHours().toString() || '',
            PhutKTThue: new Date(record.rental_end_date).getMinutes().toString() || '',
            NgayKTThue: new Date(record.rental_end_date).toLocaleDateString() || '',
            PhiVuotTGThue: record.extra_hourly_charge?.toString() || '',
            TongTienThue: record.total_rental_value?.toString() || '',
            DiaDiemBanGiaoXe: record.vehicle_hand_over_location || ''
        };
        doc.render(data);

        // Xuất file hợp đồng đã điền
        const blob = doc.getZip().generate({ type: 'blob' });
        saveAs(blob, 'Hop-dong-thue-xe.docx');

        setViewLoading(false);
    };
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: GET_CAR_BY_ID, payload: record?.car_id });
    }, [dispatch, record?.car_id])
    if (!record) return null;
    return (
        <Row gutter={[12, 0]} justify={"start"}>
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
                        {record.rental_status === 'PENDING' && <Col span={24}>
                            <div className="flex items-center justify-end gap-x-3">
                                <Button type="primary" onClick={handleSignContract} loading={signLoading} disabled={viewLoading}>SIGN</Button>
                                <Button type="primary" danger onClick={handleViewContract} loading={viewLoading} disabled={signLoading}>View Contract</Button>
                            </div>
                        </Col>}
                    </Row>
                </div>
            </Col>
            <Col span={12}>
                <RentalSummary
                    car={car}
                    totalDays={numberOfDays}
                ></RentalSummary>
            </Col>
        </Row>
    );
};

export default LesseeContractModal;