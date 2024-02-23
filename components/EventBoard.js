import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native'; // Updated import
import { Card, Title, Paragraph } from 'react-native-paper';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

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

const EventBoard = () => {
  const [events, setEvents] = useState([]); // State variable for storing events

  useEffect(() => {
    updateDb(); // Fetch events when component mounts
  }, []); // Empty dependency array to run only once when component mounts


  const updateDb = async () => {
    try {
      const userSnapshot = await getDocs(collection(db, "users"));
      const fetchedEvents = [];

      userSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.Title && userData.Description) { // Check if Title and Description exist
          fetchedEvents.push({
            title: userData.Title,
            description: userData.Description
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
