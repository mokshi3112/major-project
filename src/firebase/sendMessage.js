// sendMessage.js
import { db } from "../firebase/firebase";
import firebase from "firebase/compat/app";

/**
 * Send a message in an existing chat. chatId must exist (created by startChat).
 * message = { from, text, type(optional) }
 */
export async function sendMessage(chatId, message) {
  if (!chatId) throw new Error("Missing chatId");
  if (!message || !message.from || !message.text) throw new Error("Invalid message");

  const messagesRef = db.collection("chats").doc(chatId).collection("messages");
  const payload = {
    ...message,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  await messagesRef.add(payload);

  // update last message / timestamp in each user's activechats entry
  const chatDoc = db.collection("chats").doc(chatId);
  const chatSnap = await chatDoc.get();
  const members = chatSnap.exists ? chatSnap.data().members || [] : [];

  const updateObj = {
    lastMessage: message.text,
    lastMessageFrom: message.from,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
  };

  await Promise.all(
    members.map((addr) =>
      db
        .collection("users")
        .doc(addr)
        .collection("activechats")
        .doc(chatId)
        .set(updateObj, { merge: true })
    )
  );
}
export default sendMessage;
