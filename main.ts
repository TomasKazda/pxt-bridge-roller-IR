function bridgeDown() {
    running = false
    control.inBackground(function () { semaphor(4) })
    most.down()
    basic.pause(1500)
    control.inBackground(function () { zavora1.up() })
    control.inBackground(function () { zavora2.up() })
    basic.pause(5500)
    zavora1.stop()
    zavora2.stop()
    most.stop()
    running = true
}
function bridgeUp() {
    running = false
    control.inBackground(function () { semaphor(6, false) })
    control.inBackground(function () { zavora2.down() })
    zavora1.down()
    most.up()
    basic.pause(8000)
    zavora1.stop()
    zavora2.stop()
    most.stop()
    running = true
}

input.onButtonPressed(Button.AB, function () {
    running = false
    if (!most.isDown()) most.down()
    zavora1.down()
    zavora2.down()
    basic.pause(4000)
    zavora1.stop()
    zavora2.stop()
    most.stop()
    basic.showIcon(IconNames.Asleep)
})
input.onButtonPressed(Button.A, function () {
    if (running && most.isDown()) {
        bridgeUp()
    }
})
input.onButtonPressed(Button.B, function () {
    if (running && !most.isDown()) {
        bridgeDown()
    }
})

basic.showIcon(IconNames.Sword)
let running = false
//let zavora2 = new BridgeServo(AnalogPin.P13, 800, 1900, 1800)
//let zavora1 = new BridgeServo(AnalogPin.P14, 1150, 2025, 1925)
//let most = new BridgeServo(AnalogPin.P15, 1600, 1250, 1250)
let zavora2 = new BridgeServo(AnalogPin.P8, 1300, 2300, 1800)
let zavora1 = new BridgeServo(AnalogPin.P2, 1200, 2100, 1700)
let most = new BridgeServo(AnalogPin.P1, 1800, 1400, 1600)
most.speed = Speed.Immediately

while (!input.logoIsPressed())
{
    basic.pause(125)
}
most.down()
basic.showIcon(IconNames.Happy)
running = true

basic.forever(function () {
    //if (running) {
            // if (running && !most.isDown()) {
            //     bridgeDown()
            // }
    //}
    //basic.pause(100)
})

control.inBackground(function () {
    while (true) {
        zavora1.callPulse();
        zavora2.callPulse();
        most.callPulse();
        basic.pause(10) //100Hz
    }
})

pins.onPulsed(DigitalPin.P12, PulseValue.High, function () {
    music.playTone(Note.C, music.beat(BeatFraction.Quarter))
})

pins.onPulsed(DigitalPin.P13, PulseValue.High, function () {
    music.playTone(Note.D, music.beat(BeatFraction.Quarter))
})
pins.onPulsed(DigitalPin.P14, PulseValue.High, function () {
    music.playTone(Note.E, music.beat(BeatFraction.Quarter))
})
pins.onPulsed(DigitalPin.P15, PulseValue.High, function () {
    music.playTone(Note.F, music.beat(BeatFraction.Quarter))
})
