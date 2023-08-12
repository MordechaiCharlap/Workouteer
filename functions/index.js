const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
admin.initializeApp();
const db = admin.firestore();
const bucket = admin.storage().bucket();
const app = express();
const usersRouter = require("./api/users");
const workoutsRouter = require("./api/workouts");
const alertsRouter = require("./api/alerts");
const friendRequestsRouter = require("./api/friendRequests");
const { verifyAccessToken } = require("./utils/firebase");
const { FieldValue } = require("firebase-admin/firestore");
app.use(verifyAccessToken);
app.use("/workouts", workoutsRouter);
app.use("/users", usersRouter);
app.use("alerts", alertsRouter);
app.use("friendRequests", friendRequestsRouter);
exports.deleteUserData = functions.firestore
  .document(`alerts/{userId}`)
  .onDelete(async (snap) => {
    const userId = snap.id;
    //delete user's picture
    const batch = db.batch();
    const user = (await db.doc(`users/${userId}`).get()).data();
    const now = new Date();
    for (var [key, value] of Object.entries(user.plannedWorkouts)) {
      const workout = (await db.doc(db, `workouts/${key}`).get()).data();
      if (value[0].toDate() > now) {
        if (Object.entries(workout.members).length > 1) {
          for (var member of Object.keys(workout.members)) {
            if (member != user.id) {
              workout.creator = member;
              break;
            }
          }
          batch.update(db.doc(`workouts/${workout.id}`), {
            creator: workout.creator,
            [`members.${user.id}`]: FieldValue.delete(),
          });
        } else {
          batch.delete(db.doc(`workouts/${workout.id}`));
        }
      }
    }

    if (
      user.img !=
      "https://firebasestorage.googleapis.com/v0/b/workouteer-54450.appspot.com/o/profile-pics%2Fdefaults%2Fdefault-profile-image.jpg?alt=media&token=e6cf13be-9b7b-4d6c-9769-9e18813dafd2"
    ) {
      const file = bucket.file(`profile-pics/${userId}.jpg`);
      if (file.exists()) await file.delete();
    }
    const uid = user.uid;
    if (uid) {
      try {
        await admin.auth().deleteUser(uid);
      } catch (error) {
        console.log(error);
      }
    }
    const alerts = snap.data();
    //  delete all invites of future workouts for this user from workouts db
    const invitesArray = Array.from(Object.entries(alerts.workoutInvites));
    for (const invite of invitesArray) {
      if (invite[1].workoutDate > now) {
        batch.update(db.doc(`workouts/${invite[0]}`), {
          [`invites.${userId}`]: admin.firestore.FieldValue.delete(),
        });
      }
    }

    const friendRequests = (
      await db.doc(`friendRequests/${userId}`).get()
    ).data();
    //  delete friendRequests doc
    batch.delete(db.doc(`friendRequests/${userId}`));
    const receivedRequestsArray = Array.from(
      Object.entries(friendRequests.receivedRequests)
    );
    for (const request of receivedRequestsArray) {
      //  remove sent request for every user that asked (not that it matters)
      batch.update(db.doc(`friendRequests/${request[0]}`), {
        [`sentRequests.${userId}`]: admin.firestore.FieldValue.delete(),
      });
    }
    for (const receiverId of Object.keys(friendRequests.sentRequests)) {
      //  remove sent friend request from every user that got one
      batch.update(db.doc(`friendRequests/${receiverId}`), {
        [`receivedRequests.${userId}`]: admin.firestore.FieldValue.delete(),
      });
    }
    //  deletes from every user friends
    for (const senderId of Object.keys(user.friends)) {
      batch.update(db.doc(`users/${senderId}`), {
        [`friends.${userId}`]: admin.firestore.FieldValue.delete(),
        friendsCount: admin.firestore.FieldValue.increment(-1),
      });
    }
    //deletes from usersData
    batch.update(db.doc("appData/usersData"), {
      allUsersIds: admin.firestore.FieldValue.arrayRemove(userId),
    });
    //updating field values
    batch.update(db.doc(`users/${userId}`), {
      email: admin.firestore.FieldValue.delete(),
      plannedWorkouts: {},
      isDeleted: true,
      pushToken: null,
      img: "https://firebasestorage.googleapis.com/v0/b/workouteer-54450.appspot.com/o/profile-pics%2Fdefaults%2Fdefault-profile-image.jpg?alt=media&token=e6cf13be-9b7b-4d6c-9769-9e18813dafd2",
    });
    //delete confirmedWorkouts doc
    batch.delete(db.doc(`usersConfirmedWorkouts/${userId}`));
    await batch.commit();
    console.log(`${userId} deleted succesfully`);
  });

exports.weeklyLeaderboardReset = functions.pubsub
  .schedule("0 0 * * 0")
  .timeZone("Asia/Jerusalem")
  .onRun(async () => {
    const batch = db.batch();
    const date = new Date();
    date.setDate(date.getDate() - ((date.getDay() + 1) % 7));
    const newWeekId = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;
    const newLeagues = new Array(10).fill(null).map(() => []);
    const leaderboardsData = await db
      .collection("leaderboards")
      .doc("leaderboardsData")
      .get();
    const lastWeekId = leaderboardsData.data().currentWeekId;

    for (let leagueNum = 0; leagueNum < 10; leagueNum++) {
      const lastWeekLeaderboards = await db
        .collection(`leaderboards/${leagueNum}/${lastWeekId}`)
        .get();
      for (var leaderboard of lastWeekLeaderboards) {
        const users = leaderboard.data().users;
        const usersArray = Array.from(Object.entries(users)).sort(
          (a, b) => a[1].points < b[1].points
        );
        for (let index = 0; index < usersArray.length; index++) {
          const userAlertsRef = await db
            .doc(`alerts/${usersArray[index][0]}`)
            .get();
          const userNewLeaderboardAlert = userAlertsRef.exists()
            ? userAlertsRef.data().newLeaderboard
            : null;
          if (
            userNewLeaderboardAlert != null &&
            (usersArray[index][1].points != 0 ||
              userNewLeaderboardAlert.lastPoints != 0 ||
              userNewLeaderboardAlert.lastLeague != 0)
          ) {
            batch.update(db.doc(`alerts/${usersArray[index][0]}`), {
              newLeaderboard: {
                lastPlace: index + 1,
                lastLeague: leagueNum,
                lastPoints: usersArray[index][1].points,
              },
            });
            if (index < 10 && usersArray[index][1].points != 0) {
              newLeagues[Math.min(9, leagueNum + 1)].push(usersArray[index][0]);
            } else if (index < 40 && usersArray[index][1].points != 0) {
              newLeagues[leagueNum].push(usersArray[index][0]);
            } else {
              newLeagues[Math.max(0, leagueNum - 1)].push(usersArray[index][0]);
            }
          } else {
            //not adding user to a new leaderboard/updating his newLeaderboardAlert until he logs in//or if got deleted
          }
        }
      }
    }

    console.log(newLeagues);
    const newLeaguesChunks = new Array(10).fill(null).map(() => []);
    console.log("new league chunks before:");
    console.log(newLeaguesChunks);
    for (let leagueNum = 0; leagueNum < newLeagues.length; leagueNum++) {
      const usersChunksArray = [];
      let chunksCounter = 0;
      let currentChunk = {};
      for (
        let usersCounter = 0;
        usersCounter < newLeagues[leagueNum].length;
        usersCounter++
      ) {
        if (usersCounter % 50 == 0 && usersCounter != 0) {
          chunksCounter++;
          currentChunk = {};
        }
        const userRef = await db
          .doc(`users/${newLeagues[leagueNum][usersCounter]}`)
          .get();
        const userData = userRef.data();
        currentChunk[userData.id] = {
          points: 0,
          img: userData.img,
          displayName: userData.displayName,
        };
        console.log(currentChunk);
        usersChunksArray[chunksCounter] = currentChunk;
      }
      newLeaguesChunks[leagueNum] = usersChunksArray;
    }
    console.log(`All leagues array chunked: ${newLeaguesChunks}`);
    console.log(newLeaguesChunks);

    for (let league = 0; league < newLeaguesChunks.length; league++) {
      for (const leagueChunk of newLeaguesChunks[league]) {
        const chunkSize = Object.keys(leagueChunk).length;
        console.log("Chunk size: " + chunkSize);
        console.log("Chunk: ");
        console.log(leagueChunk);
        if (chunkSize > 0) {
          const leaderboardRef = await db
            .collection(`leaderboards/${league}/${newWeekId}`)
            .add({
              users: {
                ...leagueChunk,
              },
              usersCount: chunkSize,
            });
          for (const key of Object.keys(leagueChunk)) {
            batch.update(db.doc(`users/${key}`), {
              leaderboard: {
                weekId: newWeekId,
                id: leaderboardRef.id,
                points: 0,
              },
              league: league,
            });
          }
        }
      }
    }
    batch.update(db.doc("leaderboards/leaderboardsData"), {
      currentWeekId: newWeekId,
    });
    await batch.commit();

    console.log("Leaderboard reset successful.");
  });
exports.helloWorld = functions.https.onRequest(async (request, response) => {
  response.send("Respowwwnse");
  console.log("Helloww Wowwwrld");
  await sendPushNotification();
});
const sendPushNotification = async (userToSend, title, body, data) => {
  if (userToSend && userToSend.pushToken) {
    const pushNotification = {
      to: userToSend.pushToken,
      sound: "default",
      title: "",
      body: body,
      data: data || {},
    };
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pushNotification),
    });
  }
};
exports.api = functions.https.onRequest(app);
