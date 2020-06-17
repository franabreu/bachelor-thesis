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

import { getTripById } from '../server/TripsAPI';
import { getExpensesByTripId } from '../server/ExpensesAPI';

var moment = require('moment');

export default class Trip extends React.Component {

    static navigationOptions = {
        headerShown: false
    };

    state = {
        tripID: '',
        trip: '',
        startDate: '',
        endDate: '',
        mainCurrency: firebase.auth().currentUser.photoURL
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

    onExpensesReceived = (expensesList) => {
        this.setState(prevState => ({
            expensesList: prevState.expensesList = expensesList
        }));

        this.calculateTotalExpenses(expensesList);
    }

    componentDidMount() {
        const tripID = this.props.navigation.state.params.tripID
        this.setState({ tripID: tripID });

        getTripById(tripID, this.onTripReceived)
        getExpensesByTripId(tripID, this.onExpensesReceived)
    }

    calculateTotalExpenses(expensesList) {
        let transportList = [];
        let accommodationList = [];
        let foodList = [];
        let leisueList = [];
        let otherList = [];

        let totalExpenses = parseFloat(0);
        let totalTransport = parseFloat(0);
        let totalAccommodation = parseFloat(0);
        let totalFood = parseFloat(0);
        let totalLeisure = parseFloat(0);
        let totalOther = parseFloat(0);

        const startDate = this.props.navigation.state.params.startDate
        const endDate = this.props.navigation.state.params.endDate

        for (const [index, value] of expensesList.entries()) {
            switch (value.category) {
                case 'Transporte':
                    transportList.push(value);
                    totalExpenses = totalExpenses + parseFloat(value.mainAmount);
                    totalTransport = totalTransport + parseFloat(value.mainAmount);
                    break;
                case 'Alojamiento':
                    accommodationList.push(value);
                    totalExpenses = totalExpenses + parseFloat(value.mainAmount);
                    totalAccommodation = totalAccommodation + parseFloat(value.mainAmount);
                    break;
                case 'Comida':
                    foodList.push(value);
                    totalExpenses = totalExpenses + parseFloat(value.mainAmount);
                    totalFood = totalFood + parseFloat(value.mainAmount);
                    break;
                case 'Ocio':
                    leisueList.push(value);
                    totalExpenses = totalExpenses + parseFloat(value.mainAmount);
                    totalLeisure = totalLeisure + parseFloat(value.mainAmount);
                    break;
                default:
                    otherList.push(value);
                    totalExpenses = totalExpenses + parseFloat(value.mainAmount);
                    totalOther = totalOther + parseFloat(value.mainAmount);
                    break;
            }
        }

        totalExpenses = totalExpenses.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
        totalTransport = totalTransport.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
        totalAccommodation = totalAccommodation.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
        totalFood = totalFood.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
        totalLeisure = totalLeisure.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
        totalOther = totalOther.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
        this.setState({
            totalExpenses: totalExpenses, totalTransport: totalTransport, totalAccommodation: totalAccommodation,
            totalFood: totalFood, totalLeisure: totalLeisure, totalOther: totalOther
        });
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

                <View style={styles.expensesSummary}>
                        <Text style={styles.expensesSummaryMain}>
                            Total gastos: {this.state.totalExpenses} {this.state.mainCurrency}
                        </Text>
                        <Text>
                            Transporte: {this.state.totalTransport} {this.state.mainCurrency} - Alojamiento: {this.state.totalAccommodation} {this.state.mainCurrency}
                        </Text>
                        <Text>
                            Comida: {this.state.totalFood} {this.state.mainCurrency} - Ocio: {this.state.totalLeisure} {this.state.mainCurrency} - Otros: {this.state.totalOther} {this.state.mainCurrency}
                        </Text>
                    </View>
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
    },
    expensesSummary: {
        fontSize: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    expensesSummaryMain: {
        marginVertical: 10,
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
});