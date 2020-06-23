/* import * as firebase from 'firebase';
import 'firebase/firestore'; */

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

import 'moment/locale/es'
var moment = require('moment');

export async function getTrips(tripsRetreived) {

  var tripList = [];

  var snapshot = await firebase.firestore()
    .collection('trip')
    .where('public', '==', true)
    .orderBy('startDate', 'desc')
    .get()

  snapshot.forEach((doc) => {
    const tripItem = doc.data();
    tripItem.id = doc.id;
    tripItem.title = doc.data().title;
    tripItem.description = doc.data().description;
    tripItem.startDate = doc.data().startDate.toDate();
    tripItem.endDate = doc.data().endDate.toDate();
    tripList.push(tripItem);
  });

  tripsRetreived(tripList);
}

export async function getMyTrips(tripsRetreived) {

  var tripList = [];
  var userID = firebase.auth().currentUser.uid;

  var snapshot = await firebase.firestore()
    .collection('trip')
    .where('userID', '==', userID)
    .orderBy('startDate', 'desc')
    .get()

  snapshot.forEach((doc) => {
    const tripItem = doc.data();
    tripItem.id = doc.id;
    tripItem.title = doc.data().title;
    tripItem.description = doc.data().description;
    tripItem.startDate = doc.data().startDate.toDate();
    tripItem.endDate = doc.data().endDate.toDate();

    tripList.push(tripItem);
  });

  tripsRetreived(tripList);
}

export async function uploadTrip(data) {

  firebase.firestore().collection("trip").add(data)
    .then(docRef => {
      console.log("Document successfully written!");

      var tripSaved = firebase.firestore().collection("trip").doc(docRef.id);

      tripSaved.get().then(function (doc) {
        if (doc.exists) {
          var trip = doc.data();
          var currDate = moment(trip.startDate.toDate()).startOf('day');
          var lastDate = moment(trip.endDate.toDate()).startOf('day');

          while (currDate.diff(lastDate) < 1) {
            var dayDate = {date: currDate.toDate()};
            currDate.add(1, 'days');
            firebase.firestore().collection("trip/" + docRef.id + '/days').doc().set(dayDate)
              .then(function () {
                console.log("Document successfully written!");
              })
              .catch(function (error) {
                console.error("Error writing document: ", error);
              });
          }
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
        throw error;
      });
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });

}

export async function uploadDay(tripID, data) {

  firebase.firestore().collection("trip/" + tripID + '/days').doc().set(data)
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });

}

export async function getTripById(tripID, tripRetreived) {
  var docRef = firebase.firestore().collection("trip").doc(tripID);

  docRef.get().then(function (doc) {
    if (doc.exists) {
      /* console.log(JSON.stringify(doc.data())) */
      tripRetreived(doc.data())
    } else {
      console.log("No such document!");
    }
  }).catch(function (error) {
    console.log("Error getting document:", error);
    throw error;
  });
}

export async function deleteTripById(tripID) {

  firebase.firestore().collection("trip").doc(tripID).delete().then(function () {
    console.log("Document successfully deleted!");
  }).catch(function (error) {
    console.error("Error removing document: ", error);
  });
}