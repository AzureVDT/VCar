import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import LayoutMain from '../layouts/LayoutMain';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/configureStore';
import { GET_ME } from '../store/profile/action';
import { removeTokens } from '../utils/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { setIsRecheckToken } from '../store/auth/reducers';
import { DEFAULT_AVATAR } from '../constants';

const PersonalScreen = () => {
    const dispatch = useDispatch();
    const { me } = useSelector((state: RootState) => state.profile);
    const { isRecheckToken } = useSelector((state: RootState) => state.auth);
    console.log("PersonalScreen ~ me:", me)
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const handleLogout = async () => {
        await removeTokens();
        dispatch(setIsRecheckToken(!isRecheckToken));
    }

    useEffect(() => {
        dispatch({ type: GET_ME })
    }, [])
    return (
        <LayoutMain>
            <Text className="mt-10 mb-4 text-2xl font-bold text-text8">Profile</Text>

            {/* Thẻ Profile */}
            <View className="flex-row items-center p-4 mb-6 bg-blue-500 rounded-xl">
                <Image
                    source={{ uri: DEFAULT_AVATAR }}
                    className="object-contain w-12 h-12 mr-4 rounded-full"
                />
                <View>
                    <Text className="font-bold text-white">{me.display_name}</Text>
                    <Text className="text-white">{me.email}</Text>
                </View>
            </View>

            {/* Danh sách chức năng */}
            <View className="mb-[250px] space-y-4">
                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200">
                    <Icon name="account-circle" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">Account Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200">
                    <Icon name="credit-card" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">Billing</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200">
                    <Icon name="lock" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">Change Password</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200">
                    <Icon name="drive-eta" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">Update license</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-200">
                    <Icon name="perm-identity" type="material" color="#000" size={24} />
                    <Text className="ml-4 text-base font-medium uppercase text-text8">Update citizen identification</Text>
                </TouchableOpacity>

                <Button
                    title="Logout"
                    buttonStyle={{
                        backgroundColor: '#103F74',
                        borderRadius: 30,
                        paddingVertical: 12,
                    }}
                    titleStyle={{
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                    }}
                    containerStyle={{
                        marginTop: 180,
                    }}
                    onPress={handleLogout}
                />
            </View>

            {/* Nút Logout */}
        </LayoutMain>
    );
};

export default PersonalScreen;