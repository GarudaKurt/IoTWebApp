import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginPage from './components/LoginPage';
import Signup from './components/Singup';
import ScheduleRoom from './components/ScheduleRoom';
import CalendarEvent from './components/CalendarEvent';
import EventBoard from './components/EventBoard';
import  {Dashboard}  from './components/Dashboard';
import DashboardEvent from './components/DashboardEvent';
import  BookResources  from './components/BookResources';
import { AdminDashboard } from './components/AdminDashboard';
import RoomReservation from './components/RoomReservation';
import Researve from './components/Researve';
import Attendance from './components/Attendance';
import Events from './components/Events';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginPage} options={{headerShown: false}} />
        <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}} />
        <Stack.Screen name="BookRoom" component={ScheduleRoom} options={{headerShown: false}} />
        <Stack.Screen name="Events" component={CalendarEvent} options={{headerShown: false}} />
        <Stack.Screen name="Board" component={EventBoard} options={{headerShown: false}} />
        <Stack.Screen name="Dashboards" component={Dashboard} options={{headerShown: false}} />
        <Stack.Screen name="BoardEvent" component={DashboardEvent} options={{headerShown: false}} />
        <Stack.Screen name="Resources" component={BookResources} options={{headerShown: false}} />
        <Stack.Screen name="Admin" component={AdminDashboard} options={{headerShown: false}} />
        <Stack.Screen name="RoomBook" component={RoomReservation} options={{headerShown: false}} />
        <Stack.Screen name="Researves" component={Researve} options={{headerShown: false}} />
        <Stack.Screen name="Attend" component={Attendance} options={{headerShown: false}} />
        <Stack.Screen name="ViewEvent" component={Events} options={{headerShown: false}} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
