# Introduction
The purpose of this plugin is to provide an implementation of wall switch to control relays in addition to Apple Home app switch. Users can control relay from a switch mounted on wall like regular light switch.

# Dependencies
rpi-gpio https://github.com/JamesBarwell/rpi-gpio.js#readme

# Configuration
 ```
"accessories": [
    {
      "accessory": "WallSwitch",
      "name":  "Test Switch",
      "relayPin": 24,
      "switchPin": 23,
      "duration": 100
    }
 ```

![schematic](homebridge-wallswitch/images/Sketch_bb.png)
