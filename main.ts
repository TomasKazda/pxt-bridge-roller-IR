function bridgeDown() {
    running = false
    control.inBackground(function () { semaphor(4, false) })
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
    control.inBackground(function () { semaphor(6, true) })
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
let zavora2 = new BridgeServo(AnalogPin.P8, 1300, 2300, 1300)
let zavora1 = new BridgeServo(AnalogPin.P2, 1200, 2100, 1200)
let most = new BridgeServo(AnalogPin.P1, 1900, 1300, 1900)
most.speed = Speed.Immediately
while (!input.logoIsPressed())
{
    basic.pause(125)
}
most.down()
zavora1.up()
zavora2.up()
basic.showIcon(IconNames.Happy)
running = true

basic.forever(function () {
    if (running) {
        let pin12 = pins.digitalReadPin(DigitalPin.P12)
        let pin13 = pins.digitalReadPin(DigitalPin.P13)
        let pin14 = pins.digitalReadPin(DigitalPin.P14)
        let pin15 = pins.digitalReadPin(DigitalPin.P15)

        if (running && !most.isDown() && (pin12 == 0 || pin13 == 0))
        {
            bridgeDown()
        }            
        if (running && most.isDown() && (pin14 == 0 || pin15 == 0)) {
            bridgeUp()
        }
    }
    basic.pause(100)
})

control.inBackground(function () {
    while (true) {
        zavora1.callPulse();
        zavora2.callPulse();
        most.callPulse();
        basic.pause(10) //100Hz
    }
})