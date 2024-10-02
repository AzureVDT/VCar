import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import { ScreenOptions } from '../../constants';
import CarDetailScreen from '../../screens/CarDetailScreen';

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HOME_SCREEN"
                component={HomeScreen}
                options={{ ...ScreenOptions.home, }}
            />
            <Stack.Screen
                name="CAR_DETAIL_SCREEN"
                component={CarDetailScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

export default HomeNavigator