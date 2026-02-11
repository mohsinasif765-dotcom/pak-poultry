export const sendPushNotification = async (targetToken: string, title: string, body: string) => {
  try {
    const response = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: targetToken,
        title: title,
        body: body
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Notification send error:", error);
  }
};