import React from 'react'
import {  StyleSheet, Text, View, SafeAreaView, Pressable, Button } from 'react-native-web'

export const AdminDashboard = ({navigation}) => {

    const RoomBooking = () => {
        navigation.replace('Events')
    }

    const adminBoardEvent = () => {
        navigation.replace('BoardEvent')
    }

    const ResourcesBooking = () => {
        navigation.replace('Resources')
    }
  return (
    <View style={style.formContainer}>
        <SafeAreaView style={style.container}>
            <Text style={style.title}>Dashboard</Text>
            <Pressable style={style.buttonRoom} onPress={RoomBooking}>
                <Text style={style.buttonText}>Room Reservation</Text>
            </Pressable>
            <Pressable style={style.buttonEvent} onPress={adminBoardEvent}>
                <Text style={style.buttonText}>Calendar Events</Text>
            </Pressable>
            <Pressable style={style.buttonResource} onPress={ResourcesBooking}>
                <Text style={style.buttonText}>Resources Booking</Text>
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