enum Speed {
  SlowestUltra = 100,
  Slowest = 60,
  Slow = 36,
  Normal = 14,
  Fast = 8,
  Fastest = 5,
  Ultra = 3,
  Immediately = 0
}
class Servo {
    private _pin: AnalogPin
    protected _pulse: number
    private _speed: Speed = Speed.Normal
    private _pulseStep: number = 10
    private _pwmOn: boolean = false
    private _minPulse: number = 500
    private _maxPulse: number = 2250

    constructor(pin: AnalogPin, initPulse: number = 1350) {
        this._pin = pin;
        this._pulse = initPulse
    }   
    
    public get speed(): Speed {
        return this._speed;
    }
    public set speed(value: Speed) {
        this._speed = value;
    }

    public setPulse(pulse: number):void {
        if (this._speed == Speed.Immediately) {
            this._pulse = pulse
            this._pwmOn = true
            return
        }
        this._pwmOn = true

        let direction: number = this._pulse < pulse ? 1 : -1
        let pulseFrom = Math.min(this._pulse, pulse);
        let pulseTo = Math.max(this._pulse, pulse)

        if (Math.abs(pulseFrom - pulseTo) < this._pulseStep) return

        for(let k = 0; k < Math.round(Math.abs(pulseFrom - pulseTo) / this._pulseStep); k++) {
            if (!this._pwmOn) return
            this._pulse += this._pulseStep * direction
            basic.pause(this._speed)
        }
    }

    public stop(): void {
        this._pwmOn = false
        pins.digitalReadPin(<number> this._pin)
        pins.setPull(<number> this._pin, PinPullMode.PullNone)
    }

    public callPulse(): void {
        if (this._pwmOn) {
            pins.servoSetPulse(this._pin, this._pulse)
            //console.logValue("pulse "+ this._pin, this._pulse)
        }
    }
}

class BridgeServo extends Servo {    
    private _up: number
    private _down: number

    constructor(pin: AnalogPin, up: number, down: number, initPulse: number = 1350) {
        super(pin, initPulse)
        this._up = up
        this._down = down
    }   

    public up():void {
        this.setPulse(this._up)
    }
    public down():void {
        this.setPulse(this._down)
    }
    public isDown():boolean {
        return Math.abs(this._pulse - this._down) <= 100
    }
}

function semaphor(duration: number, directionDown: boolean = true) {
    let cycles = Math.ceil(duration * 1000 / 3187)
    for (let index = 0; index < cycles; index++) {
        control.inBackground(function () {
            if (!directionDown) {
                for(let i = 0; i < 3; i++) {
                    basic.showAnimation(`
                    . . # . . . . . . . . . . . . . . # . . . # # # . # . # . # . . # . .
                    . . # . . . . # . . . . . . . . . . . . . . # . . . # # # . # . # . #
                    # . # . # . . # . . . . # . . . . . . . . . . . . . . # . . . # # # .
                    . # # # . # . # . # . . # . . . . # . . . . . . . . . . . . . . # . .
                    . . # . . . # # # . # . # . # . . # . . . . # . . . . . . . . . . . .
                    `, 140)
                }
                basic.showAnimation(`
                    . . # . . . . . . . . . . . . . . . . . . . . . .
                    . . # . . . . # . . . . . . . . . . . . . . . . .
                    # . # . # . . # . . . . # . . . . . . . . . . . .
                    . # # # . # . # . # . . # . . . . # . . . . . . .
                    . . # . . . # # # . # . # . # . . # . . . . # . .
                    `, 140)
            } else {
                for(let i = 0; i < 3; i++) {
                    basic.showAnimation(`
                    . . # . . . # # # . # . # . # . . # . . . . # . . . . . . . . . . . .
                    . # # # . # . # . # . . # . . . . # . . . . . . . . . . . . . . # . .
                    # . # . # . . # . . . . # . . . . . . . . . . . . . . # . . . # # # .
                    . . # . . . . # . . . . . . . . . . . . . . # . . . # # # . # . # . #
                    . . # . . . . . . . . . . . . . . # . . . # # # . # . # . # . . # . .
                    `, 140)
                }
                basic.showAnimation(`
                    . . # . . . # # # . # . # . # . . # . . . . # . .
                    . # # # . # . # . # . . # . . . . # . . . . . . .
                    # . # . # . . # . . . . # . . . . . . . . . . . .
                    . . # . . . . # . . . . . . . . . . . . . . . . .
                    . . # . . . . . . . . . . . . . . . . . . . . . .
                    `, 140)
            }
            basic.clearScreen()
        })
        basic.pause(400)
        music.playTone(349, music.beat(BeatFraction.Whole))
        music.rest(music.beat(BeatFraction.Eighth))
        music.playTone(440, music.beat(BeatFraction.Whole))
        basic.pause(500)
        music.playTone(349, music.beat(BeatFraction.Whole))
        music.rest(music.beat(BeatFraction.Quarter))
        music.playTone(440, music.beat(BeatFraction.Whole))
        basic.pause(100)
        //console.logValue("delay", 4*music.beat(BeatFraction.Whole)+music.beat(BeatFraction.Eighth)+music.beat(BeatFraction.Quarter)+1000)
    }
}

function mgCalibrate () {
    running = false
    basic.pause(100)
    most.speed = Speed.Immediately
    mgForceNormal = 0
    most.up()
    zavora1.down()
    zavora2.down()
    for (let index2 = 0; index2 <= 19; index2++) {
        mgForceNormal += input.magneticForce(Dimension.Strength)
        led.plotBarGraph(
        index2 + 1,
        20
        )
        basic.pause(50)
    }
    mgForceNormal = Math.idiv(mgForceNormal, 20)
    basic.pause(3000)
    basic.showIcon(IconNames.Yes)
    zavora1.stop()
    zavora2.stop()
    most.stop()
    basic.pause(100)
    running = true
    basic.clearScreen()
}
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

input.onLogoEvent(TouchButtonEvent.LongPressed, function () {
    mgCalibrate()
})
// input.onLogoEvent(TouchButtonEvent.Pressed, function () {
//     basic.showNumber(mgForceNormal)
// })
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
        radio.sendValue("upArr", mgForce)
        bridgeUp()
    }
})
input.onButtonPressed(Button.B, function () {
    if (running && !most.isDown()) {
        radio.sendValue("downArr", mgForce)
        bridgeDown()
    }
})

radio.setGroup(136)
radio.setTransmitPower(4)
basic.showIcon(IconNames.Sword)
let mgForce = 0
let mgForceNormal = 999
let mgHysteresis = 35
let running = false
let zavora2 = new BridgeServo(AnalogPin.P9, 800, 1900, 1800)
let zavora1 = new BridgeServo(AnalogPin.P8, 1150, 2025, 1925)
let most = new BridgeServo(AnalogPin.P16, 1600, 1250, 1250)
most.speed = Speed.Immediately

while (!input.logoIsPressed())
{
    basic.pause(125)
}
most.down()
basic.showIcon(IconNames.Happy)

basic.forever(function () {
    if (running) {
        mgForce = input.magneticForce(Dimension.Strength)
        if (mgForce > mgForceNormal + mgHysteresis) {
            if (running && !most.isDown()) {
                radio.sendValue("downArr", mgForce)
                bridgeDown()
            }
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

radio.onReceivedValue(function (name: string, value: number) {
    //console.logValue(name, value)
    if (name == "mgForceR")
    {
        if (running && most.isDown()) bridgeUp()
    }
})

