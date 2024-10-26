import { lineClient } from '..'

export async function sendLineMessage(userId, message) {
  try {
    const response = await lineClient.pushMessage({
      to: userId,
      messages: [{ type: 'text', text: message }]
    })
    console.log(response)
  } catch (error) {
    console.error('Error sending message:', error)
    throw new error('Error sending message:', error)
  }
}
