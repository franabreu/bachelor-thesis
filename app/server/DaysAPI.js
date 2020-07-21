import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";
import "@react-native-firebase/storage";

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
    activityItem.category = doc.data().category;

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

export async function getImagesByDayId(tripID, dayID, onImagesReceived) {

  var imagesList = [];

  var snapshot = await firebase.firestore().collection("trip/" + tripID + "/days/" + dayID + "/images")
    .get();

  snapshot.forEach((doc) => {
    const imageItem = doc.data();
    imageItem.imageID = doc.id;
    imageItem.downloadURL = doc.data().downloadURL;
    imagesList.push(imageItem);
  });

  onImagesReceived(imagesList);
}

export async function uploadImagePath(data, tripID, dayID) {

  firebase.firestore().collection('trip/' + tripID + '/days/' + dayID + '/images').doc().set(data)
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });

}