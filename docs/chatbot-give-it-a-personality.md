---
title: Give it a personality
path: chatbot
order: 4
summary: Use a system instruction to turn Gemini into AdoboBot, with a voice, a style and clear limits.
serves: Anyone who finished the previous lesson
time: 20 minutes
level: Beginner
ingredients:
  - Your adobo-bot folder, with `hello_gemini.py` working
  - Your `.env` file with the Gemini key
searchHint: Write a Gemini system instruction so your chatbot has a persona and rules
keywords: gemini system instruction persona prompt prompt engineering role rules tone chatbot beginner
---

:::analogy
When a new server starts at a restaurant, the manager gives them a short briefing: who you are, how to talk to guests, and what to do if someone asks for something the kitchen doesn’t serve.

Gemini knows a great deal, but it doesn’t know it works at *your* restaurant. A **system instruction** is that briefing. You write it once, and every answer follows it. Writing a good briefing is a skill of its own, and people call it prompt writing.
:::

## Let’s cook

### 1. Write the briefing

Create a new file, `adobo_bot.py`:

```python adobo_bot.py
from dotenv import load_dotenv
from google import genai

load_dotenv()

MODEL = "gemini-3.8-flash"

BRIEFING = """You are AdoboBot, a friendly Filipino home cook who loves adobo.
Answer in two or three short sentences, in plain words a beginner understands.
Be warm and encouraging, and end with a short cooking tip when it fits.
If a question is not about cooking, politely steer the conversation back to food."""

client = genai.Client()

question = input("Ask AdoboBot: ")

interaction = client.interactions.create(
    model=MODEL,
    input=question,
    system_instruction=BRIEFING,
)

print("AdoboBot:", interaction.output_text)
```

Run it with `python adobo_bot.py`, and ask something like “why is my adobo too salty?”.

### 2. Why the briefing works

Look at the four lines of `BRIEFING`. A good briefing usually has these parts:

:::map Part | Example from the briefing
- **Who it is** | “You are AdoboBot, a friendly Filipino home cook who loves adobo.”
- **How to answer** | “Answer in two or three short sentences, in plain words.”
- **Its tone** | “Be warm and encouraging.”
- **What to do at the edges** | “If a question is not about cooking, politely steer the conversation back to food.”
:::

The model name now sits in one `MODEL` line at the top. When Google releases a newer model, that’s the only place you change.

### 3. Test the edges

A briefing is only useful if you try to break it. Run the bot a few times, and ask:

- A real cooking question: “Can I use white vinegar?”
- Something off topic: “What’s the capital of France?”
- A vague one: “Help!”

Watch how the answers stay in AdoboBot’s voice, even when the question doesn’t fit.

:::taste
For the cooking question, you should get two or three friendly sentences, probably with a tip. For the off-topic one, the bot should gently bring things back to food instead of giving a full geography lesson. The exact words will differ each time you run it.

If the bot ignores your rules, taste and adjust: make the rule more specific. “Keep it short” is weaker than “Answer in two or three short sentences”. If you get a long answer, check that you passed `system_instruction=BRIEFING`, and didn’t leave it out.
:::

:::own
- Change the character. Make AdoboBot a grumpy old chef, a cheerful child or a calm teacher, and see how the same question is answered differently.
- Add a rule, like “Always mention a vegetarian option”, and test that it shows up.
- Add “Never give medical advice about food allergies. Suggest asking a doctor instead.” Then ask about allergies to see the limit work.
:::

## What you learned

- A system instruction is a briefing that shapes every answer: who the bot is, how it talks and what it avoids.
- Specific rules work better than vague ones, and you should always test the edges.
- Keeping the model name and briefing at the top of the file makes them easy to change.
