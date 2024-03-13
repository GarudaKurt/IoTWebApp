import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Pressable, Picker, Modal, Button } from 'react-native-web'
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome'

const BookResources = ({navigation}) => {
    const [bookTV, setBookTV] = useState('');
    const [bookHDMI, setBookHDMI] = useState('')
    const [bookProjector, setBookProjecttor] = useState('')
    const [userID, setuserID] = useState('');
    const [schedule, setSchedule] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    
    const dashBoard = () => {
      navigation.replace('Dashboards')
    }

    const logOut = () => {
      navigation.replace('Login')
    }
  
/*This function will create new set of fields db date, start, end and subject code to the firestore */
  const updateDb = async () => {
    try {
      const userRef = doc(db, "users", userID);
      const userSnapshot = await getDocs(collection(db, "users"));
      let userExists = false;

      userSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (parseInt(userData.userID) === parseInt(userID) && userData.Type === "Instructor") {
          userExists = true;
          console.log("User found:", userData);
          updateDoc(doc.ref, {
            TV: bookTV,
            HDMI: bookHDMI,
            Projector: bookProjector,
            Schedule: schedule,
            // Add other fields here if needed
          });
          console.log("Document updated for userID:", userID);
          setModalMessage("Succesfully created!")
          setModalVisible(true); // Show success modal
        }
      });

      if (!userExists) {
        setModalMessage("Access denied only instructor can book!")
        setModalVisible(true); // Show success modal
        return;
      }
    } catch (error) {
      console.log("Error updating document: ", error);
    }
  }
  return (
    <View style={styles.formContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.logoutButtonContainer}>
            <Pressable style={styles.logoutButton} onPress={logOut}>
                <Icon name="sign-out" size={20} color="black" />
            </Pressable>
        </View>  
        <Text style={styles.title}>Book Resources</Text>
        <Pressable onPress={dashBoard}>
          <Text>→ Dashboard</Text>
        </Pressable>
        <TextInput
          style={styles.input}
          placeholder='Enter your id'
          value={userID}
          onChangeText={(userID) => { setuserID(userID) }}
        />

        <TextInput
          style={styles.input}
          placeholder='02-29-2024 3:30-4:30 PM'
          value={schedule}
          onChangeText={(schedule) => { setSchedule(schedule) }}
        />

        <Picker
          selectedValue={bookTV}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setBookTV(itemValue)}
        >
          <Picker.Item label="Select Items" value="" />
          <Picker.Item label="Smart TV" value="Smart TV" />
          <Picker.Item label="HDMI" value="HDMI" />
          <Picker.Item label="Projector" value="Projector" />
        </Picker>

        <Picker
          selectedValue={bookHDMI}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setBookHDMI(itemValue)}
        >
          <Picker.Item label="Select Items" value="" />
          <Picker.Item label="Smart TV" value="Smart TV" />
          <Picker.Item label="HDMI" value="HDMI" />
          <Picker.Item label="Projector" value="Projector" />
        </Picker>

        <Picker
          selectedValue={bookProjector}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setBookProjecttor(itemValue)}
        >
          <Picker.Item label="Select Items" value="" />
          <Picker.Item label="Smart TV" value="Smart TV" />
          <Picker.Item label="HDMI" value="HDMI" />
          <Picker.Item label="Projector" value="Projector" />
        </Picker>

        <Pressable style={styles.button} onPress={updateDb}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <Button title="OK" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
        
      </SafeAreaView>
    </View>
  )
}
export default BookResources

const styles = StyleSheet.create({
    formContainer: {
      backgroundColor: '#f5f6fa',
      borderRadius: 10,
      padding: 20
    },
    container: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center'
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
      marginBottom: 20
    },
    input: {
      height: 40,
      margin: 5,
      padding: 10,
      borderWidth: 1,
      borderRadius: 3
    },
    picker: {
      height: 40,
      marginVertical: 5,
      borderWidth: 1,
      borderRadius: 3,
      width: '15%'
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
      textAlign: 'center'
    },
    buttonLogin: {
      width: '100%',
      backgroundColor: 'transparent',
      padding: 5,
      alignItems: 'center',
    },
    footerText: {
      marginTop: 5,
      color: '#189AB4'
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });
  