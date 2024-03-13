import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput,Pressable } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { db } from './firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome'

const EventCard = ({ event, onDelete, showModal }) => {
  const [isApproved, setIsApproved] = useState(false);

  const handleApprove = () => {
    setIsApproved(true);
  };

  return (
    <View style={[styles.cardContainer, styles.card, isApproved && styles.approvedCard]}>
      <Card>
        <Card.Content>
          <Title>{event.subjectcode}</Title>
          <Paragraph>Prof ID:{event.userid}</Paragraph>
          <Paragraph>Item: {event.tv}</Paragraph>
          <Paragraph>Item: {event.hdmi}</Paragraph>
          <Paragraph>Item: {event.projector}</Paragraph>
          <Paragraph>Sched: {event.schedule}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <TouchableOpacity onPress={handleApprove}>
            <Text style={[styles.buttonText, styles.approveButton]}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showModal(event)}>
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </Card.Actions>
      </Card>
    </View>
  );
};

const Researve = ({navigation}) => {
  const [events, setEvents] = useState([]);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [removeUserID, setRemoveUserID] = useState('');
  const [eventToRemove, setEventToRemove] = useState(null);
  const [userID, setUserID] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const dashboard = () => {
    navigation.replace('Admin');
  };
  const logOut = () => {
    navigation.replace('Login')
  }


  useEffect(() => {
    updateDb();
    setUserID(removeUserID);
  }, [removeUserID]);

  const updateDb = async () => {
    try {
      const userSnapshot = await getDocs(collection(db, "users"));
      const fetchedEvents = [];

      userSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.Code && userData.TV && userData.HDMI && userData.Projector && userData.userID, userData.Schedule) {
          fetchedEvents.push({
            id: doc.id, // Add id field
            subjectcode: userData.Code,
            hdmi: userData.HDMI,
            projector: userData.Projector,
            tv: userData.TV,
            userid: userData.userID,
            schedule: userData.Schedule
          });
        }
      });

      setEvents(fetchedEvents);
    } catch (error) {
      console.log("Error fetching events: ", error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      if (!eventToRemove) return;

      await deleteDoc(doc(db, "users", eventToRemove.id));
      setEvents(events.filter(event => event.id !== eventToRemove.id));
      setEventToRemove(null);
      setRemoveModalVisible(false);
    } catch (error) {
      console.log("Error deleting event: ", error);
    }
  };

  const handleRemoveEventSubmit = async () => {
    try {
      if (removeUserID === userID) {
        const updatedEvents = events.filter(event => event.id !== eventToRemove.id);
        setEvents(updatedEvents);

        const userSnapshot = await getDocs(collection(db, "users"));
        let userExists = false;

        userSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (parseInt(userData.userID) === parseInt(userID) && userData.Type === "Instructor") {
            userExists = true;
            updateDoc(doc.ref, {
              Code: '',
              TV: '',
              HDMI: '',
              Projector: '',
              Schedule: '',
            });
          }
        });

        if (!userExists) {
          setModalMessage("Access denied: only instructor can remove.");
          setModalVisible(true);
          return;
        }
        setRemoveModalVisible(false);
      } else {
        setModalMessage("Access denied: only instructor can remove.");
        setModalVisible(true);
      }
    } catch (error) {
      console.log("Error removing event: ", error);
    }
  };

  const showModal = (event) => {
    setEventToRemove(event);
    setRemoveModalVisible(true);
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.logoutButtonContainer}>
          <Pressable style={styles.logoutButton} onPress={logOut}>
              <Icon name="sign-out" size={20} color="black" />
          </Pressable>
      </View>
      <Text style={styles.title}> Admin Dashboard</Text>
      <Pressable onPress={dashboard}>
        <Text>→ Dashboard</Text>
      </Pressable>
      <ScrollView contentContainerStyle={styles.scrollContainer} horizontal={true}>
        {events.map((event, index) => (
          <EventCard key={index} event={event} onDelete={handleDeleteEvent} showModal={showModal} />
        ))}
      </ScrollView>

      <Modal
        visible={removeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRemoveModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your instructor id"
            value={removeUserID}
            onChangeText={setRemoveUserID}
          />
          <Button onPress={handleRemoveEventSubmit} >Submit </Button>
          <Button onPress={() => setRemoveModalVisible(false)} >Cancel</Button>
        </View>
      </Modal>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text>{modalMessage}</Text>
          <Button onPress={() => setModalVisible(false)} title="Close" />
        </View>
      </Modal>
    </View>
  );
};

export default Researve;

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
  cardContainer: {
    marginBottom: 10,
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  card: {
    width: 200,
  },
  buttonText: {
    color: 'red',
  },
  buttonModal: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 3,
    color: 'white'
  },
  buttonCancel: {
    backgroundColor: 'transparent',
    color: 'white',
    borderRadius: 3,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    margin: 50,
  },
  textInput: {
    height: 40,
    width: '15%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    marginTop: 20,
  },
  approveButton: {
    color: 'green',
  },
  approvedCard: {
    backgroundColor: 'lightgreen',
  },
});
