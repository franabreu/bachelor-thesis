import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';

import { NavigationEvents } from "react-navigation";

import { getExpensesByTripId } from '../server/ExpensesAPI';

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';

import 'moment/locale/es'
var moment = require('moment');

function Item({ tripID, name, amount, currency, expense, navigation }) {
    const mainCurrency = firebase.auth().currentUser.photoURL;

    moment.locale('es');
    var date = moment(expense.date).locale('es').format('L');

    return (
        <View style={styles.item}>
            <TouchableOpacity onPress={() =>
                navigation.navigate('ExpenseForm', { tripID: tripID, expense: expense })}>
                <Text style={styles.expenseText1}>{name} ({expense.category}) - {date}</Text>
                <Text style={styles.expenseText2}>{amount} {currency} ({expense.mainAmount} {mainCurrency})</Text>
            </TouchableOpacity>
        </View>
    );
}

export default class ExpensesList extends React.Component {

    state = {
        expensesList: [],
        tripID: '',
        trip: '',
        startDate: '',
        endDate: '',
        totalExpenses: 0,
        totalTransport: 0,
        totalAccommodation: 0,
        totalFood: 0,
        totalLeisure: 0,
        totalOther: 0,
        mainCurrency: firebase.auth().currentUser.photoURL
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

        return (
            <SafeAreaView style={styles.container}>
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Gastos del viaje</Text>
                </View>
                <View>
                    <TouchableOpacity style={styles.addExpenseButton} onPress={() =>
                        this.props.navigation.navigate('ExpenseForm', { tripID: this.state.tripID })}>
                        <Text>
                            Añadir gasto
                    </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView>
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
                <FlatList
                    data={this.state.expensesList}
                    renderItem={({ item }) => <Item style={styles.item}
                        tripID={this.state.tripID}
                        name={item.name}
                        amount={item.amount}
                        currency={item.currency}
                        expense={item}
                        navigation={this.props.navigation} />}
                    keyExtractor={item => item.id}
                />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    header: {
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'blue',
        zIndex: 10
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '500'
    },
    item: {
        backgroundColor: '#FFF',
        padding: 6,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    expenseText1: {
        fontSize: 18,
    },
    expenseText2: {
        fontSize: 15,
    },
    description: {
        fontSize: 14,
    },
    addExpenseButton: {
        marginVertical: 20,
        paddingHorizontal: 10,
        marginHorizontal: 20,
        backgroundColor: '#3399ff',
        borderRadius: 4,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center'
    },
    expensesSummary: {
        fontSize: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    expensesSummaryMain: {
        marginVertical: 10,
        fontSize: 18,
        justifyContent: 'center',
        alignItems: 'center',
    }
});