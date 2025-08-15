export type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
  source?: string;
};

export async function sendMessageToBot(text: string): Promise<Message> {
  // Simule une réponse du bot
  return new Promise(resolve =>
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        sender: "bot",
        text: "Réponse du bot à: " + text,
        time: new Date().toLocaleTimeString(),
      });
    }, 1200)
  );
}
