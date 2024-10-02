import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PersonalScreen from '../../screens/PersonalScreen';
import { ScreenOptions } from '../../constants';

const Stack = createNativeStackNavigator();

const PersonalNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PERSONAL_SCREEN"
                component={PersonalScreen}
                options={{ ...ScreenOptions.personal, }}
            />
        </Stack.Navigator>
    )
}

export default PersonalNavigator