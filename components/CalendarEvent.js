import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { db } from './firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Pressable } from 'react-native-web';

const CalendarEvent = ({ navigation }) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [eventDescription, setEventDescription] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [events, setEvents] = useState([]);
  const [userID, setUserID] = useState('');
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [eventIndexToRemove, setEventIndexToRemove] = useState(null);
  const [removeUserID, setRemoveUserID] = useState('');
  const [boardEvent, setBoardEvents] = useState([]);

  const dashBoard = () => {
    navigation.replace('Dashboards')
  }

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleModalSubmit = () => {
    const newEvent = {
      title: eventTitle,
      description: eventDescription
    };
    setBoardEvents([...boardEvent, newEvent]); // Update boardEvent state
    setIsModalVisible(false);
    setEventTitle('');
    setEventDescription('');
    setUserID(''); // Reset userID field after submission
  };

  const handleDeleteEvent = (index) => {
    setEventIndexToRemove(index);
    setRemoveModalVisible(true);
  };

  const handleRemoveModalClose = () => {
    setRemoveModalVisible(false);
    setRemoveUserID('');
  };

  const handleRemoveEventSubmit = async (index) => {
    try {
      if (removeUserID === userID) {
        const updatedEvents = [...boardEvent];
        updatedEvents.splice(index, 1);
        setBoardEvents(updatedEvents);
  
        const userRef = doc(db, "users", userID);
        if (!userID) return;
  
        const userSnapshot = await getDocs(collection(db, "users"));
        let userExists = false;
  
        userSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (parseInt(userData.userID) === parseInt(userID) && userData.Type === "Instructor") {
            userExists = true;
            updateDoc(doc.ref, {
              Title: '',
              Description: '',
            });
          }
        });
  
        if (!userExists) {
          setModalMessage("Access denied. Only instructors can remove events.");
          setModalVisible(true);
          return;
        }
        handleRemoveModalClose();
      } else {
        setModalMessage("Access denied. Only instructors can remove events.");
        setModalVisible(true);
      }
    } catch (error) {
      console.log("Error removing event: ", error);
    }
  };
  

  const updateDb = async () => {
    try {
      const userRef = doc(db, "users", userID);
      if(!userID)
        return
      const userSnapshot = await getDocs(collection(db, "users"));
      let userExists = false;

      if (!eventTitle || !eventDescription) {
        console.log("Error fields required")
        return;
      }

      userSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (parseInt(userData.userID) === parseInt(userID) && userData.Type === "Instructor") {
          userExists = true;
          updateDoc(doc.ref, {
            Title: eventTitle,
            Description: eventDescription,
          });
          handleModalSubmit();
        }
      });

      if (!userExists) {
        setModalMessage("Access denied only instructor could only add event");
        setModalVisible(true);
        return;
      }
    } catch (error) {
      console.log("Error updating document: ", error);
    }
  };

  const fetchData = async () => {
    try {
      const userSnapshot = await getDocs(collection(db, "users"));
      const fetchedEvents = [];

      userSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.Title && userData.Description) {
          fetchedEvents.push({
            title: userData.Title,
            description: userData.Description
          });
        }
      });

      setBoardEvents(fetchedEvents);
    } catch (error) {
      console.log("Error fetching events: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}> Calendar Event</Text>
      <Pressable onPress={dashBoard}>
        <Text>→ Dashboard</Text>
      </Pressable>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Event Title"
            value={eventTitle}
            onChangeText={setEventTitle}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Event Description"
            value={eventDescription}
            onChangeText={setEventDescription}
          />
          {/* Include userID input in the modal */}
          <TextInput
            style={styles.textInput}
            placeholder="User ID"
            value={userID}
            onChangeText={setUserID}
          />
          <Button onPress={handleModalSubmit}>Submit</Button>
        </View>
      </Modal>

      <Modal
        visible={removeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleRemoveModalClose}
      >
        {/* Modal Content */}
      </Modal>

      {/* Modal for displaying messages */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Modal Content */}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    marginBottom: 10,
    marginRight: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 100,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

export default CalendarEvent;
