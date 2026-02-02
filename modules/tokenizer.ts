#!/usr/bin/env deno
import { Token } from "../types/token.ts";

if (Deno.args.length < 2) {
  console.error(
    "Invalid usage, proper usage: ./tokenizer.ts input.gsc tokens.json",
  );
  Deno.exit(1);
}

export default class Tokenizer {
  input: string = "";
  index: number = 0;
  buffer: string = "";
  tokens: Token[] = [];
  constructor(raw_input: string) {
    this.input = raw_input;
  }

  tokenize(): Token[] {
    while (this.index < this.input.length) {
      switch (this.input[this.index]) {
        case ";":
        case "(":
        case ")":
        case "{":
        case "}":
        case "[":
        case "]":
        case "=":
        case "-":
        case "+":
        case "*":
        case "/":
        case ">":
        case "<":
        case ",":
        case "!":
        case "'":
        case '"':
        case "#":
          this.add_buffer();
          this.tokens.push({
            type: "special_character",
            identifier: this.input[this.index],
          });
          break;
        case "\n":
          this.add_buffer();
          this.tokens.push({
            type: "newline",
          });
          break;
				case " ":
					this.add_buffer();
					break;
        default:
          this.buffer += this.input[this.index];
      }

			this.index++;
    }

    return this.tokens;
  }

  add_buffer() {
    if (this.buffer.length && this.buffer != " ") {
      this.tokens.push({
        type: "buffer",
        identifier: this.buffer,
      });
    }
    this.buffer = "";
  }
}

const raw_input = new TextDecoder("utf-8").decode(
  Deno.readFileSync(Deno.args[0]),
);
const tokenizer = new Tokenizer(raw_input);
const tokens = tokenizer.tokenize();

Deno.writeFileSync(
  Deno.args[1],
  new TextEncoder().encode(JSON.stringify(tokens)),
);
