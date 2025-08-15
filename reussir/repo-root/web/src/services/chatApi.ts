export type ChatApiResponse = {
  received: boolean;
  type: "text" | "image" | "equation";
  text: string;
  file?: string;
  equationHtml?: string;
  error?: string;
};

export async function sendChatMessage({ text, file }: { text: string; file?: File }): Promise<ChatApiResponse> {
  const formData = new FormData();
  formData.append("text", text);
  if (file) formData.append("file", file);
  const res = await fetch("http://localhost:3001/api/chat/send", {
    method: "POST",
    body: formData,
  });
  return res.json();
}
