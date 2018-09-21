var Service, Characteristic;
const gpio = require('rpi-gpio');
gpio.setMode(gpio.MODE_BCM);

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-switch", "WallSwitch", SwitchAccessory);
}

function SwitchAccessory(log, config) {
  this.log = log;
  this.name = config.name;
  this.binaryState = 0; // switch state, default is OFF
  this.relayPin = config.relayPin;
  this.switchPin = config.switchPin;
  this.duration = config.duration || 100;
  this.log("Starting a switch device with name '" + this.name + "'...");
  this.log("	 Relay : " + this.relayPin);
  this.log("	Switch : " + this.switchPin);
  this.log("  Duration : " + this.duration);
  gpio.setup(this.relayPin, gpio.DIR_LOW);
  gpio.setup(this.switchPin, gpio.DIR_IN, gpio.EDGE_BOTH, function () {
    gpio.read(this.switchPin, function (err, value) {
      state = value
    });
  }.bind(this));
}

SwitchAccessory.prototype.getPowerOn = function(callback) {
  var powerOn = this.binaryState > 0;
  this.log("Power state for the '%s' is %s", this.name, this.binaryState);
  callback(null, powerOn);
}

SwitchAccessory.prototype.setPowerOn = function(powerOn, callback) {
  this.binaryState = powerOn ? 1 : 0;
  gpio.write(this.relayPin, this.binaryState);
  this.log("Set power state on the '%s' to %s", this.name, this.binaryState);
  callback(null);
}

SwitchAccessory.prototype.getServices = function() {
    var SwitchService = new Service.Switch(this.name);
    
    SwitchService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getPowerOn.bind(this))
      .on('set', this.setPowerOn.bind(this));
      
     gpio.on('change', function(channel, value) {
       if (value == 1) {
         timeOn = Date.now();
       } else if (value == 0) {
         timeDiff = Date.now() - timeOn;
         if (timeDiff>this.duration) {
           SwitchService.setCharacteristic(Characteristic.On, !this.binaryState);
       }
     }
  }.bind(this));
  return [SwitchService];
}
