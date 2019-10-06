import { User } from './user';
export class Message {
    _id: string
    user: User
    from: string
    message: string
    reply: string
    time: Date
}