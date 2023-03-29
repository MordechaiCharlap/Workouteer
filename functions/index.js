const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

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
exports.deleteUserData = functions.firestore
  .document("users/{userId}")
  .onDelete((snap, context) => {
    const userId = context.params.userId;

    // delete user chats
    firestore
      .collection("chats")
      .where("users", "array-contains", userId)
      .get()
      .then((querySnapshot) => {
        const batch = firestore.batch();
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        return batch.commit();
      });

    // delete user workouts
    firestore
      .collection("workouts")
      .where("userId", "==", userId)
      .get()
      .then((querySnapshot) => {
        const batch = firestore.batch();
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        return batch.commit();
      });

    // delete user data from other collections
    // ...
  });
