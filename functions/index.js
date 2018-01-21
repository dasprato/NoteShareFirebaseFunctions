//import firebase functions modules
const functions = require('firebase-functions');
//import admin module
const admin = require('firebase-admin');
// import nodemailer module
// const  nodemailer = require('nodemailer');
//
// const mailTransport = nodemailer.createTransport(
//     "smtps://emailid:password@smtp.gmail.com");

admin.initializeApp(functions.config().firebase);


const APP_NAME = "NoteShare Ltd";
const ref = admin.firestore();


exports.noteShare = functions.https.onRequest((request, response) => {
 response.send("Hello from actual note share app, please use this link in future!\nDeveloped By Prato Das, Sumit Somani\nDesigner: @null")
})

exports.allUsers = functions.https.onRequest((request, response) => {
    response.send("All users list")
})

exports.deleteAllUsersInDatabase = functions.https.onRequest((request, response) => {
    response.send(request.data.toString())
})


exports.pushNotification = functions.firestore
    .document('Users/{userId}')
    .onWrite(event => {
    console.log('Push notification event triggered');
    var modifiedData = event.data.data();

/*
 access a particular field as you would any JS property
 Create a notification
*/
const payload = {
    notification: {
        title: "New user in app",
        body: modifiedData.name + " joined note share with email Id: " + modifiedData.emailAddress,
        sound: "default"
    },
};

//Create an options object that contains the time to live for the notification and the priority
const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};


return admin.messaging().sendToTopic("pushNotifications", payload, options);

});


exports.noteNotification = functions.firestore
    .document('Courses/{courseId}/Notes/{noteId}')
    .onWrite(event => {
    console.log('Push notification event triggered');
    var modifiedData = event.data.data();

const payload = {
    notification: {
        title: modifiedData.forCourse,
        body: "New note: " + modifiedData.noteName,
        sound: "default"
    },
};

//Create an options object that contains the time to live for the notification and the priority
const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};
var topic = "Notifications_" + modifiedData.forCourse
return admin.messaging().sendToTopic(topic, payload, options);
});

exports.commentNotification = functions.firestore
    .document('Courses/{courseId}/Notes/{noteId}/Comments/{commentId}')
    .onWrite(event => {
    console.log('Push notification event triggered');
var modifiedData = event.data.data();

const payload = {
    notification: {
    	title: "NewMessage",
        body: modifiedData.messageOwnerEmail + ": " + modifiedData.message,
        sound: "default"
    },
};

//Create an options object that contains the time to live for the notification and the priority
const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};

return admin.messaging().sendToTopic("Comment_Notifications", payload, options);
});