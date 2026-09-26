---
title: Measure with sound
path: electronics
order: 2
summary: Use an ultrasonic sensor to measure distance. Your Arduino sends out a sound you can’t hear and listens for the echo.
serves: Anyone who finished the previous lesson
time: 30 minutes
level: Beginner
ingredients:
  - Your Arduino Uno, USB cable and the Arduino IDE
  - An HC-SR04 ultrasonic sensor
  - 4 jumper wires
  - Optional, for the last step: the LED and resistor from the previous lesson
searchHint: Measure distance with an HC-SR04 ultrasonic sensor and an Arduino
keywords: arduino hc-sr04 ultrasonic sensor distance serial monitor pulsein echo trig electronics
---

:::analogy
When you tap a watermelon to check if it’s ripe, you send out a knock and listen to what comes back. The sound tells you what’s inside.

An ultrasonic sensor does the same with a sound too high for us to hear. It sends a short burst, waits for the echo to bounce back from whatever is in front of it, and times how long that took. The longer the wait, the farther away the object is.
:::

## Let’s cook

### 1. Connect the sensor

The HC-SR04 has four pins. With the board unplugged, connect them like this:

:::map Sensor pin | Connect it to
- VCC | 5V on the Arduino
- Trig | Pin 9
- Echo | Pin 10
- GND | GND on the Arduino
:::

:::note Using an ESP32 or ESP8266?
The HC-SR04 sends a 5 volt signal on its Echo pin. ESP32 and ESP8266 boards only accept 3.3 volts on their pins, so they need a small voltage divider or a level shifter between Echo and the board. This lesson uses an Arduino Uno to keep it simple.
:::

### 2. Write the recipe

In the Arduino IDE, create a new sketch and paste this in:

```cpp distance.ino
const int trigPin = 9;
const int echoPin = 10;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  float distanceCm = duration * 0.034 / 2;

  Serial.print("Distance: ");
  Serial.print(distanceCm);
  Serial.println(" cm");

  delay(500);
}
```

### 3. Upload and listen

Plug the board in, check that the right board and port are chosen, and click **Upload**. Then open the **Serial Monitor** (the magnifying glass at the top right of the IDE) and set the speed at the bottom to **9600 baud**.

Hold your hand in front of the sensor and move it closer and farther. New readings appear twice a second.

### 4. What is each part doing?

:::map Code | In the kitchen
- `trigPin` set to HIGH for 10 microseconds | The knock: a short burst of sound goes out
- `pulseIn(echoPin, HIGH)` | Listen, and time how long the echo takes to come back
- `duration * 0.034 / 2` | Turn that time into centimetres
- `Serial.print(...)` | Write the result on the screen, like reading out the order
:::

The number `0.034` is how far sound travels in one microsecond, in centimetres. We divide by 2 because the sound goes out and comes back, so it travelled the distance twice.

:::taste
With your hand about 10 centimetres away, the Serial Monitor should show a reading close to `Distance: 10.00 cm`. Move it away and the number grows.

If it always shows `0.00`, taste and adjust: check the Trig and Echo wires aren’t swapped, and that VCC goes to 5V. The sensor works best between about 2 and 400 centimetres, and flat surfaces facing the sensor give the cleanest readings.
:::

:::own
- Hold a book at different distances and compare the reading with a ruler.
- Make a “hands off the hot pot” warning: connect the LED from the previous lesson to pin 8, then add `pinMode(8, OUTPUT);` inside `setup()` and this inside `loop()`, after the `Serial.println` line:

```cpp distance.ino
  if (distanceCm < 20) {
    digitalWrite(8, HIGH);
  } else {
    digitalWrite(8, LOW);
  }
```

- Change 20 to another number, and see how it changes when the light turns on.
:::

## What you learned

- A sensor turns something in the real world into a number your code can use.
- `Serial.print` lets you see what your board is thinking.
- Sound travels at a steady speed, so measuring time gives you distance.
