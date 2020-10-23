import {IUserAccountRepository} from "@/adapters/protocols/IUserAccountRepository";
import {UserAccountDto} from "@/entities/UserAccountDto";

export class SingUpUser {

    constructor(private readonly userAccountRepository: IUserAccountRepository) {
    }

    async signUp(userData: Omit<UserAccountDto, 'id'>): Promise<UserAccountDto> {
        if (!userData.username || !userData.email.length)
            throw new Error("Parâmetro faltando username");
        if (await this.emailAlreadyInUse(userData.email)) {
            throw new Error("Usuário já existe");
        }
        return await this.userAccountRepository.add(userData);
    }

    private async emailAlreadyInUse(email: string): Promise<boolean> {
        const existingUser = await this.userAccountRepository.getUserByEmail(email);
        return !!existingUser;
    }
}
