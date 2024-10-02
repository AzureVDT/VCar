import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import VerifyCodeScreen from './screens/VerifyCodeScreen';
import { PaperProvider } from 'react-native-paper';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './store/configureStore';
import { getTokens } from './utils/auth';
import TabNavigator from './modules/navigator/TabNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isRecheckToken } = useSelector((state: RootState) => state.auth);
  const [tokens, setTokens] = useState({
    accessToken: '',
    refreshToken: ''
  });
  useEffect(() => {
    const fetchTokens = async () => {
      const retrievedTokens = await getTokens();
      setTokens({
        accessToken: retrievedTokens?.accessToken || '',
        refreshToken: retrievedTokens?.refreshToken || ''
      });
    };

    fetchTokens();
  }, [isRecheckToken]);

  return (
    <Stack.Navigator>
      {tokens.accessToken ? (
        <Stack.Screen name="MAIN_SCREEN" component={TabNavigator} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name='LOGIN_SCREEN' component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name='REGISTER_SCREEN' component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name='VERIFY_CODE_SCREEN' component={VerifyCodeScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
