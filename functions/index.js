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
exports.weeklyLeaderboardReset = async () => {
  const date = new Date();
  const newWeekId = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
  const newLeagues = new Array(10).fill(null).map(() => []);

  for (var leagueNum = 0; leagueNum < 10; leagueNum++) {
    const lastWeekLeaderboards = await db
      .collection(`leaderboards/${i}/${weekId}`)
      .get();
    lastWeekLeaderboards.forEach((leaderboard) => {
      // Step 3: For each leaderboard, move the top 10 users up to the next league slot in the array,
      // and the bottom 10 users down to the league below in the array. Keep the middle users in the same league slot.
      const users = leaderboard.data().users;
      const usersArray = Array.from(Object.entries(users)).sort(
        (a, b) => a[1].points < b[1].points
      );
      for (var index = 0; index < usersArray.length; index++) {
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

  const newLeaguesChunks = new Array(10).fill(null).map(() => []);
  for (var leagueNum = 0; leagueNum < newLeagues; leagueNum++) {
    const usersChunksArray = [];
    const chunksCounter = 0;

    for (
      var usersCounter = 0;
      usersCounter < newLeagues[leagueNum];
      usersCounter++
    ) {
      if (usersCounter % 50 == 0 && usersCounter != 0) {
        chunksCounter++;
      }
      usersChunksArray[chunksCounter].push(newLeagues[leagueNum][usersCounter]);
    }
    newLeaguesChunks[leagueNum].push(usersChunksArray);
  }
  const batch = db.batch();
  for (var leaugeChunks of newLeaguesChunks) {
    for (var leaugeChunk of leaugeChunks) {
    }
  }
  // Commit all the batched updates
  await batch.commit();

  console.log("Leaderboard reset successful.");
};
