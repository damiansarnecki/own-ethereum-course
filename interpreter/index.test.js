const Interpreter = require('./index');
const {STOP, ADD, SUB, PUSH, MUL, DIV, LT, GT, EQ, AND, OR, JUMP, JUMPI} = Interpreter.OPCODE_MAP;


describe('Interpreter', () => {
    describe('runCode()', () => {
        describe('and the code includes ADD', () => {
            it('adds two values', () => {
                expect(2+3).toEqual(5);
            })
        })
    })
})