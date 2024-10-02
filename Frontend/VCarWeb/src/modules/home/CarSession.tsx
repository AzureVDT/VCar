import { Button, Typography, Row, Col } from "antd";
import CarCard from "../../components/CarCard";
import { GET_CARS } from "../../store/car/action";
import { IQuerySearchCar } from "../../store/car/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { memo, useEffect, useMemo, useState } from "react";
import { QuerySearchCar } from "../../store/car/models";
import CarCardSkeleton from "../../components/common/CarCardSkeleton";


const CarSession = ({ title, type }: {
    title: string;
    type: string
}) => {
    const [params, setParams] = useState<IQuerySearchCar>(QuerySearchCar);
    const { cars, loading } = useSelector((state: RootState) => state.car);
    const dispatch = useDispatch<AppDispatch>();
    useMemo(() => {
        dispatch({ type: GET_CARS, payload: params });
    }, [dispatch, params]);
    useEffect(() => {
        switch (type) {
            case "popular":
                setParams({ ...params, size: 4, maxRate: 1000000, rating: 5 });
                break;
            case "recommend":
                setParams({ ...params, size: 4, rating: 5 });
                break;
            case "near":
                setParams({ ...params, size: 4, province: "Ho_Chi_Minh" });
                break;
            default:
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="mt-10">
            <div className="flex items-center justify-between mb-5">
                <Typography.Text className="text-text7">{title}</Typography.Text>
                <Button type="link" href="#">View All</Button>
            </div>
            <Row gutter={[32, 32]}>
                {cars.length > 0 && cars.map((car) => (
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
    );
};

export default memo(CarSession);