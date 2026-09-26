---
title: Press a button
path: electronics
order: 3
summary: Add a push button to your circuit, so the Arduino can listen to you as well as talk. Then turn it into a light switch that remembers.
serves: Anyone who finished the first electronics lesson
time: 30 minutes
level: Beginner
ingredients:
  - Your Arduino Uno, USB cable and the Arduino IDE
  - The LED and 220 ohm resistor from the first lesson, and a breadboard
  - 1 push button (the small square kind with four legs)
  - 3 jumper wires
searchHint: Read a push button with an Arduino using INPUT_PULLUP and digitalRead, then toggle an LED
keywords: arduino push button digitalread input_pullup toggle debounce led electronics beginner
---

:::analogy
So far your Arduino has only given orders: light on, light off. A real kitchen also listens. When the bell on the pass rings, the cook looks up and gets moving.

A push button is that bell. When you press it, a tiny bridge closes inside and lets electricity through. Your Arduino checks the button again and again, and reacts when it changes. That check-and-react loop is the heart of almost every gadget, from a doorbell to a game controller.
:::

## Let’s cook

### 1. Build the circuit

Unplug the board. Keep the LED and resistor circuit from the first lesson, with the resistor going to **pin 8**. Now add the button.

A push button has four legs, which are joined in two pairs inside. Place it across the gap in the middle of the breadboard, so two legs are on the left side and two are on the right. Then connect:

:::map Part | Connect it to
- A button leg on the left side | Pin 2 on the Arduino
- A button leg on the right side | GND on the Arduino
:::

There’s no resistor for the button. The Arduino has a small one built inside, and we’ll switch it on in the code. It’s called a pull-up resistor.

### 2. Light on while pressed

Create a new sketch and paste this in:

```cpp button.ino
const int buttonPin = 2;
const int ledPin = 8;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  if (digitalRead(buttonPin) == LOW) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
}
```

Upload it. The light should be on for as long as you hold the button down.

### 3. Why does pressed mean LOW?

It feels backwards, but it makes the wiring simple:

:::map Piece | What it does
- `INPUT_PULLUP` | Switches on the pull-up resistor, which gently pulls the pin up to HIGH when nothing else is touching it
- Button not pressed | The pin is pulled up, so `digitalRead` gives HIGH
- Button pressed | The button connects the pin to GND, so `digitalRead` gives LOW
- `digitalRead(buttonPin) == LOW` | “Is the button being pressed right now?” Two equals signs mean “is it equal to”
:::

### 4. Make it a switch that remembers

A light that only stays on while you hold the button is like a doorbell. A light switch remembers. Replace the sketch with this:

```cpp button.ino
const int buttonPin = 2;
const int ledPin = 8;

bool ledOn = false;
bool wasPressed = false;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  bool isPressed = (digitalRead(buttonPin) == LOW);

  if (isPressed && !wasPressed) {
    ledOn = !ledOn;
    digitalWrite(ledPin, ledOn ? HIGH : LOW);
  }

  wasPressed = isPressed;
  delay(20);
}
```

Upload it. Press once and the light turns on and stays on. Press again and it turns off.

:::map Code | In the kitchen
- `ledOn` | A sticky note that says whether the light is currently on
- `wasPressed` | A note of what the button was doing a moment ago
- `isPressed && !wasPressed` | “It’s pressed now, and it wasn’t before”: the moment of the press, not the whole time it’s held
- `ledOn = !ledOn` | Flip the note: on becomes off, and off becomes on
- `delay(20)` | Wait a moment before checking again. This avoids reading the tiny bounces a button makes, which is called debouncing
:::

:::taste
In the first sketch, the LED should light only while you hold the button. In the second, each press should flip the light, and it should never flicker or flip twice for one press.

If nothing happens, taste and adjust: check that the two button wires are on opposite sides of the breadboard gap, and that one goes to pin 2 and the other to GND. If the light is on all the time in the first sketch, your button’s legs may be sitting in the wrong direction. Turn the button a quarter turn and try again.
:::

:::own
- Make the light blink while the button is held, and stay off otherwise.
- Count the presses. Add an `int count = 0;`, add 1 to it on each press, and use `Serial.println(count);` to see the number in the Serial Monitor.
- Add a second LED on pin 7, and make the two lights swap places each time the button is pressed.
:::

## What you learned

- `INPUT_PULLUP` lets a pin listen to a button with no extra resistor, and pressed reads as LOW.
- `digitalRead` checks a pin, and `if` decides what to do about it.
- Remembering the previous state lets you react to the moment something changes, and a short delay stops false readings.
