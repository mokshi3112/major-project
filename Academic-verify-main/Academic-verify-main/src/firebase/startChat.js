// startChat.js
import { db } from "../firebase/firebase"; // adjust path if needed
import firebase from "firebase/compat/app";

/**
 * Ensure a chat exists between two addresses and add entries to each user's activechats.
 * Returns the chatId (we'll use deterministic chatId = sorted addresses joined).
 */
export async function startChat(myAddress, otherAddress, otherName = "Unknown") {
  if (!myAddress || !otherAddress) throw new Error("Missing addresses");

  // deterministic chat id so both sides use same doc
  const sorted = [myAddress.toLowerCase(), otherAddress.toLowerCase()].sort();
  const chatId = `${sorted[0]}_${sorted[1]}`;

  // Ensure chat doc exists
  const chatRef = db.collection("chats").doc(chatId);
  const chatSnap = await chatRef.get();
  if (!chatSnap.exists) {
    await chatRef.set({
      members: sorted,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Add to activechats for both users (so Notifications list shows it)
  const activeDataForOther = {
    ethAddress: otherAddress,
    name: otherName,
    chatId,
    lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
  };

  const meData = {
    ethAddress: myAddress,
    name: "Me",
    chatId,
    lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
  };

  await db
    .collection("users")
    .doc(myAddress)
    .collection("activechats")
    .doc(chatId)
    .set(activeDataForOther, { merge: true });

  await db
    .collection("users")
    .doc(otherAddress)
    .collection("activechats")
    .doc(chatId)
    .set(meData, { merge: true });

  return chatId;
}
export default startChat;
