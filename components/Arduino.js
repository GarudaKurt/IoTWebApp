import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { firebaseDatabase } from './firebaseConfig'; 
import { ref, onValue } from 'firebase/database';

export const Arduino = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
      const databaseRef = ref(firebaseDatabase, 'info'); // Assuming 'info' is your database reference

      const fetchData = (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
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
  
    return (
      <View style={styles.container}>
        {data && (
          <View>
            <Text>Date: {data.date}</Text>
            <Text>UserID: {data.userID}</Text>
            <Text>Badge In: {data.badgeIn}</Text>
            <Text>Badge Out: {data.badgeOut}</Text>
          </View>
        )}
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f5f6fa',
      borderRadius: 10,
      padding: 20,
    }
});
