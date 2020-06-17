/* import * as firebase from 'firebase';
import 'firebase/firestore'; */

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

export async function getTrips(tripsRetreived) {

  var tripList = [];

  var snapshot = await firebase.firestore()
    .collection('trip')
    .where('public', '==', true)
    .orderBy('title')
    .get()

  snapshot.forEach((doc) => {
    const tripItem = doc.data();
    tripItem.id = doc.id;
    tripItem.title = doc.data().title;
    tripItem.description = doc.data().description;
    tripItem.startDate = doc.data().startDate;
    tripItem.endDate = doc.data().endDate;
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

  firebase.firestore().collection("trip").doc().set(data)
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