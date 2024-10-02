import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { CheckBox, Button, Dialog, Input, Icon, Chip } from 'react-native-elements';
import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window'); // Lấy chiều cao màn hình

const FilterPopup = ({ isVisible, toggleDialog, searchParams, setSearchParams }: {
    isVisible: boolean,
    toggleDialog: () => void
    searchParams: any,
    setSearchParams: (params: any) => void
}) => {
    const [rentalType, setRentalType] = useState('Day');
    const [carTypes, setCarTypes] = useState<string[]>([]);
    const [capacity, setCapacity] = useState<string[]>([]);
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState<number | null>(null);

    const handleAcceptFilter = () => {
        setSearchParams({
            ...searchParams,
            transmission: carTypes.join(','),
            seats: capacity.join(','),
            rating: rating,
            maxRate: price,
        });
        toggleDialog();
    }

    useEffect(() => {
        const newCarTypes = searchParams?.transmission?.split(',');
        const newCapacity = searchParams?.seats?.split(',');
        const newRating = searchParams?.rating ? parseInt(searchParams.rating) : null;
        const newPrice = searchParams?.maxRate ? searchParams.maxRate : '';
        setCarTypes(newCarTypes);
        setCapacity(newCapacity);
        setRating(newRating);
    }, [searchParams])

    return (
        <Dialog
            isVisible={isVisible}
            onBackdropPress={toggleDialog}
            overlayStyle={{
                width: '100%',
                height: height * 0.8,
                position: 'absolute',
                bottom: 0,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 0
            }}
        >
            {/* Icon Close */}
            <View style={{ position: 'absolute', zIndex: 10, top: 8, right: 8 }}>
                <Icon
                    name="close"
                    type="material"
                    size={24}
                    onPress={toggleDialog}
                />
            </View>

            <ScrollView>
                <View style={{ padding: 16 }}>
                    {/* Rental Type */}
                    <Text style={{ marginBottom: 16, fontSize: 18, fontWeight: 'bold' }}>Rental Type</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                        <Chip
                            title="Day"
                            containerStyle={{ marginRight: 20 }} // Cách giữa các Chip
                            buttonStyle={{ backgroundColor: rentalType === 'Day' ? '#3B82F6' : '#F3F4F6', borderRadius: 10 }}
                            onPress={() => setRentalType('Day')}
                            titleStyle={{ color: rentalType === 'Day' ? 'white' : 'black' }}
                        />
                        <Chip
                            title="Hour"
                            containerStyle={{ marginRight: 20 }} // Cách giữa các Chip
                            buttonStyle={{ backgroundColor: rentalType === 'Hour' ? '#3B82F6' : '#F3F4F6', borderRadius: 10 }}
                            onPress={() => setRentalType('Hour')}
                            titleStyle={{ color: rentalType === 'Hour' ? 'white' : 'black' }}
                        />
                        <Chip
                            title="Month"
                            containerStyle={{ marginRight: 20 }} // Cách giữa các Chip
                            buttonStyle={{ backgroundColor: rentalType === 'Month' ? '#3B82F6' : '#F3F4F6', borderRadius: 10 }}
                            onPress={() => setRentalType('Month')}
                            titleStyle={{ color: rentalType === 'Month' ? 'white' : 'black' }}
                        />
                    </View>

                    {/* Car Type */}
                    <Text style={{ marginBottom: 16, fontSize: 18, fontWeight: 'bold' }}>Transmission</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {['AUTO', 'MANUAL'].map((type) => (
                            <CheckBox
                                key={type}
                                title={type}
                                checked={carTypes.includes(type)}
                                onPress={() => {
                                    setCarTypes((prev) =>
                                        prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
                                    );
                                }}
                                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                            />
                        ))}
                    </View>

                    {/* Capacity */}
                    <Text style={{ marginBottom: 16, fontSize: 18, fontWeight: 'bold' }}>Capacity</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {['2 Person', '4 Person', '6 Person', '8 or More'].map((cap) => (
                            <CheckBox
                                key={cap}
                                title={cap}
                                checked={capacity.includes(cap)}
                                onPress={() => {
                                    setCapacity((prev) =>
                                        prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
                                    );
                                }}
                                containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                            />
                        ))}
                    </View>

                    {/* Price */}
                    <Text style={{ marginBottom: 16, fontSize: 18, fontWeight: 'bold' }}>Price</Text>
                    <Input
                        value={price.toString()}
                        onChangeText={(value) => setPrice(value)}
                        keyboardType="numeric"
                        containerStyle={{ width: '100%' }}
                        inputStyle={{ height: 40, borderColor: 'gray', borderWidth: 1, paddingLeft: 10 }}
                    />
                    <Text>From $0 to ${price}</Text>

                    {/* Rating */}
                    <Text style={{ marginBottom: 16, fontSize: 18, fontWeight: 'bold' }}>Rating</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {[5, 4, 3, 2, 1].map((ratingValue) => (
                            <Chip
                                key={ratingValue}
                                title={`${ratingValue} Star${ratingValue > 1 ? 's' : ''}`}
                                containerStyle={{ marginRight: 10, marginBottom: 10 }}
                                buttonStyle={{ backgroundColor: rating === ratingValue ? '#3B82F6' : '#F3F4F6', borderRadius: 10 }}
                                titleStyle={{ color: rating === ratingValue ? 'white' : 'black' }}
                                onPress={() => setRating(ratingValue)}
                            />
                        ))}
                    </View>

                    {/* Apply Button */}
                    <Button title="Apply Filter" buttonStyle={{ backgroundColor: '#3B82F6', borderRadius: 10, marginTop: 20 }} onPress={handleAcceptFilter} />
                </View>
            </ScrollView>
        </Dialog>
    );
};

export default FilterPopup;