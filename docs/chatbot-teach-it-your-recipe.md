---
title: Teach it your recipe
path: chatbot
order: 6
summary: Give AdoboBot your own recipe to answer from, and make it handle problems gracefully when the kitchen gets busy.
serves: Anyone who finished the previous lesson
time: 35 minutes
level: Beginner
ingredients:
  - Your adobo-bot folder, with `adobo_chat.py` working
  - Your `.env` file with the Gemini key
searchHint: Ground a Gemini chatbot in your own text file and handle API errors with try and except
keywords: gemini grounding context file recipe text try except error handling rate limit chatbot beginner
---

:::analogy
A great server can talk about food in general. But when a guest asks “is your adobo spicy?”, a good server doesn’t guess. They answer from *this kitchen’s* recipe.

Gemini knows about adobo in general, so it might describe a different family’s version. We’ll give it our own recipe card and tell it to answer only from that card. And just like a server who stays calm when the kitchen is slammed, we’ll teach the bot to say something friendly when things go wrong, instead of crashing.
:::

## Let’s cook

### 1. Write the recipe card

In your `adobo-bot` folder, create a plain text file called `recipe.txt`. Feel free to change it to your family’s version:

```text recipe.txt
Simple Chicken Adobo (serves 4)

Ingredients (ten):
- 1 kg chicken pieces
- 1/2 cup soy sauce
- 1/3 cup vinegar
- 1 teaspoon whole black peppercorns
- 1 teaspoon sugar
- 2 bay leaves
- 1 head of garlic (about 8 cloves), crushed
- 1 onion, sliced
- 1 cup water
- 2 tablespoons cooking oil

Steps:
1. Heat the oil and cook the garlic and onion until soft and fragrant.
2. Add the chicken and brown it on all sides.
3. Pour in the soy sauce, vinegar and water. Add the peppercorns and bay leaves.
4. Bring to a boil, then lower the heat and simmer for 30 to 40 minutes, until the chicken is tender.
5. Stir in the sugar. Simmer a little more, until the sauce is thick and glossy.

Notes:
- This version is not spicy. Add a chopped chili for heat.
- Adobo tastes even better the next day.
- Serve with steamed rice.
```

### 2. Hand the card to the bot

Create `adobo_kitchen.py`. It starts from your chat, with two changes: it reads the recipe file, and it puts the text into the briefing:

```python adobo_kitchen.py
from pathlib import Path

from dotenv import load_dotenv
from google import genai

load_dotenv()

MODEL = "gemini-3.8-flash"

recipe = Path("recipe.txt").read_text(encoding="utf-8")

client = genai.Client()

print("AdoboBot: Hi! What's your name?")
name = input("You: ").strip().title() or "friend"

briefing = f"""You are AdoboBot, a friendly Filipino home cook.
The guest's name is {name}.
Answer in two or three short sentences, in plain words a beginner understands.

Answer ONLY from the recipe card below. If the answer is not on the card,
say you're not sure, and suggest they ask another cook. Do not invent details.

RECIPE CARD:
{recipe}"""

print(f"AdoboBot: Nice to meet you, {name}! Ask me about my adobo recipe. Type 'bye' to leave.")

previous_id = None

while True:
    message = input(f"{name}: ").strip()

    if not message:
        continue

    if message.lower() == "bye":
        print(f"AdoboBot: Bye, {name}! Kain na!")
        break

    request = {
        "model": MODEL,
        "input": message,
        "system_instruction": briefing,
    }
    if previous_id:
        request["previous_interaction_id"] = previous_id

    try:
        interaction = client.interactions.create(**request)
    except Exception as error:
        print("AdoboBot: Sorry, the kitchen is a little busy right now. Please try again in a moment.")
        print(f"(Details for the cook: {error})")
        continue

    previous_id = interaction.id
    print("AdoboBot:", interaction.output_text)
```

`Path("recipe.txt").read_text(...)` reads the whole file into a variable. The `{recipe}` inside the briefing puts the card in front of Gemini on every turn.

### 3. Catch the mistakes

Look at the new `try` and `except` block. Python tries the risky line. If anything goes wrong, like no internet, a busy service or a used-up free quota, it jumps to `except` instead of crashing. The bot prints a friendly note and goes back to waiting for your next message, using `continue`.

We catch every kind of error here to keep things simple. Bigger programs catch specific kinds, and handle each one differently. Notice that `previous_id` is only updated after a successful answer, so one failed request doesn’t break the conversation’s memory.

:::map Code | In the kitchen
- `Path("recipe.txt").read_text()` | Takes the recipe card out of the drawer
- `Answer ONLY from the recipe card` | The rule that keeps the bot from inventing details
- `try:` | Attempt the risky step, calling Gemini
- `except Exception as error:` | If it fails, handle it calmly and keep the kitchen open
- `continue` | Skip the rest of this round and wait for the next order
:::

### 4. Test what it knows and what it doesn’t

Run `python adobo_kitchen.py` and try these:

- “How many cloves of garlic do I need?”
- “Is it spicy?”
- “Can I make it with pork?” (it isn’t on the card)
- “What’s the best restaurant in Manila?” (nothing to do with the card)

:::taste
The first two answers should match your card exactly: about 8 cloves, and not spicy but you can add a chili. For the pork question, and the restaurant one, AdoboBot should say it isn’t sure instead of making something up. That “I don’t know” is just as important as a right answer.

To see your error message, temporarily break the key in `.env` by changing a letter, then ask a question. You should see the friendly message, and the program should keep running. Put the correct key back afterwards.

If the bot invents details that aren’t on the card, taste and adjust: make the rule stronger, or shorter, in the briefing. If Python says it can’t find `recipe.txt`, run the program from inside the `adobo-bot` folder, where the file lives.
:::

:::own
- Change the recipe to your family’s version, and ask the bot about the changes.
- Add a section called “Substitutions” to the card, and ask about them.
- Add more than one recipe, like sinigang, and have the bot answer about either. Keep them all in the same file with clear headings.
:::

## What you learned

- You can make a chatbot answer from your own text by putting that text in the instruction.
- A clear rule like “answer only from the card” helps the bot say “I’m not sure” instead of guessing.
- `try` and `except` keep a program running when something outside your control goes wrong.

## Where to go next

You now have a real chatbot: it has a personality, a memory and knowledge of your own recipe, and it stays calm under pressure. The natural next steps are showing it on a web page, which needs a small backend to keep your key safe, and letting it look at pictures. The Laravel path is a good place to learn that backend. And the more of your own notes you give it, the more useful it becomes.
