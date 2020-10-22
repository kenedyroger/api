class User {
    private readonly username: string;
    private readonly email?: string;

    constructor(userData: { email: string, username: string }) {
        this.username = userData.username;
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
            const user = new User({
                username: "username",
                email
            });
            return Promise.resolve(user);
        }
        return Promise.resolve(undefined);
    }
}

class SingUpUser {

    constructor(private readonly userAccountRepository: IUserAccountRepository) {
    }

    async signUp(userData: { email: string, username: string }) {
        if (!userData.username || !userData.email.length)
            throw new Error("Parâmetro faltando username");
        if (await this.emailAlreadyInUse(userData.email))
            throw new Error("Usuário já existe");
    }

    private async emailAlreadyInUse(email: string): Promise<boolean> {
        const existingUser = this.userAccountRepository.getUserByEmail(email);
        return !!existingUser;
    }
}

describe('User SingUp', () => {

    it('should not singUp user if email already exists', async function () {
        const userData = {
            username: "valid_user_name",
            email: "some_valid_email"
        };
        const userAccountRepository = new UserAccountRepositorySpy();
        const sut = new SingUpUser(userAccountRepository);
        await expect(sut.signUp(userData)).rejects.toThrow("Usuário já existe");
    });

    it('should not signUp an user if username is not provided', async function () {
        const userData = {
            username: null,
            email: "some_new_valid_email"
        };
        const userAccountRepository = new UserAccountRepositorySpy();
        const sut = new SingUpUser(userAccountRepository);
        await expect(sut.signUp(userData)).rejects.toThrow("Parâmetro faltando username");
    });
})
