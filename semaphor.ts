function semaphor(duration: number, directionDown: boolean = true) {
    let cycles = Math.ceil(duration * 1000 / 3187)
    for (let index = 0; index < cycles; index++) {
        control.inBackground(function () {
            if (!directionDown) {
                for (let i = 0; i < 3; i++) {
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
                for (let i = 0; i < 3; i++) {
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