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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    console.log("🤖 RAW OPENAI RESPONSE:", data);

    if (data.error) {
      return res.status(200).json({ reply: "⚠️ OpenAI Error: " + data.error.message });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(200).json({ reply: "⚠️ OpenAI رجّع رد بدون محتوى" });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("🔥 SERVER ERROR:", error);
    return res.status(500).json({ reply: "⚠️ Server Error" });
  }
}
