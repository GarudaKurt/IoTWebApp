import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native'; // Updated import
import { Card, Title, Paragraph } from 'react-native-paper';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome'

const EventCard = ({ event }) => (
  <View style={[styles.cardContainer, styles.card]}>
    <Card>
      <Card.Content>
        <Title>{event.title}</Title>
        <Paragraph>{event.description}</Paragraph>
      </Card.Content>
    </Card>
  </View>
);

const EventBoard = ({navigation}) => {
  const [events, setEvents] = useState([]); // State variable for storing events
  
  const logOut = () => {
    navigation.replace('Login')
  }
  useEffect(() => {
    updateDb(); // Fetch events when component mounts
  }, []); // Empty dependency array to run only once when component mounts


  const updateDb = async () => {
    try {
      const userSnapshot = await getDocs(collection(db, "users"));
      const fetchedEvents = [];

      userSnapshot.forEach((doc) => {
        const eventData = doc.data();
        if (eventData.Title && eventData.Description ) { // Check if Title and Description exist
          fetchedEvents.push({
            title: eventData.Title,
            description: eventData.Description
          });
        }
      });

      setEvents(fetchedEvents); // Update state with events having Title and Description
    } catch (error) {
      console.log("Error fetching events: ", error);
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.logoutButtonContainer}>
          <Pressable style={styles.logoutButton} onPress={logOut}>
              <Icon name="sign-out" size={20} color="black" />
          </Pressable>
      </View>
      <Text style={styles.title}> Dashboard</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer} horizontal={true}>
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </ScrollView>
    </View>
  );
};
export default EventBoard;

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
    borderBottomWidth: 1, // Add a bottom border to create horizontal lines
    borderBottomColor: '#ccc', // Color of the border
  },
  card: {
    width: 200, // Set a fixed width for the cards
  },
});
