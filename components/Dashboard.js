import React from 'react'
import {  StyleSheet, Text, View, SafeAreaView, Pressable, Button } from 'react-native-web'

export const Dashboard = ({navigation}) => {

    const bookRoom = () => {
        navigation.replace('BookRoom')
    }
    const addEvents = () => {
        navigation.replace('Events')
    }

    const Resources = () => {
        navigation.replace('Resources')
    }
  return (
    <View style={style.formContainer}>
        <SafeAreaView style={style.container}>
            <Text style={style.title}>Dashboard</Text>
            <Pressable style={style.buttonRoom} onPress={bookRoom}>
                <Text style={style.buttonText}>Schedule Room</Text>
            </Pressable>
            <Pressable style={style.buttonEvent} onPress={addEvents}>
                <Text style={style.buttonText}>Schedule Event</Text>
            </Pressable>
            <Pressable style={style.buttonResource} onPress={Resources}>
                <Text style={style.buttonText}>Book Resources</Text>
            </Pressable>
        </SafeAreaView>
    </View>

  )
}

const style =  StyleSheet.create({
    formContainer: {
        backgroundColor: '#f5f6fa',
        borderRadius: 10,
        padding: 20,
    },
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonEvent: {
        width: '30%',
        backgroundColor: 'blue',
        padding: 10,
        alignItems: 'center',
        marginBottom: 5,
        borderRadius: 3
    },
    buttonResource: {
        width: '30%',
        backgroundColor: 'gray',
        padding: 10,
        alignItems: 'center',
        marginBottom: 5,
        borderRadius: 3
    },
    buttonRoom: {
        width: '30%',
        backgroundColor: 'green',
        padding: 10,
        alignItems: 'center',
        marginBottom: 5,
        borderRadius: 3
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
})