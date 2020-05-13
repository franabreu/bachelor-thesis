import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';

import { NavigationEvents } from "react-navigation";

import { getMyTrips } from '../server/TripsAPI';

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

import { TouchableOpacity } from 'react-native-gesture-handler';

function Item({ tripID, title, description, navigation }) {
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Trip', { tripID: tripID })}>
            <View style={styles.item}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </TouchableOpacity>
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
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            getMyTrips(this.onTripsReceived);
        });
    }

    render() {
        return this.state.tripList.length > 0 ?
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Mis viajes</Text>
                </View>
                <FlatList
                    data={this.state.tripList}
                    renderItem={({ item }) => <Item style={styles.item}
                        tripID={item.id}
                        title={item.title}
                        description={item.description}
                        navigation={this.props.navigation} />}
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
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 18,
    },
    description: {
        fontSize: 14,
    }
});

export default TripList;