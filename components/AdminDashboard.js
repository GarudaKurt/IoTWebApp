import React from 'react'
import {  StyleSheet, Text, View, SafeAreaView, Pressable, Button } from 'react-native-web'
import Icon from 'react-native-vector-icons/FontAwesome'

export const AdminDashboard = ({navigation}) => {

    const RoomBooking = () => {
        navigation.replace('RoomBook')
    }

    const adminBoardEvent = () => {
        navigation.replace('BoardEvent')
    }

    const ResourcesBooking = () => {
        navigation.replace('Researves')
    }

    const Attendance = () => {
        navigation.replace('Attend')
    }
    const Arduino = () => {
        navigation.replace('arduino')
    }
    const logOut = () => {
        navigation.replace('Login')
    }
  return (
    <View style={style.formContainer}>
        <SafeAreaView style={style.container}>
            
            <View style={style.logoutButtonContainer}>
                <Pressable style={style.logoutButton} onPress={logOut}>
                    <Icon name="sign-out" size={20} color="black" />
                </Pressable>
            </View>  
            <Text style={style.title}>Dashboard</Text>
            <Pressable style={style.buttonRoom} onPress={RoomBooking}>
                <Icon name="calendar-plus-o" size={20} color="white" />
                <Text style={style.buttonText}>Room Reservation</Text>
            </Pressable>
            <Pressable style={style.buttonEvent} onPress={adminBoardEvent}>
                <Icon name="calendar" size={20} color="white" />
                <Text style={style.buttonText}>Calendar Events</Text>
            </Pressable>
            <Pressable style={style.buttonResource} onPress={ResourcesBooking}>
                <Icon name="cogs" size={20} color="white" />
                <Text style={style.buttonText}>Resources Booking</Text>
            </Pressable>
            <Pressable style={style.buttonAttend} onPress={Attendance}>
                    <Icon name="id-card" size={20} color="white" />
                    <Text style={style.buttonText}>Attendance Board</Text>
            </Pressable>
            <Pressable style={style.buttonAttend} onPress={Arduino}>
                    <Icon name="id-card" size={20} color="white" />
                    <Text style={style.buttonText}>Arduino Board</Text>
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
    logoutButtonContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 0
    },
    logoutButton: {
        padding: 5,
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
    buttonAttend: {
        width: '30%',
        backgroundColor: '#ffeaa7',
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