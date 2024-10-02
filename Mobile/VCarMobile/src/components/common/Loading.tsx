import { View, Text } from 'react-native'
import React from 'react'

const Loading = () => {
    return (
        <View className="flex items-center justify-center">
            <View className="w-10 h-10 border-4 border-gray-300 rounded-full animate-spin border-t-tertiary"></View>
        </View>
    )
}

export default Loading