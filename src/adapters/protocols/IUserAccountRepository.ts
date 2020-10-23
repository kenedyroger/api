import {UserAccountDto} from "@/entities/UserAccountDto";

export interface IUserAccountRepository {
    getUserByEmail(email: string): Promise<UserAccountDto>

    add(userAccount: Omit<UserAccountDto, 'id'>): Promise<UserAccountDto>
}
