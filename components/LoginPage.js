import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Pressable, Modal, Button } from 'react-native-web';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const LoginPage = ({ navigation }) => {
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('')

    const handleLogin = () => {
        navigation.replace('Signup');
    };

    const dashBoard = () => {
 
        navigation.replace('Dashboards')
    }

    const studentBoard = () => {
        navigation.replace('Board')
    }

    const adminBoard = () => {
        navigation.replace('Admin')
    }
    
    const RetrieveData = async () => {
        if (!userID || !password) {
            setModalMessage('Empty fields required!')
            setModalVisible(true);
            return;
        }
    
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            let userExists = false;
            querySnapshot.forEach(doc => {
                const userData = doc.data();
                if (parseInt(userData.userID) === parseInt(userID) && userData.password === password) {
                    userExists = true;
                    console.log("User found:", userData);
                    setModalMessage("Successfully Login!")
                    setModalVisible(true)
                    setTimeout(() => {
                        if(userData.Type === "Instructor") {
                           dashBoard()
                        } else if(userData.Type === "Student") {
                            studentBoard()
                        } else {
                            adminBoard()
                        }
                    },2000)
                }
            });
            if (!userExists) {
                setModalMessage("User does not exist!")
                setModalVisible(true)
                console.log("User does not exist");
            }
        } catch (error) {
            console.log("Error getting documents: ", error);
        }
    };
    
    return (
        <View style={styles.formContainer}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Smart Lab App</Text>

                <TextInput
                    style={styles.input} placeholder='UserID'
                    value={userID} onChangeText={(userID) => { setUserID(userID) }} />

                <TextInput style={styles.input} placeholder='Password'
                    value={password} onChangeText={(password) => { setPassword(password) }} secureTextEntry={true} />

                <Pressable style={styles.button} onPress={RetrieveData}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>

                <Text style={styles.footer}> Don't have an account yet?</Text>
                <Pressable style={styles.buttonCreate} onPress={handleLogin}>
                    <Text style={styles.footerCreate}>Create one</Text>
                </Pressable>
            </SafeAreaView>

            {/* Modal for warning */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <Button title="OK" onPress={() => setModalVisible(!modalVisible)} />
                    </View>
                </View>
                
            </Modal>
        </View>
    );
};

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
    input: {
        height: 40,
        margin: 5,
        padding: 10,
        borderWidth: 1,
        borderRadius: 3,
    },
    button: {
        width: '20%',
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
        marginTop: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    footer: {
        fontSize: 15,
        marginTop: 10,
        textAlign: 'center',
    },
    buttonCreate: {
        width: '100%',
        backgroundColor: 'transparent',
        padding: 5,
        alignItems: 'center',
    },
    footerCreate: {
        color: '#189AB4',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default LoginPage;
