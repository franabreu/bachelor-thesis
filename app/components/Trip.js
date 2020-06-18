import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    LayoutAnimation,
    TouchableOpacity,
    SafeAreaView,
    Alert
} from 'react-native';

/* import moment from 'moment' */

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

import { getTripById, deleteTripById } from '../server/TripsAPI';

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
            startDate: moment(trip.startDate.toDate()).locale('es').format('LL'),
            endDate: moment(trip.endDate.toDate()).locale('es').format('LL')
        });
    }

    componentDidMount() {
        const tripID = this.props.navigation.state.params.tripID
        this.setState({ tripID: tripID });

        getTripById(tripID, this.onTripReceived)
    }

    deleteTrip(tripID) {
        deleteTripById(tripID);
        this.props.navigation.navigate('MyTrips')
    }

    render() {
        LayoutAnimation.easeInEaseOut();

        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle='light-content'></StatusBar>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{this.state.trip.title}</Text>
                </View>


                <Text style={styles.description}>{this.state.trip.description}</Text>
                <Text style={styles.cities}>Ciudad: {this.state.trip.city}</Text>
                <View style={styles.dates}>
                    <Text style={styles.date}>Salida: {this.state.startDate}</Text>
                    <Text style={styles.date}>Llegada: {this.state.endDate}</Text>
                </View>

                <TouchableOpacity style={styles.expensesButton}
                    onPress={() => this.props.navigation.navigate('ExpensesList', { tripID: this.state.tripID, startDate: this.state.startDate, endDate: this.state.endDate })}>
                    <Text>
                        Gastos
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.expensesButton}
                    onPress={() => this.props.navigation.navigate('DaysList', { tripID: this.state.tripID })}>
                    <Text>
                        Actividades
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => Alert.alert(
                    'Dar de baja',
                    '¿Está seguro de que desea eliminar este viaje?',
                    [
                        { text: 'No', onPress: () => null, style: 'cancel' },
                        { text: 'Sí', onPress: () => this.deleteTrip(this.state.tripID) },
                    ]
                )}>
                    <Text style={styles.text}>Eliminar viaje</Text>
                </TouchableOpacity>

            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    header: {
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: 'blue',
        zIndex: 10
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '500'
    },
    description: {
        paddingTop: 16,
        paddingBottom: 16,
        fontSize: 18,
        fontWeight: '500'
    },
    cities: {
        paddingTop: 16,
        paddingBottom: 16,
        fontSize: 18,
        fontWeight: '500'
    },
    dates: {
        paddingTop: 16,
        paddingBottom: 16,
    },
    date: {
        fontSize: 18,
        fontWeight: '500'
    },
    expensesButton: {
        paddingHorizontal: 10,
        marginHorizontal: 20,
        marginVertical: 10,
        backgroundColor: '#3399ff',
        borderRadius: 4,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        marginVertical: 10,
        fontSize: 14,
        fontWeight: '500'
    }
});