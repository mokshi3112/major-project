// messageAdmin.js
import { startChat } from "./startChat";
import { sendMessage } from "./sendMessage";

/**
 * Convenience: admin starts chat with user and sends initial request message
 */
export async function adminCreateRequest(adminAddr, userAddr, userName, text) {
  const chatId = await startChat(adminAddr, userAddr, userName);
  await sendMessage(chatId, { from: adminAddr, text });
  return chatId;
}
export default adminCreateRequest;
