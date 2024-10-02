import AsyncStorage from '@react-native-async-storage/async-storage';

const saveTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
  } catch (error) {
    console.error('Error saving tokens', error);
  }
};

const getTokens = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    return {accessToken, refreshToken};
  } catch (error) {
    console.error('Error retrieving tokens', error);
  }
};

const removeTokens = async () => {
  try {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('Error removing tokens', error);
  }
};

export {saveTokens, getTokens, removeTokens};
