import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native-web'; // Import ScrollView
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';

const CalendarEvent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [eventDescription, setEventDescription] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [events, setEvents] = useState([]);

  const [userID, setUserID] = useState('')

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
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
  };

  const saveUpdate = () => {
    handleModalSubmit()
    updateDb()
  }
  /*This function will create new set of fields event title and event description to the firestore db */
  const updateDb = async () => {
    try {
      const userRef = doc(db, "users", userID);
      const userSnapshot = await getDocs(collection(db, "users"));
      let userExists = false;

      if(!eventTitle || !eventDescription) {
        console.log("Error fields required")
        return;
      }

      userSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (parseInt(userData.userID) === parseInt(userID)) {
          userExists = true;
          console.log("User found:", userData);
          updateDoc(doc.ref, {
            Title: eventTitle,
            Description: eventDescription,
          });
          console.log("Document updated for userID:", userID);
          console.log("Results:",userData)
          setModalMessage("Succesfully created!")
          setModalVisible(true); // Show success modal
        }
      });

      if (!userExists) {
        console.log("user ID not exist")
        return;
      }
    } catch (error) {
      console.log("Error updating document: ", error);
    }
  }

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}> Calendar Event</Text>
      
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
        visible={isModalVisible}
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
          <Button onPress={saveUpdate}>Submit</Button>
          <Button onPress={handleModalClose}>Cancel</Button>
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
