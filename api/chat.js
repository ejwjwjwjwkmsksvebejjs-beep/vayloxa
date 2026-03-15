export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `
You are an all-in-one AI business assistant.
You help with:
- project planning
- financial management
- stock analysis
- investment recommendations
- business decisions
Always respond in a structured, clear way.
            `,
          },
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response';

    return res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
