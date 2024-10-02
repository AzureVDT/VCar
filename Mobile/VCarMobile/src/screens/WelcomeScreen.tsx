import { Pressable, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';

const WelcomeScreen = () => {
    return (
        <View className='flex flex-1 bg-strock'>
            <View className='flex items-center justify-end'>
                <Pressable>
                    <Icon name='globe-outline' size={30} color='black' />
                </Pressable>
            </View>
            <Text className='text-text8'>Welcome to VCar</Text>
        </View>
    )
}

export default WelcomeScreen