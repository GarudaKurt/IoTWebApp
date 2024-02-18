  import React, { useState } from 'react';
  import { StyleSheet, Text, View, SafeAreaView, Pressable, TextInput } from 'react-native-web';
  import { db } from './firebaseConfig';
  import { collection, addDoc, getDocs, updateDoc } from 'firebase/firestore';

  const ScheduleRoom = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeIn, setSelectedTimeIn] = useState('');
    const [selectedTimeEnd, setSelectedTimeEnd] = useState('');
    const [subjectCode, selectSubject] = useState('');
    const [userID, setuserID] = useState('')

    //query to update Data from this userID
    const updateDb = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        let userExists = false;
        querySnapshot.forEach(async (doc) => {
          const userData = doc.data();
          if (parseInt(userData.userID) === parseInt(userID)) {
            userExists = true;
            console.log("User found:", userData);
            // Update existing document
            await updateDoc(doc.ref, {
              Date: selectedDate,
              Start: selectedTimeIn,
              End: selectedTimeEnd,
              Code: subjectCode
            });
            console.log("Document updated for userID:", userID);
          }
        });
        if (!userExists) {
          // Create new document
          const docRef = await addDoc(collection(db, "users"), {
            userID: userID,
            Date: selectedDate,
            Start: selectedTimeIn,
            End: selectedTimeEnd,
            Code: subjectCode
          });
          console.log("New document created with ID:", docRef.id);
        }
      } catch (error) {
        console.log("Error retrieving/updating documents: ", error);
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
      if(!selectedDate || !selectedTimeIn || !selectedTimeEnd || !subjectCode || !userID) {
        console.log("Empty fields!")
        return;
      }
      updateDb()
      console.log("Results: ",selectedDate, selectedTimeIn, selectedTimeEnd, subjectCode)
    }

    return (
      <View style={styles.formContainer}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Book Schedule</Text>
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
            <Text style={styles.txtSubject}>Subject  </Text>
            <TextInput style={styles.subject} placeholder="Enter subject code" value={subjectCode} onChangeText={(subjectCode) => {selectSubject(subjectCode)}}/>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.txtUser}>User ID     </Text>
            <TextInput style={styles.subject} placeholder="Enter your user id" value={userID} onChangeText={(userID) => {setuserID(userID)}}/>
          </View>

          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
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
      marginRight: 20,
    },
    txtUser: {
      fontSize: 12,
      fontWeight: 'bold',
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 40,
      width: 100,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    subject: {
      flex: 1,
      height: 40,
      margin: 3,
      padding: 10,
      borderWidth: 1,
      borderRadius: 3,
    },
    button: {
      width: '10%',
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
      marginTop: 3,
      alignItems: 'center',
      marginLeft: 15
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
