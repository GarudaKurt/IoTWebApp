import React, { useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

export const Dashboard = ({ navigation}) => {

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
        <View style={styles.formContainer}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Dashboard</Text>
                <Pressable style={styles.buttonRoom} onPress={bookRoom}>
                    <Icon name="calendar-plus-o" size={20} color="white" />
                    <Text style={styles.buttonText}>Schedule Room</Text>
                </Pressable>
                <Pressable style={styles.buttonEvent} onPress={addEvents}>
                    <Icon name="calendar" size={20} color="white" />
                    <Text style={styles.buttonText}>Schedule Event</Text>
                </Pressable>
                <Pressable style={styles.buttonResource} onPress={Resources}>
                    <Icon name="cogs" size={20} color="white" />
                    <Text style={styles.buttonText}>Book Resources</Text>
                </Pressable>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
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
    txtID: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'Arial, sans-serif',
        position: 'absolute',
        top: 0,
        left: 0,
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
        marginLeft: 5,
        textAlign: 'center',
        flex: 1
    },
})
