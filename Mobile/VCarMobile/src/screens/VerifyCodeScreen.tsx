import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput as RNTextInput, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import LayoutAuthentication from '../layouts/LayoutAuthentication';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { VERIFY_CODE } from '../store/auth/actions';
import { RootState } from '../store/configureStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Loading from '../components/common/Loading';
import { setIsRecheckToken } from '../store/auth/reducers';

const VerifyCodeScreen = () => {
    const { loading, error, email, verification_code, email_verified } = useSelector((state: RootState) => state.auth);
    const [code, setCode] = useState<string[]>(
        Array.from({ length: verification_code.length || 6 }, () => ''),
    );
    const { isRecheckToken } = useSelector((state: RootState) => state.auth);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const { t } = useTranslation();
    const inputRefs = useRef<(RNTextInput | null)[]>([]);
    const dispatch = useDispatch();

    const handleVerifyCode = () => {
        const enteredCode = code.join('');
        dispatch({ type: VERIFY_CODE, payload: { email, verification_code: enteredCode } });
    };

    useEffect(() => {
        if (email_verified) {
            Alert.alert('Verify Success', t('verify_code.success'), [{ text: 'OK' }]);
            // navigation.navigate('HOME_SCREEN');
            dispatch(setIsRecheckToken(!isRecheckToken));
        } else if (error) {
            Alert.alert('Verify Failed', t('verify_code.failed'), [{ text: 'OK' }]);
        }
    }, [email_verified, error, navigation]);

    const handleChangeText = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text) {
            if (index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        } else {
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    return (
        <LayoutAuthentication
            title={t('verify_code.title')}
            desc={t('verify_code.desc')}
            type="VERIFY"
        >
            <View className="flex-row justify-between w-4/5 mb-8">
                {code.map((digit, index) => (
                    <RNTextInput
                        key={index}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        value={digit}
                        onChangeText={(text) => handleChangeText(text, index)}
                        keyboardType="numeric"
                        maxLength={1}
                        className="w-12 h-12 text-2xl text-center border border-[#ccc] rounded-lg text-[#333]"
                    />
                ))}
            </View>
            <Button
                mode="contained"
                onPress={handleVerifyCode}
                className="w-4/5 py-2 bg-blue-500 rounded-lg"
                disabled={loading}
            >
                {!loading ? t('verify_code.submit') : <Loading />}
            </Button>
        </LayoutAuthentication>
    );
};

export default VerifyCodeScreen;
