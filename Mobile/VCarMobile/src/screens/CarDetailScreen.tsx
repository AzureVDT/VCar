import { ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image } from 'react-native';
import { Button, Card, Avatar, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { GET_CAR_BY_ID } from '../store/car/action';
import { RootState } from '../store/configureStore';
import Review from '../modules/car/Review';
import { formatPrice } from '../utils';
import Gallery from '../components/gallery';

export default function CarDetailScreen() {
    const route = useRoute();
    const { carId } = route.params as { carId: string };
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const dispatch = useDispatch();
    const { carDetail } = useSelector((state: RootState) => state.car);
    console.log("CarDetailScreen ~ carDetail:", carDetail)
    const { car, reviews, related_cars } = carDetail;

    useMemo(() => {
        if (carId) {
            dispatch({ type: GET_CAR_BY_ID, payload: carId });
        }
    }, [carId])

    if (!car) return null;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ paddingBottom: 64 }}>
                {/* Image Carousel */}
                <View>
                    <Image
                        source={{ uri: car.image_url[0] ?? 'https://picsum.photos/200/300' }}
                        className="w-full h-64"
                        resizeMode="cover"
                    />
                    <View className="absolute top-0 left-0 m-2">
                        <Icon name="arrowleft" color="white" size={28} onPress={() => navigation.goBack()} />
                    </View>
                </View>

                {/* Car Title and Description */}
                <View className="p-4">
                    <Text className="text-lg font-bold text-text8">{car.name}</Text>
                    <Text className="mt-2 text-sm text-text3">
                        {carDetail.car.description}
                    </Text>
                </View>

                {/* Car Details */}
                <View className="p-4">
                    <Text className="text-xs font-bold text-text8">CAR DETAIL</Text>
                    <View className="flex-row justify-between mt-2">
                        <Text className="text-sm text-text3">Fuel</Text>
                        <Text className="text-sm font-bold text-gray-900">{car.fuel}</Text>
                    </View>
                    <View className="flex-row justify-between mt-2">
                        <Text className="text-sm text-text3">Status</Text>
                        <Text className="text-sm font-bold text-gray-900">{car.status}</Text>
                    </View>
                    <View className="flex-row justify-between mt-2">
                        <Text className="text-sm text-text3">Kilometers</Text>
                        <Text className="text-sm font-bold text-gray-900">{car.fuel_consumption}</Text>
                    </View>
                    <View className="flex-row justify-between mt-2">
                        <Text className="text-sm text-text3">Seats</Text>
                        <Text className="text-sm font-bold text-gray-900">{car.seat}</Text>
                    </View>
                    <View className="flex-row justify-between mt-2">
                        <Text className="text-sm text-text3">Transmission</Text>
                        <Text className="text-sm font-bold text-gray-900">{car.transmission}</Text>
                    </View>
                </View>

                {/* Car gallery */}

                <Gallery
                    carImages={car.image_url}
                ></Gallery>

                <Divider />

                {/* Host Detail */}
                <View className="p-4">
                    <Text className="text-xs font-bold text-gray-900">HOST DETAIL</Text>
                    <View className="flex-row items-center mt-2">
                        <Avatar rounded source={{ uri: car.owner.image_url ?? 'https://randomuser.me/api/portraits/men/85.jpg' }} size="medium" />
                        <View className="ml-4">
                            <Text className="text-sm font-bold text-gray-900">{car.owner.display_name}</Text>
                            <Text className="text-xs text-gray-600">Ho Chi Minh, Viet Nam</Text>
                        </View>
                        <View className="ml-auto">
                            <Button title="Contact" type='outline' className='text-lite bg-thirdly' onPress={() => { }} />
                        </View>
                    </View>
                </View>

                <Divider />

                {/* Reviews Section */}
                <View className="p-4">
                    <Text className="text-xs font-bold text-gray-900">REVIEW ({reviews.length})</Text>
                    {reviews.map((review, index) => (
                        <Review
                            key={review.id}
                            review={review}
                        ></Review>
                    ))}
                    <Text className="mt-4 text-xs text-blue-500">See more review</Text>
                </View>
            </ScrollView>

            {/* Footer Section */}
            <View className="flex-row items-center justify-between p-4 border-t border-gray-200">
                <Text className="text-lg font-bold text-semiPrimary">{formatPrice(car.daily_rate)} VNĐ / day</Text>
                <Button title="Rent car" type='solid' onPress={() => { }} />
            </View>
        </SafeAreaView>
    );
}
