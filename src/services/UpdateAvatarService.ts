/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
    user_id: string;
    avatarFileName: string;
}
class UpdateAvatarService {
    public async execute({ user_id, avatarFileName }: Request): Promise<User> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(user_id);

        if (!user) {
            throw new AppError(
                'Only authenticated users can change or insert avatar',
                401,
            );
        }

        if (user.avatar) {
            const avatarUserPath = path.join(
                uploadConfig.directory,
                user.avatar,
            );
            const avatarUserExists = await fs.promises.stat(avatarUserPath);
            if (avatarUserExists) {
                await fs.promises.unlink(avatarUserPath);
            }
        }

        user.avatar = avatarFileName;
        await usersRepository.save(user);
        return user;
    }
}

export default UpdateAvatarService;
