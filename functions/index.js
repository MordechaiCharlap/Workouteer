const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.myFunction = async () => {
  const usersRef = db.collection("leaderboards");
  const snapshot = await usersRef.orderBy("leaderboardPosition").get();

  const batch = db.batch();

  let currentPosition = 0;
  let currentLeague = 1;

  snapshot.forEach((doc) => {
    const data = doc.data();
    const userId = doc.id;

    // Update leaderboard and points
    const points = 0;
    let leaderboardPosition = currentPosition + 1;
    if (leaderboardPosition <= 10) {
      currentLeague++;
    } else if (leaderboardPosition >= 40) {
      currentLeague--;
    }
    currentPosition++;

    // Reset points if necessary
    if (currentPosition === 50) {
      points = 0;
      currentPosition = 0;
    }

    // Update user document
    const userRef = usersRef.doc(userId);
    batch.update(userRef, {
      points: points,
      leaderboardPosition: leaderboardPosition,
      league: currentLeague,
    });
  });

  // Commit all the batched updates
  await batch.commit();

  console.log("Leaderboard reset successful.");
};
