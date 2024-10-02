import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { Card } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import { ICar } from '../../store/car/types';
import { formatPrice } from '../../utils';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CarCard from '../../components/common/CarCard';
import CardSkeleton from '../../components/common/CardSkeleton';

const VehicleSection = ({ title, cars, loading }: {
    title: string
    cars: ICar[]
    loading: boolean
}) => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
                <Text style={{ color: '#1E90FF' }}>See all</Text>
            </View>
            <ScrollView className='mb-4' horizontal showsHorizontalScrollIndicator={false}>
                {!loading && cars.length > 0 && cars.map((car, index) => (
                    <CarCard
                        key={car.id}
                        car={car}
                        isFullWidth={false}
                    ></CarCard>
                ))}
                {loading && Array.from({ length: 10 }).map((_, index) => (
                    <CardSkeleton
                        key={index}
                        isFullWidth
                    ></CardSkeleton>
                ))}
            </ScrollView>
        </>

    )
}

export default VehicleSection