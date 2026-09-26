---
title: Blink a light
path: electronics
order: 1
summary: Make a light blink with an Arduino. It’s the “hello world” of electronics, and you’ll be surprised how good it feels.
serves: Anyone curious about electronics
time: 25 minutes
level: Beginner
ingredients:
  - An Arduino Uno (or a compatible board) and its USB cable
  - The Arduino IDE, the free program for writing code for the board (arduino.cc)
  - For the second half: 1 LED, 1 resistor of about 220 ohms, 2 jumper wires and a breadboard
searchHint: Blink an LED with an Arduino Uno
keywords: arduino led blink electronics beginner digitalwrite delay pinmode circuit resistor uno
---

:::analogy
Cooking on a stove comes down to two decisions: is the flame on or off, and for how long? Turn it on for a while, off for a while, and you control everything from a slow simmer to a quick sear.

An Arduino does the same with electricity. It can switch a pin on (HIGH) or off (LOW), and wait between switches. A blinking light is the flame going on and off, once a second.
:::

## Let’s cook

### 1. Set up the kitchen

Install the Arduino IDE from arduino.cc and open it. Plug your board into the computer with the USB cable.

In the IDE, choose **Tools > Board** and pick **Arduino Uno**. Then choose **Tools > Port** and pick the port your board is on. It usually has the board’s name next to it.

### 2. Write the recipe

Choose **File > New Sketch**, delete everything in it, and paste this in:

```cpp blink.ino
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}
```

### 3. Send it to the board

Click the **Upload** button (the arrow pointing right) at the top left. After a few seconds the IDE says “Done uploading”. A small light marked **L** on the board now blinks once a second.

### 4. What is each part doing?

:::map Code | In the kitchen
- `void setup()` | Preheating the pan. It runs once, when the board starts
- `pinMode(LED_BUILTIN, OUTPUT)` | Decide that this pin will send power out, like choosing the burner
- `void loop()` | Stirring the pot. It runs again and again, forever
- `digitalWrite(..., HIGH)` | Flame on
- `digitalWrite(..., LOW)` | Flame off
- `delay(1000)` | Wait for 1000 milliseconds, which is one second
:::

### 5. Add your own light

The little **L** light is built in. Now add a light you can see. **Always use a resistor with an LED**, because without one the LED can burn out. Turn the board off (unplug the USB cable) and connect the parts like this:

:::map Part | Connect it to
- The LED’s long leg | One end of the 220 ohm resistor
- The other end of the resistor | Pin 8 on the Arduino
- The LED’s short leg | The GND pin on the Arduino
:::

Plug the board back in, and change your sketch to use pin 8:

```cpp blink.ino
const int ledPin = 8;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(1000);
  digitalWrite(ledPin, LOW);
  delay(1000);
}
```

Upload it again. Your own LED now blinks.

Using an ESP32 or ESP8266 instead of an Uno? The built-in light is on a different pin depending on the board, so check the number printed near your board’s light. The idea is the same.

:::taste
The LED should be on for one second, then off for one second, again and again.

If it doesn’t blink, taste and adjust: check that the long leg of the LED goes toward the resistor and pin 8, that the right board and port are selected under Tools, and that the upload said “Done uploading”.
:::

:::own
- Change both `delay(1000)` lines to `delay(200)` for a fast blink, or `delay(50)` for a flicker.
- Make it blink twice quickly, then pause for two seconds.
- Move the wire to a different pin, and change `ledPin` to match.
:::

## What you learned

- `setup()` runs once, and `loop()` runs forever.
- `pinMode`, `digitalWrite` and `delay` are enough to control a light.
- An LED needs a resistor, and it has a long and a short leg that go in a set direction.
