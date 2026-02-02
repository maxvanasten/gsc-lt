#!/usr/bin/env deno
import { Token } from "../types/token.ts";
import { ASTItem } from "../types/astitem.ts";

if (Deno.args.length < 2) {
  console.error(
    "Invalid usage, proper usage: ./parser.ts tokens.json ast.json",
  );
  Deno.exit(1);
}

export default class Parser {
  tokens: Token[] = [];
  index: number = 0;
  buffer: Token[] = [];
  ast: ASTItem[] = [];
  constructor(input_tokens: Token[]) {
    this.tokens = input_tokens;
  }

  parse(): ASTItem[] {
    while (this.index < this.tokens.length) {
      switch (this.tokens[this.index].type) {
        case "special_character":
          // ===== COMMENTS =====
          if (this.tokens[this.index].identifier == "/") {
            // Check if next token is also '/', if so, parse a comment
            if (this.index + 1 < this.tokens.length) {
              if (
                this.tokens[this.index + 1].type == "special_character" &&
                this.tokens[this.index + 1].identifier == "/"
              ) {
                this.index += 2;
                const word_tokens = this.get_tokens_until_type("newline");
                const words: string[] = [];
                word_tokens.forEach((token: Token) => {
                  if (token.identifier) {
                    words.push(token.identifier);
                  }
                });

                this.ast.push({
                  type: "comment",
                  identifier: words.join(" "),
                });
              }
            }
          }
          // ===== INCLUDE STATEMENTS =====
          if (this.tokens[this.index].identifier == "#") {
            if (this.index + 1 < this.tokens.length) {
							if (this.tokens[this.index+1].type == "buffer" && this.tokens[this.index+1].identifier == "include") {
								this.index+=2;
								this.ast.push({
									type: "include_statement",
									identifier: this.tokens[this.index].identifier || ""
								});
							}
            }
          }
          break;
      }

      this.index++;
    }

    return this.ast;
  }

  // Advances until token of type $type and returns all tokens in between
  get_tokens_until_type(type: string): Token[] {
    const tokens: Token[] = [];
    let found = false;

    while (this.index < this.tokens.length && !found) {
      if (this.tokens[this.index].type == type) {
        found = true;
      } else {
        tokens.push(this.tokens[this.index]);
      }

      this.index++;
    }

    return tokens;
  }
}

const input_tokens_raw = new TextDecoder("utf-8").decode(
  Deno.readFileSync(Deno.args[0]),
);
const input_tokens = JSON.parse(input_tokens_raw);

const parser = new Parser(input_tokens);
const ast = parser.parse();

Deno.writeFileSync(Deno.args[1], new TextEncoder().encode(JSON.stringify(ast)));
