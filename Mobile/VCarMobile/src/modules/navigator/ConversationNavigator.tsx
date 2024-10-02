import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConversationScreen from '../../screens/ConversationScreen';
import { ScreenOptions } from '../../constants';

const Stack = createNativeStackNavigator();

const ConversationNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CONVERSATION_SCREEN"
                component={ConversationScreen}
                options={{ ...ScreenOptions.conversation, }}
            />
        </Stack.Navigator>
    )
}

export default ConversationNavigator