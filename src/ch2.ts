// we started with some interfaces:
interface IChat {
    id: number;
    ownerId: number;
    messages: IMessage[];
}

interface IMessage {
    id: number;
    chatId: number;
    userId: number;
    content: string;
    feedback?: string; // something about null potentially?
    createdAt: Date; // a new type -- doesn't seem primitive though.
}

interface IUser {
    id: number;
    name: string;
    email: string;
}

interface IDatabaseResource<T> {
    get(id: number): Promise<T | null>; // i understand the union type inside the
    // generic type of the promise return type, but am not sure what promise itself
    // is supposed to do. I believe it is a type.

    getAll(): Promise<T[]>;
}

class ChatResource implements IDatabaseResource<IChat> {
    async get(id: number): Promise<IChat | null> {
        return null;
    }

    async getAll(): Promise<IChat[]> {
        return [];
    }
}
