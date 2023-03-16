const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// exports.newTestDoc = functions.https.onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into Firestore using the Firebase Admin SDK.
//   await db.collection("test").doc(original).set({});
//   // Send back a message that we've successfully written the message
//   res.json({ result: `Message with ID: ${original} added.` });
// });
// exports.leaderboardsTest = functions.https.onRequest(async (req, res) => {
//   const date = new Date();
//   const newWeekId = `${date.getDate()}-${
//     date.getMonth() + 1
//   }-${date.getFullYear()}`;
//   const usersRef = db.collection("users");
//   const leaderboardsRef = db.collection("leaderboards");
//   const leaderboardsData = await leaderboardsRef.doc("leaderboardsData").get();
//   const lastWeekId = leaderboardsData.data().currentWeekId;

//   // Grab the text parameter.
//   res.json({ result: `Today Id: ${newWeekId}, last week Id: ${lastWeekId}` });
// });
exports.weeklyLeaderboardReset = functions.https.onRequest(async (req, res) => {
  const date = new Date();
  const newWeekId = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
  const newLeagues = new Array(10).fill(null).map(() => []);
  const leaderboardsData = await db
    .collection("leaderboards")
    .doc("leaderboardsData")
    .get();
  const lastWeekId = leaderboardsData.data().currentWeekId;

  for (var leagueNum = 0; leagueNum < 10; leagueNum++) {
    const lastWeekLeaderboards = await db
      .collection(`leaderboards/${leagueNum}/${lastWeekId}`)
      .get();
    lastWeekLeaderboards.forEach((leaderboard) => {
      // Step 3: For each leaderboard, move the top 10 users up to the next league slot in the array,
      // and the bottom 10 users down to the league below in the array. Keep the middle users in the same league slot.
      const users = leaderboard.data().users;
      var usersArray = Array.from(Object.entries(users)).sort(
        (a, b) => a[1].points < b[1].points
      );
      for (var index = 0; index < usersArray.length; index++) {
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
  for (var leagueNum = 0; leagueNum < newLeagues.length; leagueNum++) {
    var usersChunksArray = [];
    var chunksCounter = 0;
    var currentChunk = {};
    for (
      var usersCounter = 0;
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
  for (var league = 0; league < newLeaguesChunks.length; league++) {
    for (var leagueChunk of newLeaguesChunks[league]) {
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
        // updating user's leaderboard
        for (var key of Object.keys(leagueChunk)) {
          await db.doc(`users/${key}`).update({
            leaderboard: {
              weekId: newWeekId,
              leaderboardId: leaderboardRef.id,
            },
          });
        }
      }
    }
  }
  // Commit all the batched updates
  await batch.commit();

  console.log("Leaderboard reset successful.");
});
