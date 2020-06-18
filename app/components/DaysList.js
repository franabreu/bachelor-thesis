import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';

import { NavigationEvents } from "react-navigation";

import { getDaysByTripId } from '../server/DaysAPI';

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';

import 'moment/locale/es'
var moment = require('moment');

function Item({ tripID, dayID, date, navigation }) {

    moment.locale('es');
    var dayDate = moment(date).locale('es').format('LL');

    return (
        <View style={styles.item}>
            <TouchableOpacity onPress={() =>
                navigation.navigate('ActivitiesList', { tripID: tripID, dayID: dayID })}>
                <Text style={styles.dayText}>{dayDate} </Text>
            </TouchableOpacity>
        </View>
    );
}

export default class DaysList extends React.Component {

    state = {
        daysList: [],
        tripID: '',
        dayID: '',
        trip: '',
        startDate: '',
        endDate: '',
    }

    onDaysReceived = (daysList
    ) => {
        this.setState(prevState => ({
            daysList: prevState.daysList = daysList
        }));
    }

    componentDidMount() {
        const tripID = this.props.navigation.state.params.tripID
        this.setState({ tripID: tripID });

        getDaysByTripId(tripID, this.onDaysReceived)
    }


    render() {

        return (
            <SafeAreaView style={styles.container}>
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Días</Text>
                </View>
                <ScrollView>
                    <FlatList
                        data={this.state.daysList}
                        renderItem={({ item }) => <Item style={styles.item}
                            tripID={this.state.tripID}
                            dayID={item.dayID}
                            date={item.date}
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
        fontSize: 32,
        fontWeight: '500'
    },
    item: {
        backgroundColor: '#FFF',
        padding: 6,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    dayText: {
        fontSize: 20,
        paddingVertical: 8
    }
});