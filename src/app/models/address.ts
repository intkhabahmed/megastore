import { User } from './user';
export class Address {
    _id: string
    user: User
    firstName: string
    lastName: string
    mobile: number
    address: string
    city: string
    state: string
    postalCode: number
}