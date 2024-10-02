import { View, Text, Image } from 'react-native'
import React from 'react'

const PromoSection = () => {
    return (
        <View style={{ marginBottom: 16 }}>
            <Image
                source={{ uri: 'https://picsum.photos/400/300' }}
                style={{ width: '100%', height: 192, borderRadius: 10 }}
                resizeMode="cover"
            />
            <Text style={{ position: 'absolute', bottom: 16, left: 16, fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                New year 2022 25% off promo
            </Text>
        </View>
    )
}

export default PromoSection