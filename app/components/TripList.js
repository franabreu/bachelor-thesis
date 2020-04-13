import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';

import { getTrips } from '../server/TripsAPI';

/* import * as firebase from 'firebase';
import 'firebase/firestore'; */

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

import { TouchableOpacity } from 'react-native-gesture-handler';

function Item({ title, description }) {
    return (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
}

class TripList extends Component {

    state = {
        tripList: [],
        selectedIndex: 0
    }

    onTripsReceived = (tripList) => {
        this.setState(prevState => ({
            tripList: prevState.tripList = tripList
        }));
    }

    componentDidMount() {
        getTrips(this.onTripsReceived);
    }

    render() {
        return this.state.tripList.length > 0 ?
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Próximos destinos</Text>
                </View>
                <FlatList
                    data={this.state.tripList}
                    renderItem={({ item }) => <Item style={styles.item} title={item.title} description={item.description} />}
                    keyExtractor={item => item.id}
                />
            </SafeAreaView> :
            <View style={styles.container}>
                <Text style={styles.header}>No se ha encontrado ningún viaje</Text>
            </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 18,
    },
    description: {
        fontSize: 14,
    },
});

export default TripList;



/* var firebaseConfig = {
    apiKey: "AIzaSyCfiPhFz_iJ_kLpWkprNl1cokvqP_nSpe4",
    authDomain: "planvi-cf5ef.firebaseapp.com",
    databaseURL: "https://planvi-cf5ef.firebaseio.com",
    projectId: "planvi-cf5ef",
    storageBucket: "planvi-cf5ef.appspot.com",
    messagingSenderId: "5453578324",
    appId: "1:5453578324:web:a3992e1889c2af649f2dc1"
};
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

import { decode, encode } from 'base-64'
global.crypto = require("@firebase/firestore");
global.crypto.getRandomValues = byteArray => { for (let i = 0; i < byteArray.length; i++) { byteArray[i] = Math.floor(256 * Math.random()); } }
if (!global.btoa) { global.btoa = encode; }
if (!global.atob) { global.atob = decode; }

const DATA = [
    {
        id: '1',
        title: 'Trip 1',
        description: 'Desc trip 1',
        startDate: '1606777200000',
        endDate: '1607122800000',
    },
    {
        id: '2',
        title: 'Trip 2',
        description: 'Desc trip 2',
        startDate: '1606777200000',
        endDate: '1607122800000',
    }
]; */

/* const TRIPLIST = [];
const TRIPS = firebase.firestore().collection('trip').where('public', '==', true).get()
    .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            TRIPLIST.push(doc.data);
        });
    })
    .catch(function (error) {
        console.log("Error getting documents: ", error);
    });;


componentDidMount() {
    TRIPS = getTrips(this.onTripsReceived);
}

function Item({ title, description }) {
    return (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.title}>{description}</Text>
        </View>
    );
}

export default function App() {
    console.log(TRIPLIST);
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Próximos destinos</Text>
            </View>
            <FlatList
                data={TRIPLIST}
                renderItem={({ item }) => <Item title={item.title} description={item.description} />}
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
    );
} */