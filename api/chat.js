export default async function handler(req, res) {
  // السماح لـ Framer بالاتصال (CORS)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // رد على طلبات OPTIONS (مهم جدًا)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // السماح فقط بـ POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;

  try {
    // إرسال الرسالة إلى OpenAI
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: message,
      }),
    });

    const data = await response.json();

    // استخراج الرد
    const reply =
      data.output_text ||
      data.output ||
      data.response ||
      "No response";

    // إعادة الرد إلى Framer
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Server Error" });
  }
}
