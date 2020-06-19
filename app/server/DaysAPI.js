import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

export async function getDaysByTripId(tripID, onDaysReceived) {

  var daysList = [];

  var snapshot = await firebase.firestore().collection("trip/" + tripID + "/days")
    .orderBy('date', 'asc')
    .get();

  snapshot.forEach((doc) => {
    const dayItem = doc.data();
    dayItem.dayID = doc.id;
    dayItem.date = doc.data().date.toDate();

    daysList.push(dayItem);
  });

  onDaysReceived(daysList);
}

export async function getActivitiesByDayId(tripID, dayID, onActivitiesReceived) {

  var activitiesList = [];

  var snapshot = await firebase.firestore().collection("trip/" + tripID + "/days/" + dayID + "/activities")
    .orderBy('time', 'asc')
    .get();

  snapshot.forEach((doc) => {
    const activityItem = doc.data();
    activityItem.dayID = doc.id;
    activityItem.name = doc.data().name;
    activityItem.note = doc.data().note;
    activityItem.time = doc.data().time.toDate();

    activitiesList.push(activityItem);
  });

  onActivitiesReceived(activitiesList);
}

export async function uploadActivity(data, tripID, dayID) {

  firebase.firestore().collection('trip/' + tripID + '/days/' + dayID + '/activities').doc().set(data)
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });

}