class User {
    private readonly email: string;

    constructor(userData: { email: string }) {
        this.email = userData.email;
    }
}

interface IUserAccountRepository {
    getUserByEmail(email: string): Promise<User>
}

class UserAccountRepositorySpy implements IUserAccountRepository {
    private email = "some_valid_email";

    getUserByEmail(email: string): Promise<User> {
        if (this.email === email) {
            const user = new User({email});
            return Promise.resolve(user);
        }
        return Promise.resolve(undefined);
    }
}

class SingUpUser {

    constructor(private readonly userAccountRepository: IUserAccountRepository) {
    }

    async signUp(userData: { email: string }) {
        const existingUser = await this.userAccountRepository.getUserByEmail(userData.email);
        if (existingUser)
            throw new Error("Usuário já existe");
    }
}

describe('User SingUp', () => {
    it('should not singUp user if email already exists', async function () {
        const userData = {email: "some_valid_email"};
        const userAccountRepository = new UserAccountRepositorySpy();
        const sut = new SingUpUser(userAccountRepository);
        await expect(sut.signUp(userData)).rejects.toThrow("Usuário já existe");
    });
})
