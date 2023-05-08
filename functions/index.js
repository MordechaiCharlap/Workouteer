const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
const bucket = admin.storage().bucket();
exports.deleteUserData = functions.firestore
  .document(`alerts/{userId}`)
  .onDelete(async (snap) => {
    const userId = snap.id;
    console.log(`Deleting data for ${userId}`);
    //delete user's picture
    const file = bucket.file(`profile-pics/${userId}.jpg`);
    await file.delete();
    const user = (await db.doc(`users/${userId}`).get()).data();
    const uid = user.uid;
    if (uid) {
      try {
        await admin.auth().deleteUser(uid);
        console.log("Successfully deleted user");
      } catch (error) {
        console.log("Error deleting user:", error);
      }
    }
    const batch = db.batch();
    const now = new Date();
    const alerts = snap.data();
    //  delete all invites of future workouts for this user from workouts db
    const invitesArray = Array.from(Object.entries(alerts.workoutInvites));
    for (const invite of invitesArray) {
      if (invite[1].workoutDate > now) {
        await db.doc(`workouts/${invite[0]}`).update({
          [`invites.${userId}`]: admin.firestore.FieldValue.delete(),
        });
      }
    }

    const friendRequests = (
      await db.doc(`friendRequests/${userId}`).get()
    ).data();
    //  delete friendRequests doc
    await db.doc(`friendRequests/${userId}`).delete();
    const receivedRequestsArray = Array.from(
      Object.entries(friendRequests.receivedRequests)
    );
    for (const request of receivedRequestsArray) {
      //  remove sent request for every user that asked (not that it matters)
      await db.doc(`friendRequests/${request[0]}`).update({
        [`sentRequests.${userId}`]: admin.firestore.FieldValue.delete(),
      });
    }
    const sentRequestsArray = Array.from(
      Object.entries(friendRequests.sentRequests)
    );
    for (const request of sentRequestsArray) {
      //  remove sent friend request from every user that got one
      await db.doc(`friendRequests/${request[0]}`).update({
        [`receivedRequests.${userId}`]: admin.firestore.FieldValue.delete(),
      });
      //  decrement friend request count
      await db.doc(`users/${request[0]}`).update({
        friendRequestsCount: admin.firestore.FieldValue.increment(-1),
      });
    }
    //  deletes from every user friends
    const friendsArray = Array.from(Object.entries(user.friends));
    for (const friend of friendsArray) {
      await db.doc(`users/${friend[0]}`).update({
        [`friends.${userId}`]: admin.firestore.FieldValue.delete(),
        friendsCount: admin.firestore.FieldValue.increment(-1),
      });
    }
    await db.doc(`users/${userId}`).update({
      email: admin.firestore.FieldValue.delete(),
      isDeleted: true,
      img: "https://firebasestorage.googleapis.com/v0/b/workouteer-54450.appspot.com/o/profile-pics%2Fdefaults%2Fdefault-profile-image.jpg?alt=media&token=e6cf13be-9b7b-4d6c-9769-9e18813dafd2",
    });
    //delete confirmedWorkouts doc
    await db.doc(`usersConfirmedWorkouts/${userId}`).delete();
    await batch.commit();
    console.log(`${userId} deleted succesfully`);
  });

exports.weeklyLeaderboardReset = functions.pubsub
  .schedule("0 0 * * 0")
  .timeZone("Asia/Jerusalem")
  .onRun(async () => {
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
      lastWeekLeaderboards.forEach((leaderboard) => {
        const users = leaderboard.data().users;
        const usersArray = Array.from(Object.entries(users)).sort(
          (a, b) => a[1].points < b[1].points
        );
        for (let index = 0; index < usersArray.length; index++) {
          console.log(usersArray[index][0]);
          if (index < 10 && usersArray[index][1].points != 0) {
            newLeagues[Math.min(9, leagueNum + 1)].push(usersArray[index][0]);
          } else if (index < 40 && usersArray[index][1].points != 0) {
            newLeagues[leagueNum].push(usersArray[index][0]);
          } else {
            newLeagues[Math.max(0, leagueNum - 1)].push(usersArray[index][0]);
          }
        }
      });
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

    const batch = db.batch();
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
            await db.doc(`users/${key}`).update({
              leaderboard: {
                weekId: newWeekId,
                id: leaderboardRef.id,
              },
              league: league,
            });
          }
        }
      }
    }

    await db
      .doc("leaderboards/leaderboardsData")
      .update({ currentWeekId: newWeekId });

    await batch.commit();

    console.log("Leaderboard reset successful.");
  });
