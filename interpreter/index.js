const STOP = 'STOP';
const ADD = 'ADD';
const SUB = 'SUB';
const PUSH = 'PUSH';
const MUL = 'MUL';
const DIV = 'DIV';
const LT = 'LT';
const GT = 'GT';
const EQ = 'EQ';
const AND = 'AND';
const OR = 'OR';
const JUMP = 'JUMP';
const JUMPI = 'JUMPI';

const OPCODE_MAP = {STOP, ADD, SUB, PUSH, MUL, DIV, LT, GT, EQ, AND, OR, JUMP, JUMPI}

const EXECUTION_COMPLETE = 'Execution complete'
const EXECUTION_LIMIT = 10000;


class Interpreter {
    constructor() {
        this.state = {
            programCounter: 0,
            stack: [],
            code: [],
            executionCount: 0
        };
    }


    jump() {
        const destination = this.state.stack.pop();

        if(destination < 0 || destination > this.state.code.length) {
            throw new Error(`Invalid destination: ${destination}`);
        }
        this.state.programCounter = destination;
        this.state.programCounter--;
    }

    runCode(code) {
        this.state.code = code;

        while(this.state.programCounter < this.state.code.length) {
            this.state.executionCount++;
            if(this.state.executionCount > EXECUTION_LIMIT) {
                throw new Error(`Check for an infinite loop. Execution limit of ${EXECUTION_LIMIT} exceeded`)
            }

            const opCode = this.state.code[this.state.programCounter];

            try {
                switch(opCode) {
                    case STOP:
                        throw new Error(EXECUTION_COMPLETE);
                    case PUSH:
                        this.state.programCounter++;

                        if(this.state.programCounter == this.state.code.length) {
                            throw new Error(`The 'PUSH' instruction cannot be last.`)
                        }
                        const value = this.state.code[this.state.programCounter];
                        this.state.stack.push(value);
                        break;
                    case ADD:
                    case DIV:
                    case SUB:
                    case MUL:
                    case LT:
                    case GT:
                    case EQ:
                    case AND:
                    case OR:
                        let a = this.state.stack.pop();
                        let b = this.state.stack.pop();

                        let result;

                        if(opCode === ADD) result = a + b;
                        if(opCode === SUB) result = a - b;
                        if(opCode === MUL) result = a * b;
                        if(opCode === DIV) result = a / b;
                        if(opCode === LT) result = a < b ? 1 : 0;
                        if(opCode === GT) result = a > b ? 1 : 0;
                        if(opCode === EQ) result = a === b ? 1 : 0;
                        if(opCode === AND) result = a && b;
                        if(opCode === OR) result = a || b;

                        
                        this.state.stack.push(result);
                        break;
                    case JUMP:
                        this.jump();
                        break;
                    case JUMPI: 
                        let condition = this.state.stack.pop();
                        if(condition === 1) {
                            this.jump();
                        }
                        break;
                }
            } catch(error) {
                if(error.message === EXECUTION_COMPLETE) {
                    return this.state.stack[this.state.stack.length - 1];
                } 

                throw error;
                
            }

            this.state.programCounter++;
        }
    }
}

Interpreter.OPCODE_MAP = OPCODE_MAP;
module.exports = Interpreter;

let code = [
    PUSH,
    0, 
    JUMP, 
    PUSH, 
    'jump succesful', 
    STOP
]

let interpreter = new Interpreter();
try {
    console.log(interpreter.runCode(code));
} catch (error) {
    console.log('Error thrown: ', error.message)
}



