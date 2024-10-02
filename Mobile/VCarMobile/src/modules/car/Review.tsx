import { View, Text } from 'react-native'
import React from 'react'
import { Avatar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/AntDesign';
import { IReview } from '../../store/car/types';
import { DEFAULT_AVATAR } from '../../constants';

const Review = ({
    review
}: {
    review: IReview
}) => {
    if (!review) return null
    return (
        <View className="flex-row mt-4">
            <Avatar rounded source={{ uri: review?.lessee?.image_url ?? DEFAULT_AVATAR }} size="medium" />
            <View className="flex-1 ml-4">
                <Text className="text-sm font-bold text-gray-900">{review?.lessee?.display_name}</Text>
                <Text className="text-xs text-gray-500">Aug 12, 2021</Text>
                <Text className="mt-2 text-sm text-text3">
                    {review?.comment}
                </Text>
            </View>
            <View className="flex-row items-center justify-center gap-2 ml-auto">
                <Text className="text-sm font-bold text-semiPrimary">{review?.rating}</Text>
                <Icon name='star' color={"#EE632C"}></Icon>
            </View>
        </View>
    )
}

export default Review