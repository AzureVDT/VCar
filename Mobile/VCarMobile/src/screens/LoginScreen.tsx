import React, { useEffect } from 'react';
import { View, Text, Pressable, ToastAndroid, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import LayoutAuthentication from '../layouts/LayoutAuthentication';
import { useTranslation } from 'react-i18next';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { LOGIN } from '../store/auth/actions';
import Loading from '../components/common/Loading';
import { RootState } from '../store/configureStore';
import { validateEmail, validatePassword } from '../utils/validate';
import { setIsRecheckToken } from '../store/auth/reducers';

const LoginScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [showPassword, setShowPassword] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { isRecheckToken } = useSelector((state: RootState) => state.auth);
    const [errorType, setErrorType] = React.useState({
        require: {
            email: false,
            password: false
        },
        validate: {
            email: false,
            password: false
        }
    });
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { loading, error, access_token } = useSelector((state: RootState) => state.auth);

    const handleLogin = async () => {
        // Reset error state
        setErrorType({
            require: {
                email: false,
                password: false
            },
            validate: {
                email: false,
                password: false
            }
        });

        // Pre-validation
        let hasError = false;
        if (!username) {
            setErrorType((prev) => ({ ...prev, require: { ...prev.require, email: true } }));
            hasError = true;
        }
        if (!password) {
            setErrorType((prev) => ({ ...prev, require: { ...prev.require, password: true } }));
            hasError = true;
        }
        if (username && !validateEmail(username)) {
            setErrorType((prev) => ({ ...prev, validate: { ...prev.validate, email: true } }));
            hasError = true;
        }
        if (password && !validatePassword(password)) {
            setErrorType((prev) => ({ ...prev, validate: { ...prev.validate, password: true } }));
            hasError = true;
        }

        if (!hasError) {
            // Call API if no pre-validation errors
            dispatch({ type: LOGIN, payload: { username, password } });
        }
    };

    useEffect(() => {
        if (access_token) {
            Alert.alert('Login Success', t('auth.login.success'), [{ text: 'OK' }]);
            dispatch(setIsRecheckToken(!isRecheckToken));
        } else if (error) {
            Alert.alert('Login Failed', t('auth.login.failed'), [{ text: 'OK' }]);
        }
    }, [access_token, error, navigation]);

    return (
        <LayoutAuthentication
            title={t('auth.login.title')}
            desc={t('auth.login.desc')}
            type='LOGIN'
        >
            <TextInput
                label={t('auth.login.email')}
                mode="outlined"
                className="w-full mb-2"
                keyboardType="email-address"
                outlineStyle={{ borderRadius: 10 }}
                value={username}
                onChangeText={(text) => setUsername(text)}
            />

            <View className='flex-row items-center justify-start w-full mb-2'>
                {errorType.require.email ? <Text className="text-error">{t('validate.required')}</Text> : null}
                {errorType.validate.email ? <Text className="text-error">{t('validate.email')}</Text> : null}
            </View>

            <TextInput
                label={t('auth.login.password')}
                mode="outlined"
                className="w-full mb-4"
                secureTextEntry={!showPassword}
                right={<TextInput.Icon icon={showPassword ? "eye-outline" : "eye-off-outline"} onPress={() => setShowPassword(!showPassword)} />}
                outlineStyle={{ borderRadius: 10 }}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            <View className='flex-row items-center justify-start w-full mb-2'>
                {errorType.require.password ? <Text className="text-error">{t('validate.required')}</Text> : null}
                {errorType.validate.password ? <Text className="text-error">{t('validate.password')}</Text> : null}
            </View>

            <View className="flex-row items-center justify-end w-full mr-2">
                <Pressable>
                    <Text className="mb-6 text-sm text-text2">{t('auth.login.forgot_password')}</Text>
                </Pressable>
            </View>
            <Button mode="contained" className="flex items-center justify-center w-full mb-4" disabled={loading} onPress={handleLogin}>
                {!loading ? t('auth.login') : <Loading />}
            </Button>
        </LayoutAuthentication>
    );
};

export default LoginScreen;
