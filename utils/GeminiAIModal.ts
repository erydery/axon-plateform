const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

export const chatSession = {
  sendMessage: async (prompt: string) => {
    if (!apiKey) {
        throw new Error("Clé API manquante. Vérifie ton fichier .env.local");
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", 
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-001", 
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("DEBUG OPENROUTER:", data);
        throw new Error(data?.error?.message || `Erreur API: ${response.status}`);
    }

    return {
      response: {
        text: () => data.choices[0].message.content
      }
    };
  }
};