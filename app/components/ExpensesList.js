import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';

import { NavigationEvents } from "react-navigation";

import { getExpensesByTripId } from '../server/ExpensesAPI';

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

import { TouchableOpacity } from 'react-native-gesture-handler';

import 'moment/locale/es'
var moment = require('moment');


function Item({ tripID, name, amount, currency, navigation }) {
    return (
        <View style={styles.item}>
            <Text style={styles.title}>{name} - {amount} {currency}</Text>
        </View>
    );
}

export default class ExpensesList extends React.Component {

    state = {
        expensesList: [],
        tripID: '',
        trip: '',
        startDate: '',
        endDate: ''
    }

    onExpensesReceived = (expensesList) => {
        this.setState(prevState => ({
            expensesList: prevState.expensesList = expensesList
        }));
        /* console.log(JSON.stringify(expensesList)) */
    }

    componentDidMount() {
        const tripID = this.props.navigation.state.params.tripID
        this.setState({ tripID: tripID });

        getExpensesByTripId(tripID, this.onExpensesReceived)
        /* this._navListener = this.props.navigation.addListener('didFocus', () => {
            getTripExpenses(this.onExpensesReceived);
        }); */
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
                <FlatList
                    data={this.state.expensesList}
                    renderItem={({ item }) => <Item style={styles.item}
                        tripID={item.id}
                        name={item.name}
                        amount={item.amount}
                        currency={item.currency}
                        navigation={this.props.navigation} />}
                    keyExtractor={item => item.id}
                />
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
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 18,
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
});