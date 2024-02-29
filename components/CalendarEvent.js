import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, ScrollView, Pressable } from 'react-native'; // Updated import
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { db } from './firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome'

const CalendarEvent = ({navigation}) => {
  
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

  const dashBoard = () =>{
    navigation.replace('Dashboards')
  }
  const logOut = () => {
    navigation.replace('Login')
  }
  const handleAddButtonClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleModalSubmit = () => {
    const newEvent = {
      title: eventTitle,
      description: eventDescription
    };
    setEvents([...events, newEvent]);
    setIsModalVisible(false);
    setEventTitle('');
    setEventDescription('');
  };

  const handleDeleteEvent = (index) => {
    setEventIndexToRemove(index);
    setRemoveModalVisible(true);
  };

  const handleRemoveModalClose = () => {
    setRemoveModalVisible(false);
    setUserID('');
  };

  const handleRemoveEventSubmit = () => {
    if (removeUserID === userID) {
      const updatedEvents = [...events];
      updatedEvents.splice(eventIndexToRemove, 1);
      setEvents(updatedEvents);
      handleRemoveModalClose();
    } else {
      setModalMessage("Access dinied only instructor can remove.");
      setModalVisible(true);
    }
  };

  const updateDb = async () => {
    try {
      const userRef = doc(db, "users", userID);
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
          console.log("User found:", userData);
          updateDoc(doc.ref, {
            Title: eventTitle,
            Description: eventDescription,
          });
          console.log("Document updated for userID:", userID);
          console.log("Results:", userData);
          handleModalSubmit();
        }
      });

      if (!userExists) {
        setModalMessage("Access denied only instructor could only add event");
        setModalVisible(true);
        console.log("user ID not exist");
        setModalVisible(true);
        return;
      }
    } catch (error) {
      console.log("Error updating document: ", error);
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.logoutButtonContainer}>
          <Pressable style={styles.logoutButton} onPress={logOut}>
              <Icon name="sign-out" size={20} color="black" />
          </Pressable>
      </View>  
      <Text style={styles.title}> Calendar Event</Text>
      <Pressable onPress={dashBoard}>
          <Text>→ Dashboard</Text>
      </Pressable>

      <Button onPress={handleAddButtonClick}>Add Event</Button>

      <ScrollView contentContainerStyle={styles.scrollContainer} horizontal={true}>
        {events.map((event, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <Title>{event.title}</Title>
              <Paragraph>{event.description}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleDeleteEvent(index)}>Remove</Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <Modal
        visible={isModalVisible} // Update to isModalVisible
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your instructor id"
            value={userID}
            onChangeText={setUserID}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your title"
            value={eventTitle}
            onChangeText={setEventTitle}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Enter event description"
            value={eventDescription}
            onChangeText={setEventDescription}
          />
          <Button onPress={updateDb}>Submit</Button>
          <Button onPress={handleModalClose}>Cancel</Button>
        </View>
      </Modal>

      <Modal
        visible={removeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleRemoveModalClose}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your instructor id"
            value={removeUserID}
            onChangeText={setRemoveUserID}
          />
          <Button onPress={handleRemoveEventSubmit}>Submit</Button>
          <Button onPress={handleRemoveModalClose}>Cancel</Button>
        </View>
      </Modal>

      {/* Modal for displaying messages */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)} // Close modal when pressing the back button
      >
        <View style={styles.modalContainer}>
          <Text>{modalMessage}</Text>
          <Button onPress={() => setModalVisible(false)}>OK</Button>
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