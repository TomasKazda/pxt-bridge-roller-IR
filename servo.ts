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

    public setPulse(pulse: number): void {
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

        for (let k = 0; k < Math.round(Math.abs(pulseFrom - pulseTo) / this._pulseStep); k++) {
            if (!this._pwmOn) return
            this._pulse += this._pulseStep * direction
            basic.pause(this._speed)
        }
    }

    public stop(): void {
        this._pwmOn = false
        pins.digitalReadPin(<number>this._pin)
        pins.setPull(<number>this._pin, PinPullMode.PullNone)
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

    public up(): void {
        this.setPulse(this._up)
    }
    public down(): void {
        this.setPulse(this._down)
    }
    public isDown(): boolean {
        return Math.abs(this._pulse - this._down) <= 100
    }
}