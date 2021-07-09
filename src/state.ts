/*

Functions to store restore array of bits.
Conversion is done as if you join the array as 0 and 1, eg binary number then prepend 1 at the beginning
and convert it into HEX number format for "compression".

Reconversion is done the same way backwards. The first true bit is discarted.

This way we can also store [false, false, true] which would convert to 001 and the 0 would be lost.

*/

export function toHexString(bitArray: Array<boolean>): string {
    bitArray.unshift(true) // first bit always one

    let value: Array<number> = []

    let char: Array<boolean> = []
    let number: number
    let max = bitArray.length - 1
    for (let i = 1; i <= Math.ceil(bitArray.length / 4); i++) {
        const from = max - i * 4 + 1
        const to = max - (i - 1) * 4 + 1 // last element is excluded => + 1

        char = bitArray.slice(from >= 0 ? from : 0, to)
        number = char.reduce((acc: number, x: boolean) => {
            return (acc << 1) | (x ? 1 : 0)
        }, 0)

        value.push(number)
    }

    return value.reverse().map(x => x.toString(16)).join('')
}

export function fromHexString(hex: string): Array<boolean> {
    const a: boolean[] = []

    let beginning = true
    hex.split('').forEach(number => {
        const int = parseInt(number, 16)

        for (let i = 0; i <= 3; i++) {
            const value = !!(int & (8 >> i)) // bit check: start with 1000 and shift right

            if (beginning && value === false) continue // skip zeros
            if (beginning && value === true) { // first one marks start of the array as in toHexString()
                beginning = false
                continue
            }

            a.push(value)
        }
    })

    return a
}