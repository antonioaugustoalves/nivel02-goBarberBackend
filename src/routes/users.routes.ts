/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { request, response, Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';
import CreateUserService from '../services/CreateUserService';
import UpdateAvatarService from '../services/UpdateAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRoute = Router();
const upload = multer(uploadConfig);
usersRoute.post('/', async (request, response) => {
    try {
        const { name, email, password } = request.body;
        const createUser = new CreateUserService();
        const user = await createUser.execute({
            name,
            email,
            password,
        });
        delete user.password;
        return response.json(user);
    } catch (err) {
        return response.status(400).json({ message: err.message });
    }
});

usersRoute.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const updateAvatar = new UpdateAvatarService();
        const user = await updateAvatar.execute({
            user_id: request.user.id,
            avatarFileName: request.file.filename,
        });

        delete user.password;
        return response.json(user);
    },
);

export default usersRoute;
