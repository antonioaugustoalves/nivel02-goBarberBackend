import { response } from 'express';
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
    name: string;
    email: string;
    password: string;
}
class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<User> {
        const usersRepository = getRepository(User);

        const checkUserExists = await usersRepository.findOne({
            where: { email },
        });

        if (checkUserExists) {
            throw new AppError('E-mail address already used by another user');
        }
        const hashedPwd = await hash(password, 10);
        const user = usersRepository.create({
            name,
            email,
            password: hashedPwd,
        });

        await usersRepository.save(user);
        return user;
    }
}

export default CreateUserService;
