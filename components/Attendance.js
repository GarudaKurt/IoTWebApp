import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
import { firebaseDatabase } from './firebaseConfig'; //import  for realtime db
import { ref, onValue, off } from 'firebase/database'; //import for realtime db
import { db } from './firebaseConfig'; //import this firebaseConfiguration
import { collection, addDoc, getDocs, updateDoc } from 'firebase/firestore'; //import for firestore
import { Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'

export const Attendance = ({navigation}) => {
    const [data, setData] = useState(null);

    const [badgeIN, setBadgeIN] = useState('');
    const [badgeOUT, setBadgeOUT] = useState('');
    const [userId, setUserId] = useState('');
    const [date, setDate] = useState('');
    const [events, setEvents] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const logOut = () => {
      navigation.replace('Login')
    }

    const dashboard = () => {
      navigation.replace('Admin');
    };

    //this function will fetch the data from the realtime db
    useEffect(() => {
      const databaseRef = ref(firebaseDatabase, 'info'); //this info is the reference of my realtime
      const fetchData = (snapshot) => {
          if (snapshot.exists()) {
              const retrieveData = snapshot.val();
              setData(retrieveData);
  
              // Check if retrieveData is not null before accessing its properties
              if (retrieveData) {
                  setUserId(retrieveData.userID);
                  setBadgeIN(retrieveData.badgeIn);
                  setBadgeOUT(retrieveData.badgeOut);
                  setDate(retrieveData.date);
              }
          } else {
              console.log('No data available');
          }
      };
  
      const handleError = (error) => {
          console.error('Error fetching data:', error);
      };
  
      onValue(databaseRef, fetchData, handleError);
  
      // Cleanup function to remove the listener when the component unmounts
      return () => {
          off(databaseRef, 'value', fetchData);
      };
  }, []);
  
  // Call updateDb() whenever userId, badgeIN, badgeOUT, or date changes
  useEffect(() => {
      if (userId && badgeIN && badgeOUT && date) {
          updateDb();
      }
  }, [userId, badgeIN, badgeOUT, date]);
  
  
    console.log("My debug logs Infos ", userId, badgeIN, badgeOUT, date)
    //handle to update the firestore if ever they new data from the realtime
    const updateDb = async () => {
        try {
            const userSnapshot = await getDocs(collection(db, 'users'));
            let userExists = false;

            userSnapshot.forEach((doc) => {
                const userData = doc.data();
                if (parseInt(userData.userID) === parseInt(userId)) {
                    userExists = true;
                    updateDoc(doc.ref, {
                        badgeIn: badgeIN,
                        badgeOut: badgeOUT,
                        badgeDate: date
                    }).then(() => {
                        console.log('Document updated for userID:', userId);
                        console.log('Successfully updated!');
                    });
                }
            });

            if (!userExists) {
                setModalMessage('Warning! UserID does not exist');
                setModalVisible(true); // Show warning modal
            }
        } catch (error) {
            console.log('Error updating document: ', error);
        }
    };

    useEffect(() => {
        retrieveDB(); // Fetch events when component mounts
    }, []); // Empty dependency array to run only once when component mounts
    //this function will gonna display the data from the firestore into the card
    const retrieveDB = async () => {
        try {
            const userSnapshot = await getDocs(collection(db, 'users'));
            const fetchedEvents = [];

            userSnapshot.forEach((doc) => {
                const eventData = doc.data();
                if (eventData.userID && eventData.Type && eventData.badgeDate && eventData.badgeIn && eventData.badgeOut) {
                    // Check if Title and Description exist
                    fetchedEvents.push({
                        userid: eventData.userID,
                        usertype: eventData.Type,
                        date: eventData.badgeDate,
                        badgeIn: eventData.badgeIn,
                        badgeOut: eventData.badgeOut,
                    });
                }
            });

            setEvents(fetchedEvents); // Update state with events having Title and Description
        } catch (error) {
            console.log('Error fetching events: ', error);
        }
    };

    const EventCard = ({ event }) => (
        <View style={[styles.cardContainer, styles.card]}>
            <Card>
                <Card.Content>
                    <Title>Attendance</Title>
                    <Paragraph>ID: {event.userid}</Paragraph>
                    <Paragraph>Type: {event.usertype}</Paragraph>
                    <Paragraph>Date: {event.date}</Paragraph>
                    <Paragraph>Badge In: {event.badgeIn}</Paragraph>
                    <Paragraph>Badge Out: {event.badgeOut}</Paragraph>
                </Card.Content>
            </Card>
        </View>
    );

    return (
      <View style={styles.formContainer}>
          <View style={styles.logoutButtonContainer}>
                <Pressable style={styles.logoutButton} onPress={logOut}>
                    <Icon name="sign-out" size={20} color="black" />
                </Pressable>
            </View>
            <Pressable onPress={dashboard}>
                <Text>→ Dashboard</Text>
          </Pressable>
          <ScrollView contentContainerStyle={styles.scrollContainer} horizontal={true}>
              {events.length > 0 ? (
                  events.map((event, index) => (
                      <EventCard key={index} event={event} />
                  ))
              ) : (
                  <Text>No events available</Text>
              )}
          </ScrollView>
          {/* Modal for showing success or warning message */}
          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                  setModalVisible(false);
              }}
          >
              <View style={styles.modalContainer}>
                  <View style={styles.modalView}>
                      <Text>{modalMessage}</Text>
                      <Pressable
                          style={[styles.button, styles.buttonClose]}
                          onPress={() => setModalVisible(!modalVisible)}
                      >
                          <Text style={styles.textStyle}>Close</Text>
                      </Pressable>
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
    logoutButtonContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      padding: 0
  },
  logoutButton: {
      padding: 5,
  },
    scrollContainer: {
        flexGrow: 1,
    },
    cardContainer: {
        marginBottom: 10,
        marginRight: 10,
        borderBottomWidth: 1, // Add a bottom border to create horizontal lines
        borderBottomColor: '#ccc', // Color of the border
    },
    card: {
        width: 200, // Set a fixed width for the cards
    },
    modalContainer: {
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
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
