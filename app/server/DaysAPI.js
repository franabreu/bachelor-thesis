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
    dayItem.diaryTitle = doc.data().diaryTitle;
    dayItem.diaryText = doc.data().diaryText;

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
    activityItem.activityID = doc.id;
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

export async function updateActivity(data, tripID, dayID, activityID) {

  firebase.firestore().collection('trip/' + tripID + '/days/' + dayID + '/activities').doc(activityID).delete().then(function () {
    console.log("Document successfully deleted!");
  }).catch(function (error) {
    console.error("Error removing document: ", error);
  });

  firebase.firestore().collection('trip/' + tripID + '/days/' + dayID + '/activities').doc().set(data)
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
}

export async function updateDiary(data, tripID, dayID, diaryTitle, diaryText) {

  firebase.firestore().collection('trip/' + tripID + '/days').doc(dayID).update(
    {
      diaryTitle: diaryTitle.toString(),
      diaryText: diaryText.toString()
    }
  )
  .then(function () {
    console.log("Document successfully updated!");
    return true;
  }).catch(function (error) {
    console.error("Error updating document: ", error);
    return false;
  });
}