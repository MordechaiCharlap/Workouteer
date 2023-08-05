export const checkFriendShipStatus = (
  userData,
  otherUserId,
  sentFriendRequests,
  receivedFriendRequests
) => {
  if (userData.friends[otherUserId] != null) {
    return "Friends";
  } else {
    if (sentFriendRequests[otherUserId] != null) return "SentRequest";
    else if (receivedFriendRequests[otherUserId] != null) {
      return "ReceivedRequest";
    } else return "None";
  }
};
