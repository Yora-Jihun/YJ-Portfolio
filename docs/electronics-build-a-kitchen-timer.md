---
title: Build a kitchen timer
path: electronics
order: 6
summary: Put it all together. Turn a dial to set the minutes, press a button to start, and a light and buzzer tell you when your adobo is ready.
serves: Anyone who finished the earlier electronics lessons
time: 40 minutes
level: Beginner
ingredients:
  - Your Arduino Uno, USB cable and the Arduino IDE
  - The potentiometer (dial) and the push button from the earlier lessons
  - The LED and 220 ohm resistor
  - 1 buzzer (a small piezo buzzer, ideally a passive one)
  - A breadboard and about 10 jumper wires
searchHint: Build a kitchen timer with an Arduino using a potentiometer, push button, LED and buzzer
keywords: arduino kitchen timer countdown potentiometer button buzzer led tone map project electronics beginner
---

:::analogy
The adobo recipe says: simmer for 30 to 40 minutes. You can’t stand and stare at the pot that long, so you set a timer, go and do something else, and let it call you back.

A kitchen timer is a small machine with four jobs: a dial to choose the time, a button to start, a light to show it’s working, and a bell to tell you it’s done. You already know how to build every one of those parts. Today you put them together.
:::

## Let’s cook

### 1. Wire the parts

Unplug the board first. You’ll use the dial from “Turn the dial”, the button from “Press a button”, and the LED from the first lesson, plus a buzzer:

:::map Part | Connect it to
- Dial, left pin | 5V on the Arduino
- Dial, middle pin | A0 on the Arduino
- Dial, right pin | GND on the Arduino
- Button, a leg on one side | Pin 2 on the Arduino
- Button, a leg on the other side | GND on the Arduino
- LED long leg | One end of the 220 ohm resistor. The other end goes to pin 8
- LED short leg | GND on the Arduino
- Buzzer’s positive leg (marked `+`, or the longer one) | Pin 7 on the Arduino
- Buzzer’s other leg | GND on the Arduino
:::

Several parts share the GND pin. That’s fine, since GND is the common return path for all of them. Use the GND rail along the side of the breadboard to keep the wires tidy.

Buzzers come in two kinds. A **passive** buzzer plays whatever pitch you tell it. An **active** buzzer has its own circuit inside and always makes one fixed sound. The sketch works with both.

### 2. Test the bell alone

Before adding everything else, check that the buzzer works. Upload this small sketch:

```cpp buzzer_test.ino
const int buzzerPin = 7;

void setup() {
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  tone(buzzerPin, 1000, 200);
  delay(1000);
}
```

You should hear a short beep once a second. `tone(pin, frequency, duration)` plays a sound. The frequency is the pitch in hertz, and the duration is in milliseconds.

### 3. Set the time with the dial

Now the dial. Upload this, and open the **Serial Monitor** at **9600 baud**:

```cpp timer.ino
const int dialPin = A0;

int lastShown = 0;

int minutesChosen() {
  int reading = analogRead(dialPin);
  return map(reading, 0, 1023, 1, 40);
}

void setup() {
  Serial.begin(9600);
}

void loop() {
  int minutes = minutesChosen();

  if (minutes != lastShown) {
    Serial.print("Set for ");
    Serial.print(minutes);
    Serial.println(" minutes");
    lastShown = minutes;
  }

  delay(50);
}
```

Turn the dial. The Serial Monitor should show any number of minutes from 1 to 40. Notice that `minutesChosen()` is a small helper of our own, like a recipe you can reuse. It reads the dial and turns 0 to 1023 into 1 to 40. The `if` only prints when the number changes, so the screen doesn’t fill up while you’re not touching the dial.

### 4. Add the start button, the countdown and the bell

Replace the sketch with the full timer:

```cpp timer.ino
const int dialPin = A0;
const int buttonPin = 2;
const int buzzerPin = 7;
const int ledPin = 8;

// 60 makes a real minute. Keep it at 1 while testing, so each "minute" lasts one second.
const int secondsPerMinute = 1;

int lastShown = 0;

int minutesChosen() {
  int reading = analogRead(dialPin);
  return map(reading, 0, 1023, 1, 40);
}

void startCooking(int minutes) {
  digitalWrite(ledPin, HIGH);
  Serial.println("Timer started. Happy cooking!");

  for (int left = minutes; left > 0; left--) {
    Serial.print("Minutes left: ");
    Serial.println(left);
    delay(1000L * secondsPerMinute);
  }

  Serial.println("Time's up! Kain na!");

  for (int i = 0; i < 5; i++) {
    tone(buzzerPin, 1000, 300);
    digitalWrite(ledPin, HIGH);
    delay(400);
    digitalWrite(ledPin, LOW);
    delay(300);
  }
}

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Turn the dial to choose the minutes, then press the button.");
}

void loop() {
  int minutes = minutesChosen();

  if (minutes != lastShown) {
    Serial.print("Set for ");
    Serial.print(minutes);
    Serial.println(" minutes");
    lastShown = minutes;
  }

  if (digitalRead(buttonPin) == LOW) {
    startCooking(minutes);
    lastShown = 0;
  }

  delay(50);
}
```

Upload it. Turn the dial to about 5, and press the button. The LED lights up, the Serial Monitor counts down “Minutes left: 5, 4, 3, 2, 1”, and then the light flashes and the buzzer rings five times.

### 5. Read the recipe

:::map Code | In the kitchen
- `minutesChosen()` | Read the dial and turn it into a number of minutes, from 1 to 40
- `digitalRead(buttonPin) == LOW` | Has someone pressed the start button?
- `startCooking(minutes)` | The whole cooking routine, kept in one place so `loop()` stays short
- `for (int left = minutes; left > 0; left--)` | Count down one minute at a time, until none are left
- `delay(1000L * secondsPerMinute)` | Wait one “minute”. The `L` tells Arduino this is a big number
- `tone(buzzerPin, 1000, 300)` | Ring the bell for 300 milliseconds
- `lastShown = 0` | Forget the last number shown, so the dial’s setting is displayed again afterwards
:::

The lines in `setup()` run once, just like preheating. Then `loop()` waits, and checks the dial and the button again and again, until someone presses start.

### 6. Make it a real timer

Testing with one-second minutes is handy, but a real timer needs real minutes. Change this one line near the top:

```cpp timer.ino
const int secondsPerMinute = 60;
```

Upload it again. Now set the dial to 30 or 35, put the pot on a low simmer, press the button, and go and do something else. The buzzer will call you back.

:::taste
Turn the dial all the way down, and the Serial Monitor should say `Set for 1 minutes`. Turn it all the way up, and it should say `Set for 40 minutes`. Set it to 3, press the button, and you should see the LED come on, then “Minutes left: 3”, “2”, “1” one second apart. After that, the buzzer should ring five times while the LED flashes. Then the timer should be ready to use again.

If something doesn’t work, taste and adjust:

- The countdown starts by itself: the button’s legs may be on the same side of the breadboard gap. Move them to opposite sides.
- The buzzer never sounds: run the buzzer test again on its own, and check the legs aren’t reversed.
- The number jumps around when you’re not touching the dial: check the middle pin of the dial goes to A0, and that the outer pins go to 5V and GND.
:::

:::own
- Make it a stopwatch for a longer simmer. Change the dial’s range from `1, 40` to `1, 90`.
- Add a cancel button. Inside the countdown loop, check `digitalRead(buttonPin) == LOW`, and use `return;` to stop early. Give the button a moment to be released first.
- Change the ring to a little tune. Try `tone(buzzerPin, 800, 200)`, then a higher note, then a lower one.
- Make the LED blink once a second while cooking, instead of staying on.
:::

## What you learned

- A project is small ideas combined: an input to read (the dial and the button), a decision, and an output to show the result (the light and the bell).
- Your own helper functions, like `minutesChosen()` and `startCooking()`, keep a longer sketch readable.
- `tone` and `noTone` control a buzzer, and testing each part alone first makes problems easy to find.

## Where to go next

You’ve now used lights, a button, a dial and a buzzer, which are the building blocks of a huge number of gadgets. From here, good next steps are a temperature sensor, so your timer can also watch the pot, a small display to show the minutes, or a board with Wi-Fi like an ESP32, so your project can send you a message.
