---
title: Turn the dial
path: electronics
order: 5
summary: Read a knob with a potentiometer, and use it to control how bright a light is.
serves: Anyone who finished the previous lesson
time: 30 minutes
level: Beginner
ingredients:
  - Your Arduino Uno, USB cable and the Arduino IDE
  - 1 potentiometer, about 10k ohms (a small knob with three pins)
  - The LED, 220 ohm resistor and breadboard from the previous lesson
  - 5 jumper wires
searchHint: Read a potentiometer with analogRead and use map to control LED brightness on an Arduino
keywords: arduino potentiometer analogread map serial monitor dial brightness sensor analog electronics beginner
---

:::analogy
A dial on a stove doesn’t just say “on” or “off”. It can be anywhere between low and high, and the cook reads it by feel. A **potentiometer** is that dial, in electronic form.

It gives the Arduino a voltage that goes smoothly from 0 to 5 volts as you turn it. The Arduino turns that voltage into a number, which your code can read and use.
:::

## Let’s cook

### 1. Connect the dial

A potentiometer has three pins. With the board unplugged, connect them like this, keeping the LED circuit on pin 9 from the last lesson:

:::map Potentiometer pin | Connect it to
- Left pin | 5V on the Arduino
- Middle pin | A0 on the Arduino
- Right pin | GND on the Arduino
:::

The two outer pins are the ends of the dial, and the middle pin is the part that slides along it. It reports where you’re standing between the two ends. If you swap the left and right pins, the dial just works backwards.

### 2. Read the dial

Create a new sketch and paste this in:

```cpp dial.ino
const int dialPin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int reading = analogRead(dialPin);

  Serial.print("Dial: ");
  Serial.println(reading);

  delay(100);
}
```

Upload it, then open the **Serial Monitor** and set it to **9600 baud**. Turn the knob slowly from one end to the other and watch the numbers.

`analogRead` gives a number from 0 to 1023. That’s 1024 possible steps between 0 volts and 5 volts.

### 3. Turn the dial into brightness

The dial goes to 1023, but `analogWrite` only understands 0 to 255. Arduino has a helper called `map` that converts a number from one scale to another. Replace the sketch with this:

```cpp dial.ino
const int dialPin = A0;
const int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int reading = analogRead(dialPin);
  int brightness = map(reading, 0, 1023, 0, 255);

  analogWrite(ledPin, brightness);

  Serial.print("Dial: ");
  Serial.print(reading);
  Serial.print("  Brightness: ");
  Serial.println(brightness);

  delay(50);
}
```

:::map Code | In the kitchen
- `analogRead(dialPin)` | Read where the dial is pointing, from 0 to 1023
- `map(reading, 0, 1023, 0, 255)` | Turn a number on the 0 to 1023 scale into the same place on the 0 to 255 scale, like converting cups to millilitres
- `analogWrite(ledPin, brightness)` | Set the light to that brightness
- `Serial.print(...)` | Show both numbers so you can see the conversion
:::

:::taste
Turn the dial all the way down, and the LED should be off, with the Serial Monitor showing about `Dial: 0  Brightness: 0`. Turn it all the way up, and the light should be at full brightness, showing about `Dial: 1023  Brightness: 255`. In the middle, the numbers should be about `512` and `127`.

If the numbers jump around wildly, taste and adjust: check that the middle pin of the dial goes to A0, and that the outer pins go to 5V and GND. If the reading is always 0 or always 1023, one of the outer wires is loose.
:::

:::own
- Swap the last two numbers, `map(reading, 0, 1023, 255, 0)`, so that turning the dial up makes the light darker.
- Use the dial to control speed instead: read it, map it to a range like 50 to 1000, and use the result in `delay()` to blink the LED faster or slower.
- Print only when the dial has moved by more than 5 steps, so the Serial Monitor doesn’t fill up while you’re not touching it.
:::

## What you learned

- `analogRead` turns a smoothly changing voltage into a number from 0 to 1023.
- `map` converts a number from one range to another, so a reading from one part can drive another.
- Sensors and outputs connect through code: read a value in, change it, send a value out.
