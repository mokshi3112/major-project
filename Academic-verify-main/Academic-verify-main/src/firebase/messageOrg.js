// messageOrg.js
import { startChat } from "./startChat";
import { sendMessage } from "./sendMessage";

export async function orgStartConversation(orgAddr, otherAddr, otherName, text) {
  const chatId = await startChat(orgAddr, otherAddr, otherName);
  if (text) await sendMessage(chatId, { from: orgAddr, text });
  return chatId;
}
export default orgStartConversation;
