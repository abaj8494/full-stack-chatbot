let messageText: string = "my first chat message"
// messageText = 5
/*
naturally this is a new tool and I'm not sure how to see the lsp info and even just
move around more generally without the mouse.

it's probably okay though since there are oher benefits to using this tool.

for example, grammar and spell-checking. refactoring ability. git ease, etc.
*/

const numbers: Array<number> = [1,2]
const bigNumbers: number[] = [300,400]

interface Chat {
    name: string;
    model: string;
}

const foodChat: Chat = {name: 'food recipes exploration', model: 'gpt-4'};
const typescriptChat: Chat = {name: 'typescript teacher', model: 'gpt-3.5-turbo'};

function displayChat(chat: Chat) :void {
    console.log(`Chat: ${chat.name}, Model: ${chat.model}`);
}

displayChat(foodChat)
displayChat(typescriptChat)

