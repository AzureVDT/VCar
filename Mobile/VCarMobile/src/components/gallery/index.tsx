import { View, Text, ScrollView, Image, TouchableOpacity, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Card } from 'react-native-elements';
import ImageViewing from 'react-native-image-viewing';

const Gallery = ({ carImages }: { carImages: string[] }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    if (!carImages) return null;

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setIsVisible(true);
    };

    const FooterComponent = ({ imageIndex }: { imageIndex: number }) => (
        <View style={{ padding: 16, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 16 }}>{`${imageIndex + 1} / ${carImages.length}`}</Text>
        </View>
    );

    return (
        <View className="flex-1 p-4 bg-white">
            <Text className="text-xs font-bold text-text8">GALLERY</Text>
            <ScrollView className="mb-4" horizontal showsHorizontalScrollIndicator={false}>
                {carImages.map((image, index) => (
                    <Pressable key={index} onPress={() => handleImageClick(index)}>
                        <Card containerStyle={{ padding: 0, borderRadius: 10, marginRight: 10 }}>
                            <Image
                                source={{ uri: image }}
                                style={{ width: 200, height: 120, borderRadius: 10 }}
                                resizeMode="cover"
                            />
                        </Card>
                    </Pressable>
                ))}
            </ScrollView>

            <ImageViewing
                images={carImages.map(uri => ({ uri }))}
                imageIndex={selectedImageIndex}
                visible={isVisible}
                onRequestClose={() => setIsVisible(false)}
                FooterComponent={({ imageIndex }) => <FooterComponent imageIndex={imageIndex} />}

            />
        </View>
    );
};


export default Gallery;