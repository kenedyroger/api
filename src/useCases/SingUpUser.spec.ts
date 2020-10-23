import {SingUpUser} from "@/useCases/SingUpUser";
import {UserAccountDto} from "@/entities/UserAccountDto";

type SutTypes = {
    sut: SingUpUser,
    userAccountRepository: any
}

class SystemUnderTest {
    static makeSut(): SutTypes {
        const userAccountRepositorySpy = {
            email: "valid_email",
            getUserByEmail: jest.fn((email: string) => {
                if (userAccountRepositorySpy.email === email) {
                    const userAccount: UserAccountDto = {id: "some_id", username: "username", email};
                    return Promise.resolve(userAccount);
                }
                return Promise.resolve(undefined);
            }),
            add: jest.fn((userData: UserAccountDto) => {
                userData.id = "some_id";
                return Promise.resolve(userData);
            })
        }
        const sut = new SingUpUser(userAccountRepositorySpy);
        return {
            sut,
            userAccountRepository: userAccountRepositorySpy
        }
    }
}

describe('User SingUp', () => {

    it('should not singUp an user if email already exists', async function () {
        const userData = {
            username: "valid_user_name",
            email: "some_valid_existing_mail"
        };
        const {sut, userAccountRepository} = SystemUnderTest.makeSut();
        userAccountRepository.email = "some_valid_existing_mail";
        await expect(sut.signUp(userData)).rejects.toThrow("Usuário já existe");
        await expect(userAccountRepository.getUserByEmail).toHaveBeenCalled();
    });

    it('should not signUp an user if username is not provided', async function () {
        const userData = {
            username: null,
            email: "some_new_valid_email"
        };
        const {sut} = SystemUnderTest.makeSut();
        await expect(sut.signUp(userData)).rejects.toThrow("Parâmetro faltando username");
    });

    it('should create a new user account with provided data', async function () {
        const userData = {
            username: 'some_username',
            email: 'some_valid_email'
        };
        const {sut} = SystemUnderTest.makeSut();
        await expect(sut.signUp(userData)).resolves.toEqual(Object.assign({id: 'some_id'}, userData));
    });
})
