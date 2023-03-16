const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.newTestDoc = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  await db.collection("test").doc(original).set({});
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${original} added.` });
});
exports.leaderboardsTest = functions.https.onRequest(async (req, res) => {
  const date = new Date();
  const newWeekId = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
  const usersRef = db.collection("users");
  const leaderboardsRef = db.collection("leaderboards");
  const leaderboardsData = await leaderboardsRef.doc("leaderboardsData").get();
  const lastWeekId = leaderboardsData.data().currentWeekId;

  // Grab the text parameter.
  const original = req.query.text;
  res.json({ result: `Today Id: ${newWeekId}, last week Id: ${lastWeekId}` });
});
exports.weeklyLeaderboardReset = async () => {
  const date = new Date();
  const newWeekId = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
  const usersRef = db.collection("users");
  const leaderboardsRef = db.collection("leaderboards");
  const leaderboardsData = await leaderboardsRef.doc("leaderboardsData").get();
  const lastWeekId = leaderboardsData.data().currentWeekId;
  const batch = db.batch();

  for (let i = 0; i < 10; i++) {
    const leaderboardsRef = db.collection(`leaderboards/${i}/${weekId}`);

    // const snapshot = await leaderboardsRef.get();

    // let currentPosition = 0;
    // let currentLeague = 1;

    // snapshot.forEach((doc) => {
    //   const lastWeekLeaderboards = doc.lastWeekId;
    //   const userId = doc.id;

    //   // Update leaderboard and points
    //   const points = 0;
    //   let leaderboardPosition = currentPosition + 1;
    //   if (leaderboardPosition <= 10) {
    //     currentLeague++;
    //   } else if (leaderboardPosition >= 40) {
    //     currentLeague--;
    //   }
    //   currentPosition++;

    //   // Reset points if necessary
    //   if (currentPosition === 50) {
    //     points = 0;
    //     currentPosition = 0;
    //   }

    //   // Update user document
    //   const userRef = usersRef.doc(userId);
    //   batch.update(userRef, {
    //     points: points,
    //     leaderboardPosition: leaderboardPosition,
    //     league: currentLeague,
    //   });
    // });
  }

  // Commit all the batched updates
  await batch.commit();

  console.log("Leaderboard reset successful.");
};
