export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { message } = req.body;

  console.log("📩 MESSAGE RECEIVED:", message);

  if (!message || message.trim() === "") {
    return res.status(200).json({ reply: "⚠️ الرسالة اللي وصلتني فاضية" });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    );

    const data = await response.json();

    console.log("🤖 RAW GEMINI RESPONSE:", data);

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Gemini رجّع رد بدون محتوى";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("🔥 SERVER ERROR:", error);
    return res.status(500).json({ reply: "⚠️ Server Error" });
  }
}
