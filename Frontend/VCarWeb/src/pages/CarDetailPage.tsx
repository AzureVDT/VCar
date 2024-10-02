import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { GET_CAR_BY_ID } from '../store/car/action';
import { v4 as uuidv4 } from 'uuid';
import { Avatar, Button, Carousel, Col, Divider, Rate, Row, Spin, Tag, Typography } from 'antd';
import { CarOutlined, HeartOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import gasStationIcon from "../assets/gas-station.png";
import transmissionIcon from "../assets/transmission.png";
import { useTranslation } from 'react-i18next';
import { DEFAULT_AVATAR } from '../config/apiConfig';
import CarCard from '../components/CarCard';
import CarCardSkeleton from '../components/common/CarCardSkeleton';

const CarDetailPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { carDetail, loading } = useSelector((state: RootState) => state.car);
    const { car, related_cars, reviews } = carDetail;
    useMemo(() => {
        dispatch({ type: GET_CAR_BY_ID, payload: id });
    }, [dispatch, id])
    const handleRentNow = (id: string) => {
        localStorage.setItem("STORAGE_RENT_CAR_ID", id);
        navigate("/checkout");
    }
    return (
        <div>
            {!loading && car?.id && <>
                <Row gutter={[32, 0]} justify={"center"} align={"stretch"}>
                    <Col span={12}>
                        <Carousel draggable autoplay autoplaySpeed={5000} arrows className='w-full h-[448px] rounded-lg'>
                            {car && car.image_url.map((image) => (
                                <div key={uuidv4()} className='w-full h-[448px] rounded-lg'>
                                    <img src={image} alt={car.name} className="object-cover w-full h-full rounded-lg" />
                                </div>
                            ))}
                        </Carousel>
                    </Col>
                    <Col span={12}>
                        <div className='p-4 rounded-lg shadow-md bg-lite'>
                            <div className='flex items-start justify-between mb-2'>
                                <div>
                                    <Typography.Title level={3}>{car?.name}</Typography.Title>
                                    <div className='flex items-center justify-start gap-x-2'>
                                        <Rate allowHalf disabled defaultValue={car?.average_rating} />
                                        <Typography.Text>440+ Reviewer</Typography.Text>
                                    </div>
                                </div>
                                <HeartOutlined className='text-2xl cursor-pointer' />
                            </div>
                            <Typography.Paragraph className='font-normal text-text5'>{car?.description}</Typography.Paragraph>
                            <div>
                                <Typography.Title level={5}>Đặc điểm</Typography.Title>
                                <div className="flex items-center justify-start mb-2 gap-x-5">
                                    <div className="flex items-center">
                                        <img
                                            src={gasStationIcon}
                                            alt={t("fuelConsumption")}
                                            className="w-6 h-6 mr-2"
                                        />
                                        <div className='flex flex-col'>
                                            <Typography.Text className="text-filter-range">
                                                NL tiêu hao
                                            </Typography.Text>
                                            <Typography.Text className="text-filter-range">
                                                {car?.fuel_consumption} {t("litersPer100km")}
                                            </Typography.Text>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <img
                                            src={transmissionIcon}
                                            alt={t("transmission")}
                                            className="w-6 h-6 mr-2"
                                        />
                                        <div className='flex flex-col'>
                                            <Typography.Text className="text-filter-range">
                                                Truyền động
                                            </Typography.Text>
                                            <Typography.Text className="text-filter-range">
                                                {car?.transmission === "MANUAL" ? t("manual") : t("automatic")}
                                            </Typography.Text>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <CarOutlined className='mr-2 text-2xl' />
                                        <div className='flex flex-col'>
                                            <Typography.Text className="text-filter-range">
                                                Số ghế
                                            </Typography.Text>
                                            <Typography.Text className="text-filter-range">
                                                {car?.seat}
                                            </Typography.Text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <Typography.Title level={5}>Các tiện nghi khác</Typography.Title>
                                <div className="flex flex-wrap gap-2">
                                    {car?.features.map((feature, index) => (
                                        <Tag key={index} color="blue">
                                            {feature}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-5">
                                <span className="font-bold text-primary-default">
                                    {car?.daily_rate?.toLocaleString()} {t("currency")} /{" "}
                                    <span className="text-filter-range">{t("day")}</span>
                                </span>
                                <Button type="primary" onClick={() => handleRentNow(car?.id ?? id)}>{t("rentNow")}</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className='w-full h-full p-4 mt-8 rounded-lg shadow-md'>
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
                </div>
                <div className='w-full h-full p-4 mt-8 rounded-lg shadow-md'>
                    <div className='flex items-center justify-start mb-8 gap-x-2'>
                        <Typography.Title level={4} style={{
                            margin: 0
                        }}>Đánh giá</Typography.Title>
                        <Tag color='blue-inverse'>{reviews?.length ?? 0}</Tag>
                    </div>
                    <Divider></Divider>
                    <div>
                        {reviews && reviews.map((review) => (
                            <Row key={review.id}>
                                <Col span={20}>
                                    <div className='flex items-start gap-x-2'>
                                        <Avatar size={"large"} src={DEFAULT_AVATAR} alt='Avatar'></Avatar>
                                        <div className='flex-1'>
                                            <Typography.Title level={5}>{review?.lessee?.display_name}</Typography.Title>
                                            <Typography.Paragraph>{review?.comment}</Typography.Paragraph>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={4}>
                                    <div className='flex flex-col items-end justify-end gap-y-2'>
                                        <Typography.Text>21 July 2022</Typography.Text>
                                        <Rate disabled defaultValue={review?.rating} allowHalf></Rate>
                                    </div>
                                </Col>
                            </Row>
                        ))}
                    </div>
                </div>
                <div className="mt-10">
                    <div className="flex items-center justify-between mb-5">
                        <Typography.Text className="text-text7">Related Car</Typography.Text>
                        <Button type="link" href="#">View All</Button>
                    </div>
                    <Row gutter={[32, 32]}>
                        {related_cars.length > 0 && related_cars.map((car) => (
                            <Col key={car.id} span={6}>
                                <CarCard car={car} />
                            </Col>
                        ))}
                        {loading && Array.from({ length: 4 }).map((_, index) => (
                            <Col key={index} span={6}>
                                <CarCardSkeleton></CarCardSkeleton>
                            </Col>
                        ))}
                    </Row>
                </div>
            </>}
            {loading && !car?.id && <div className='flex items-center justify-center'><Spin size="large"></Spin></div>}
        </div >
    );
};

export default CarDetailPage;