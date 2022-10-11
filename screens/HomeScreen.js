import { View, Text, SafeAreaView, Image, Button} from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import {PlusCircleIcon} from 'react-native-heroicons/solid'
const HomeScreen = () => {
    const navigation = useNavigation();

    useLayoutEffect( () => {
        navigation.setOptions( {
            headerShown:false,
        });
    },[])
    return (
        <SafeAreaView className="bg-cyan-900 flex-1">  
            <View className="flex-row pb-3 items-center mx-4 space-x-2">
                <Image
                    source={{ uri: "https://i.pinimg.com/564x/39/44/28/394428dcf049dbc614b3a34cef24c164.jpg" }}
                    className="h-10 w-10 bg-white rounded-full"
                />
                <View>
                    <Text className="font-bold text-gray-400 text-xs">
                        Chad Chadidovich
                    </Text>
                    <Text className="font-bold text-lg">Find a workout buddy</Text>
                </View>
            </View>
            <View className="self-center">
                <Text className="font-bold text-shmazure-400">
                    Add a workout
                </Text>
                <PlusCircleIcon size={200} color="#03dac6"/>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen