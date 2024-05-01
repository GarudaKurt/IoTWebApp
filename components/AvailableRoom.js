import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput, Pressable } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { db } from './firebaseConfig';
import { collection, getDocs} from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const EventCard = ({ events}) => {
    const isScrollable = events.length > 2;
  
    return (
      <View style={[styles.cardContainer, styles.card]}>
        {isScrollable ? (
          <ScrollView contentContainerStyle={styles.scrollContainer} vertical={true}>
            {events.map((event, index) => (
              <Card key={index} style={{marginBottom:5}}>
                <Card.Content>
                  <Title>{event.subjectcode}</Title>
                  <Paragraph>Prof ID: {event.userid}</Paragraph>
                  <Paragraph>Type: {event.usertype}</Paragraph>
                  <Paragraph>Date: {event.date}</Paragraph>
                  <Paragraph>Start: {event.start}</Paragraph>
                  <Paragraph>End: {event.end}</Paragraph>
                  {index < events.length - 1 && <View style={styles.divider} />}
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        ) : (
          events.map((event, index) => (
            <Card key={index}>
              <Card.Content>
                <Title>{event.subjectcode}</Title>
                <Paragraph>Prof ID: {event.userid}</Paragraph>
                <Paragraph>Type: {event.usertype}</Paragraph>
                <Paragraph>Date: {event.date}</Paragraph>
                <Paragraph>Start: {event.start}</Paragraph>
                <Paragraph>End: {event.end}</Paragraph>
                {index < events.length - 1 && <View style={styles.divider} />}
              </Card.Content>
            </Card>
          ))
        )}
      </View>
    );
};
  

const AvailableRoom = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [removeUserID, setRemoveUserID] = useState('');
  const [eventsToRemove, setEventsToRemove] = useState([]);
  const [userID, setUserID] = useState('');

  const dashboard = () => {
    navigation.replace('Dashboards');
  };

  const logOut = () => {
    navigation.replace('Login');
  };

  useEffect(() => {
    updateDb();
    setUserID(removeUserID);
  }, [removeUserID]);

  const updateDb = async () => {
    try {
      const userSnapshot = await getDocs(collection(db, 'users'));
      const fetchedEvents = [];

      userSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.Date && userData.Start && userData.End && userData.userID && userData.Type) {
          fetchedEvents.push({
            id: doc.id,
            usertype: userData.Type,
            subjectcode: userData.Code,
            date: userData.Date,
            start: userData.Start,
            end: userData.End,
            userid: userData.userID,
          });
        }
      });

      const groupedEvents = fetchedEvents.reduce((acc, event) => {
        const key = event.date;
        if (!acc[key]) acc[key] = [];
        acc[key].push(event);
        return acc;
      }, {});

      setEvents(Object.values(groupedEvents));
    } catch (error) {
      console.log('Error fetching events: ', error);
    }
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
        {events.map((group, index) => (
          <EventCard key={index} events={group} />
        ))}
      </ScrollView>

    </View>
  );
};

export default AvailableRoom;
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
      padding: 0,
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
      maxHeight: 400,
    },
    card: {
      width: 200,
    },
    buttonText: {
      color: 'red',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  