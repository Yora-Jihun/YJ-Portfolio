---
title: Dim the flame
path: electronics
order: 4
summary: Go beyond on and off. Fade an LED smoothly, using a trick called PWM.
serves: Anyone who finished the previous lesson
time: 25 minutes
level: Beginner
ingredients:
  - Your Arduino Uno, USB cable and the Arduino IDE
  - 1 LED, 1 resistor of about 220 ohms, 2 jumper wires and a breadboard
searchHint: Fade an LED with analogWrite and PWM on an Arduino Uno
keywords: arduino pwm analogwrite fade led brightness dimming for loop electronics beginner
---

:::analogy
A stove usually has a dial from low to high, but imagine yours only had “on” and “off”. How would you make a gentle simmer? You’d flick the flame on and off so quickly that the pot only sees the average.

An Arduino pin can only be fully on or fully off, too. But if it switches thousands of times a second, spending more time on for “bright” and less for “dim”, your eyes can’t see the flicker. They see a light at a level in between. That trick is called **PWM**, and it’s how a plain pin can dim a light.
:::

## Let’s cook

### 1. Move the LED to a PWM pin

Only some pins on the Uno can do this trick. They’re marked with a small wave, `~`, on the board: 3, 5, 6, 9, 10 and 11. Unplug the board and connect the LED like this:

:::map Part | Connect it to
- The LED’s long leg | One end of the 220 ohm resistor
- The other end of the resistor | Pin 9 on the Arduino
- The LED’s short leg | The GND pin on the Arduino
:::

### 2. Try three levels

Create a new sketch and paste this in:

```cpp dim.ino
const int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  analogWrite(ledPin, 10);
  delay(1000);
  analogWrite(ledPin, 100);
  delay(1000);
  analogWrite(ledPin, 255);
  delay(1000);
}
```

Upload it. The light should go from dim, to medium, to full brightness, once every second, then start again.

`analogWrite` takes a number from 0 to 255. Zero is completely off, 255 is fully on, and everything between is a level of brightness. The name is a little misleading, since the pin is still just switching on and off very quickly, but the effect is like an analogue dial.

### 3. Make it breathe

Doing that by hand gets tiring, so let a loop count for you. Replace the sketch with this:

```cpp dim.ino
const int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  for (int level = 0; level <= 255; level++) {
    analogWrite(ledPin, level);
    delay(5);
  }

  for (int level = 255; level >= 0; level--) {
    analogWrite(ledPin, level);
    delay(5);
  }
}
```

Upload it. The light now slowly glows brighter, then fades back down, like something breathing.

:::map Code | In the kitchen
- `for (int level = 0; level <= 255; level++)` | Turn the dial up one notch at a time, from 0 to 255
- `analogWrite(ledPin, level)` | Set the flame to that level
- `delay(5)` | Wait 5 milliseconds before the next notch, so the change is smooth
- `level--` | The opposite of `level++`: turn the dial down one notch
:::

:::taste
The LED should glow up and down smoothly, taking about 1.3 seconds each way (256 steps of 5 milliseconds).

If it only blinks on and off, taste and adjust: check that the resistor goes to pin 9, and not one without a `~`. If it doesn’t light at all, check the long leg of the LED goes toward the resistor.
:::

:::own
- Change `delay(5)` to `delay(1)` or `delay(20)`, and watch the speed change.
- Add `delay(500);` between the two loops, so the light rests at the top before fading.
- Ask Serial to print `level` inside the first loop, and watch the numbers go by in the Serial Monitor. Don’t forget `Serial.begin(9600);` in `setup()`.
:::

## What you learned

- A pin can only be on or off, but switching very fast (PWM) gives the effect of levels in between.
- `analogWrite(pin, 0 to 255)` sets the level, and only pins marked `~` can do it.
- A `for` loop counts for you, so you don’t have to repeat lines by hand.
