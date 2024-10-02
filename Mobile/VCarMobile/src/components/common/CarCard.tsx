import { View, Text } from 'react-native'
import React from 'react'
import { Card } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ICar } from '../../store/car/types';
import { formatPrice } from '../../utils';

const CarCard = ({ car, isFullWidth = false }: { car: ICar, isFullWidth: boolean }) => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    return (
        <Card containerStyle={{ width: isFullWidth ? 320 : 200, padding: 0, borderRadius: 10, marginRight: 10 }}>
            <Card.Image
                source={{ uri: car.image_url[0] ?? 'https://picsum.photos/200/300' }}
                style={{ height: isFullWidth ? 200 : 120, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                resizeMode="cover"
                onPress={() => navigation.navigate('CAR_DETAIL_SCREEN', { carId: car.id })}
            />
            <View style={{ padding: 10 }}>
                <Text style={{ fontWeight: 'bold' }} className='w-full h-5 line-clamp-2'>{car.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={{ marginLeft: 5 }}>{car.average_rating} (124 review)</Text>
                </View>
                <Text style={{ marginTop: 5, fontWeight: 'bold' }}><Text className='font-bold text-semiPrimary'>{formatPrice(car.daily_rate)} VNĐ</Text> / day</Text>
            </View>
        </Card>
    )
}

export default CarCard