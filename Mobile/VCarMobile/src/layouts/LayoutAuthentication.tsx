import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, TextInput } from 'react-native-paper';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LanguageDialog from '../components/dialog/LanguageDialog';
import { useTranslation } from 'react-i18next';

const LayoutAuthentication = ({ title, desc, type, children }: {
    title: string,
    desc: string,
    type: string,
    children: React.ReactNode
}) => {
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [languageDialogVisible, setLanguageDialogVisible] = React.useState(false);
    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                backgroundColor: '#F5FCFF',
            }}
            keyboardShouldPersistTaps="handled"
        >
            <View className="flex-row items-center justify-end w-full pt-4 pr-4">
                <Pressable onPress={() => setLanguageDialogVisible(true)}>
                    <Icon name="globe-outline" size={28} color="black" />
                </Pressable>
            </View>
            <View className="items-center justify-center flex-1 px-6">
                <Text className="mb-2 text-3xl font-bold text-center text-text8">
                    {title}
                </Text>
                <Text className='mb-6 font-medium text-text2'>{desc}</Text>
                {children}
                {type !== 'VERIFY' && <>
                    <View className="flex-row items-center w-full mb-6">
                        <View className="flex-1 h-px bg-gray-300" />
                        <Text className="mx-4 text-text8">{type === "LOGIN" ? t('auth.login.oauth2') : t('auth.register.oauth2')}</Text>
                        <View className="flex-1 h-px bg-gray-300" />
                    </View>
                    <View className="flex-row justify-center mb-6">
                        <Button
                            icon={() => <Icon name="logo-google" size={20} />}
                            compact
                            mode="outlined"
                            className="mx-2"
                        >
                            Google
                        </Button>
                        <Button
                            icon={() => <Icon name="logo-facebook" size={20} />}
                            compact
                            mode="outlined"
                            className="mx-2"
                        >
                            Facebook
                        </Button>
                    </View>
                    <Pressable onPress={() => navigation.navigate(`${type === "LOGIN" ? "REGISTER_SCREEN" : "LOGIN_SCREEN"}`)}>
                        <Text className="text-sm text-text2">
                            {type === "LOGIN" ? t('auth.login.register') : t('auth.register.login')}{' '}
                            <Text className="font-bold text-text8">{type === "LOGIN" ? t('auth.register') : t('auth.login')}</Text>
                        </Text>
                    </Pressable>
                </>}
            </View>
            {languageDialogVisible && <LanguageDialog
                languageDialogVisible={languageDialogVisible}
                setLanguageDialogVisible={setLanguageDialogVisible}
            ></LanguageDialog>}
        </KeyboardAwareScrollView>
    )
}

export default LayoutAuthentication