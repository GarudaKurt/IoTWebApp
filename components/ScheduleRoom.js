import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, TextInput, Modal, Button } from 'react-native-web';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome'

const ScheduleRoom = ({navigation}) => {


  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeIn, setSelectedTimeIn] = useState('');
  const [selectedTimeEnd, setSelectedTimeEnd] = useState('');
  const [subjectCode, selectSubject] = useState('');
  const [userID, setuserID] = useState('');
  
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const dashBoard = () => {
    navigation.replace('Dashboards')
  }

  const logOut = () => {
    navigation.replace('Login')
  }

  /*This function will create new set of fields db date, start, end and subject code to the firestore */
  const updateDb = async () => {
    try {
      const scheduleSnapshot = await getDocs(collection(db, "users"));
      let conflictExists = false;
  
      scheduleSnapshot.forEach((doc) => {
        const scheduleData = doc.data();
        if (
          scheduleData.Date === selectedDate &&
          scheduleData.Start === selectedTimeIn &&
          scheduleData.End === selectedTimeEnd
        ) {
          conflictExists = true;
          console.log("Conflict schedule found:", scheduleData);
        }
      });
  
      if (conflictExists) {
        setModalMessage("There is a conflict in the schedule. Please choose a different date and time slot.");
        setModalVisible(true); // Show conflict modal
        return;
      } else {
        // Proceed to update database if no conflict
        const userRef = doc(db, "users", userID);
        const userSnapshot = await getDocs(collection(db, "users"));
        let userExists = false;
  
        userSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (parseInt(userData.userID) === parseInt(userID)) {
            userExists = true;
            console.log("User found:", userData);
            updateDoc(doc.ref, {
              Date: selectedDate,
              Start: selectedTimeIn,
              End: selectedTimeEnd,
              Code: subjectCode
              // Add other fields here if needed
            });
            console.log("Document updated for userID:", userID);
            setModalMessage("Successfully created!");
            setModalVisible(true); // Show success modal
          }
        });
  
        if (!userExists) {
          console.log("user ID not exist")
          return;
        }
      }
    } catch (error) {
      console.log("Error updating document: ", error);
    }
  }
  
  
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeChangeIn = (event) => {
    setSelectedTimeIn(event.target.value);
  };

  const handleTimeChangeEnd = (event) => {
    setSelectedTimeEnd(event.target.value);
  };

  const handleSubmit = () => {
    if (!selectedDate || !selectedTimeIn || !selectedTimeEnd || !subjectCode || !userID) {
      console.log("Empty fields!")
      return;
    }
    updateDb();
    console.log("Results: ", selectedDate, selectedTimeIn, selectedTimeEnd, subjectCode)
  }

  return (
    <View style={styles.formContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.logoutButtonContainer}>
            <Pressable style={styles.logoutButton} onPress={logOut}>
                <Icon name="sign-out" size={20} color="black" />
            </Pressable>
	      </View>
        <Text style={styles.title}>Book Schedule</Text>
        <Pressable onPress={dashBoard}>
          <Text>→ Dashboard</Text>
        </Pressable>
        <View style={styles.line}></View> {/* Horizontal line */}
        <View style={styles.inputContainer}>
          <Text style={styles.txtDate}>Select date</Text>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.txtDate}>Start Time</Text>
          <input
            type="time"
            value={selectedTimeIn}
            onChange={handleTimeChangeIn}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.txtDate}>End Time  </Text>
          <input
            type="time"
            value={selectedTimeEnd}
            onChange={handleTimeChangeEnd}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.txtSubject}>Subject</Text>
          <TextInput style={styles.subject} placeholder="Enter subject code" value={subjectCode} onChangeText={(subjectCode) => { selectSubject(subjectCode) }} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.txtUser}>User ID</Text>
          <TextInput style={styles.subject} placeholder="Enter your user id" value={userID} onChangeText={(userID) => { setuserID(userID) }} />
        </View>

        <Pressable style={styles.button} onPress={handleSubmit}>
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
  );
};

export default ScheduleRoom;

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
  line: {
    width: '40%',
    height: 1,
    backgroundColor: '#b2bec3',
    marginBottom: 20, // Adjust as needed
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 5,
    width: '20%',
  },
  txtDate: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },
  txtSubject: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 25,
  },
  txtUser: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 25,
  },
  input: {
    flex: 1,
    height: 40,
    width: 80,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  subject: {
    flex: 1,
    height: 40,
    width: 80,
    margin: 3,
    padding: 10,
    borderWidth: 1,
    borderRadius: 3,
  },
  button: {
    width: '20%',
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 3,
    alignItems: 'center',
    marginLeft: 30
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
});
