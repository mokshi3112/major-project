// messageEmployee.js
import { startChat } from "./startChat";
import { sendMessage } from "./sendMessage";

export async function employeeStartConversation(employeeAddr, otherAddr, otherName, text) {
  const chatId = await startChat(employeeAddr, otherAddr, otherName);
  if (text) await sendMessage(chatId, { from: employeeAddr, text });
  return chatId;
}
export default employeeStartConversation;
