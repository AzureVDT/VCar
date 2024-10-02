import { Avatar, Button, Col, Divider, Row, Tag, Typography } from "antd";
import { IRentalData } from "../../store/rental/types";
import RentalSummary from "../../modules/checkout/RentalSummary";
import { calculateDays } from "../../utils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_CAR_BY_ID } from "../../store/car/action";
import { RootState } from "../../store/store";
import { DEFAULT_AVATAR } from "../../config/apiConfig";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";

const TripDetailDialog = ({ record }: {
    record: IRentalData;
}) => {
    const numberOfDays = calculateDays(record?.rental_start_date, record?.rental_end_date);
    const { carDetail } = useSelector((state: RootState) => state.car);
    const { car } = carDetail;
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
                                record.status === 'APPROVED' ? 'green' :
                                    record.status === 'PENDING' ? 'orange' :
                                        record.status === 'REJECTED' ? 'red' : 'blue'
                            }>{record.status}</Tag></Typography.Title>
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
        </Row>
    );
};

export default TripDetailDialog;