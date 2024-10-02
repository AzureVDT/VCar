import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CarScreen from '../../screens/CarScreen';
import { ScreenOptions } from '../../constants';

const Stack = createNativeStackNavigator();

const CarNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CAR_SCREEN"
                component={CarScreen}
                options={{ ...ScreenOptions.car, }}
            />
            {/* <Stack.Screen
                name="CAR_DETAIL_SCREEN"
                component={CarScreen}
                options={{ headerShown: false }}
            /> */}
        </Stack.Navigator>
    )
}

export default CarNavigator