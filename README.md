# GSC-LT (gsc language tools)

GSC-LT is a collection of tools for working with the .gsc language for Call of Duty: Black Ops II scripting. Specifically for the Plutonium client/server.

## Planned features

- Tokenizer
    - Turns raw GSC into tokens
- Parser
    - Turns tokens into an AST
- Generator
    - Turns an AST into raw GSC

## Usage

each module can be used individually either by running the script `./modules/tokenizer.ts input.gsc output.json` or by importing the module into a typescript file `import Tokenizer from './modules/tokenizer.ts'`.
