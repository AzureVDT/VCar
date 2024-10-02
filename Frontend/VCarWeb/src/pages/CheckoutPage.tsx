import { useMemo, useState } from "react";
import { calculateDays, getUserInfoFromCookie } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { GET_CAR_BY_ID } from "../store/car/action";
import { Col, RadioChangeEvent, Row, Spin } from "antd";
import RentalSummary from "../modules/checkout/RentalSummary";
import BillingInfo from "../modules/checkout/BillingInfo";
import RentalInfo from "../modules/checkout/RentalInfo";
import PaymentInfo from "../modules/checkout/PaymentInfo";
import Confirmation from "../modules/checkout/Confirmation";
import { Dayjs } from "dayjs";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { toast } from "react-toastify";
import { handleRentRequest } from "../store/rental/handlers";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const carId = localStorage.getItem('STORAGE_RENT_CAR_ID');
    const [isTermsAgreed, setIsTermsAgreed] = useState(false);
    const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
    const [province, setProvince] = useState<string | null>(null);
    const [endTimestamp, setEndTimestamp] = useState<number | null>(null);
    const userInfo = getUserInfoFromCookie();
    const { carDetail, loading } = useSelector((state: RootState) => state.car);
    const { car } = carDetail;
    const dispatch = useDispatch();
    const [paymentMethod, setPaymentMethod] = useState("VNPAY");
    const numberOfDays = useMemo(() => {
        return calculateDays(startTimestamp, endTimestamp);
    }, [startTimestamp, endTimestamp]);

    const onChange = (e: RadioChangeEvent) => {
        setPaymentMethod(e.target.value);
    };

    const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            setStartTimestamp(dates[0].valueOf());
            setEndTimestamp(dates[1].valueOf());
        } else {
            setStartTimestamp(null);
            setEndTimestamp(null);
        }
    };
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        setIsTermsAgreed(e.target.checked);
    };

    const onRent = async () => {
        if (!isTermsAgreed) {
            toast.error('Vui lòng đồng ý với các điều khoản và điều kiện và chính sách bảo mật.');
            return;
        } else if (!province) {
            toast.error('Vui lòng chọn tỉnh thành.');
            return;
        } else if (numberOfDays <= 0) {
            toast.error('Vui lòng chọn thời gian thuê xe.');
            return;
        } else if (!paymentMethod) {
            toast.error('Vui lòng chọn phương thức thanh toán.');
            return;
        } else {
            const response = await handleRentRequest(carId ?? '', startTimestamp!, endTimestamp!, province);
            if (response?.success) {
                navigate('/account/my-trips')
                toast.success('Đã gửi yêu cầu thuê xe. Vui lòng chờ xác nhận từ chủ xe!');
            } else {
                toast.error('Gửi yêu cầu thuê xe thất bại. Vui lòng thử lại sau!');
            }
        }
    }

    useMemo(() => {
        dispatch({ type: GET_CAR_BY_ID, payload: carId });
    }, [carId, dispatch])

    return (
        <div>
            {!loading && car?.id && <div>
                <Row gutter={[32, 0]}>
                    <Col span={16}>
                        <Row gutter={[0, 32]}>
                            <Col span={24}>
                                <BillingInfo
                                    userInfo={userInfo}
                                ></BillingInfo>
                            </Col>
                            <Col span={24}>
                                <RentalInfo setProvince={setProvince} onChange={handleDateChange}></RentalInfo>
                            </Col>
                            <Col span={24}>
                                <PaymentInfo
                                    paymentMethod={paymentMethod}
                                    onChange={onChange}
                                ></PaymentInfo>
                            </Col>
                            <Col span={24}>
                                <Confirmation onRent={onRent} handleCheckboxChange={handleCheckboxChange}></Confirmation>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <RentalSummary
                            car={car}
                            totalDays={numberOfDays}
                        ></RentalSummary>
                    </Col>
                </Row>
            </div>}
            {loading && <div className='flex items-center justify-center'><Spin size="large"></Spin></div>}
        </div>
    );
};

export default CheckoutPage;