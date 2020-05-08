import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  LayoutAnimation,
  TouchableOpacity
} from 'react-native';

/* import moment from 'moment' */

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

import { getTripById } from '../server/TripsAPI';

var moment = require('moment');
export default class Trip extends React.Component {
    
    static navigationOptions = {
        headerShown: false
    };

    state = {
        tripID: '',
        trip: '',
        startDate: '',
        endDate: ''
    }

    onTripReceived = (trip) => {
        this.setState(prevState => ({
            trip: prevState.trip = trip
        }))
        this.setState({
            startDate: moment(trip.startDate._seconds).locale('es').format('LL'),
            endDate: moment(trip.endDate._seconds).locale('es').format('LL')
        });
    }

    componentDidMount() {
        const tripID = this.props.navigation.state.params.tripID
        this.setState({ tripID: tripID });
        console.log('tripID: ' + tripID)

        getTripById(tripID, this.onTripReceived)
    }

    render() {
        LayoutAnimation.easeInEaseOut();

        return (
            <View style={styles.container}>
                <StatusBar barStyle='light-content'></StatusBar>

                <Text>Título: {this.state.trip.title}</Text>
                <Text>Descripcion: {this.state.trip.description}</Text>
                <Text>Ciudad: {this.state.trip.city}</Text>
                <Text>Salida: {this.state.startDate}</Text>
                <Text>Salida: {this.state.endDate}</Text>



            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
});