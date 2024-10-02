import { View, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Card } from 'react-native-elements';

const CardSkeleton = ({ isFullWidth = false }: { isFullWidth: boolean }) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [shimmerAnim]);

    const shimmerStyle = {
        opacity: shimmerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
        }),
    };

    return (
        <Card containerStyle={{ width: isFullWidth ? 320 : 200, padding: 0, borderRadius: 10, marginRight: 10 }}>
            <Animated.View style={[{ height: isFullWidth ? 200 : 120, borderTopLeftRadius: 10, borderTopRightRadius: 10 }, shimmerStyle]} className="bg-gray-300" />
            <View className="p-2.5">
                <Animated.View style={[{ width: '100%', height: 20, marginBottom: 6, borderRadius: 4 }, shimmerStyle]} className="bg-gray-300" />
                <View className="flex-row items-center mt-1.5">
                    <Animated.View style={[{ width: 16, height: 16, borderRadius: 8 }, shimmerStyle]} className="bg-gray-300" />
                    <Animated.View style={[{ width: 100, height: 16, marginLeft: 6, borderRadius: 4 }, shimmerStyle]} className="bg-gray-300" />
                </View>
                <Animated.View style={[{ width: '100%', height: 20, marginTop: 6, borderRadius: 4 }, shimmerStyle]} className="bg-gray-300" />
            </View>
        </Card>
    );
};

export default CardSkeleton;