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
        <Title>Attendance</Title>
        <Paragraph>ID: {event.userid}</Paragraph>
        <Paragraph>Subject: {event.subject}</Paragraph>
        <Paragraph>Type: {event.usertype}</Paragraph>
        <Paragraph>Date: {event.date}</Paragraph>
        <Paragraph>Badge In: {event.badgeIn}</Paragraph>
        <Paragraph>Badge Out: {event.badgeOut}</Paragraph>
      </Card.Content>
    </Card>
  </View>
);

const Attendance = ({navigation}) => {
  const [events, setEvents] = useState([]); // State variable for storing events
  
  const dashboard = () => {
    navigation.replace('Admin');
  };
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
        if (eventData.userID && eventData.Code && eventData.Type && eventData.Date && eventData.Start && eventData.End) { // Check if Title and Description exist
          fetchedEvents.push({
            userid: eventData.userID,
            subject: eventData.Code,
            usertype: eventData.Type,
            date: eventData.Date,
            badgeIn: eventData.Start,
            badgeOut: eventData.End,
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
      <Pressable onPress={dashboard}>
        <Text>→ Dashboard</Text>
      </Pressable>
      <ScrollView contentContainerStyle={styles.scrollContainer} horizontal={true}>
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </ScrollView>
    </View>
  );
};
export default Attendance;

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
