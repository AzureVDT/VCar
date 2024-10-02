
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/configureStore';
import { GET_CARS } from '../store/car/action';
import PromoSection from '../modules/home/PromoSection';
import VehicleSection from '../modules/home/VehicleSection';
import LayoutMain from '../layouts/LayoutMain';
import { QuerySearchCar } from '../store/car/models';

export default function HomeScreen() {
    const dispatch = useDispatch();
    const { cars, loading } = useSelector((state: RootState) => state.car);
    const [carParams, setCarParams] = useState({ ...QuerySearchCar });
    useEffect(() => {
        dispatch({ type: GET_CARS, payload: carParams })
    }, [carParams])
    return (
        <LayoutMain>
            <PromoSection />

            <VehicleSection
                title="Top vehicle"
                cars={cars}
                loading={loading}
            />

            <VehicleSection
                title="Vehicle for you"
                cars={cars}
                loading={loading}
            />

            <VehicleSection
                title="Vehicle near you"
                cars={cars}
                loading={loading}
            />
        </LayoutMain>
    );
}
