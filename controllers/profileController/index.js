const User = require('../../db').models.user;
const path = require('path');
const unlinkFile = require('../../helpers/utils').unlinkFile;
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
const uploadDir = require('../../helpers/config').uploadDir;
const bcrypt = require('bcrypt');
const Jimp = require('jimp');

module.exports.get = async (req, res) => {
    const user = await getUserFromToken(req.get('Authorization').split(' ')[1]);
    res.status(200).json(getUserObject(user));
};

module.exports.patch = async (req, res) => {
    const user = await getUserFromToken(req.get('Authorization').split(' ')[1]);
    const form = formidable.IncomingForm({ uploadDir });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            throw new Error(err);
        }
        const validFields = validateFields(fields);
        const validPassword = await validatePassword(fields, user.password);
        const validAvatar = validateAvatar(files);
        let dataToUpdate = {};

        if (validFields.err) {
            console.log(err);
            return validationErrorHandler(
                validFields.status,
                res,
                validAvatar.avatar,
            );
        }

        if (validPassword.err) {
            return validationErrorHandler(
                validPassword.status,
                res,
                validAvatar.avatar,
            );
        }

        if (validFields.status) {
            const { firstName, middleName, surName } = validFields;
            dataToUpdate = {
                ...dataToUpdate,
                firstName,
                middleName,
                surName,
            };
        }

        if (validPassword.status) {
            const newCryptedPassword = validPassword.newCryptedPassword;
            dataToUpdate = {
                ...dataToUpdate,
                password: newCryptedPassword,
            };
        }

        if (validAvatar.avatar) {
            const fileName = path.join(uploadDir, validAvatar.avatar.name);

            try {
                const image = await Jimp.read(validAvatar.avatar.path);
                image.scaleToFit(270, 270);
                image.write(fileName);
                unlinkFile(validAvatar.avatar.path);

                const oldAvatarPath = path.join(
                    process.cwd(),
                    'public',
                    user.image,
                );

                if (!oldAvatarPath.includes('no-user-image-big.png')) {
                    unlinkFile(oldAvatarPath).then(() =>
                        console.log('Old avatar removed')
                    );
                }

                dataToUpdate = {
                    ...dataToUpdate,
                    image: `assets/img/${validAvatar.avatar.name}`,
                };
            } catch (err) {
                console.error(err);
                unlinkFile(validAvatar.avatar.path);
                res.status(500).json({ message: 'Ошибка сервера' });
            }
        }

        try {
            await user.update(dataToUpdate);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }

        return res.status(200).json(getUserObject(user));
    });
};

function validateFields(fields) {
    const { firstName, middleName, surName } = fields;
    if (!firstName || !middleName || !surName) {
        return { status: 'ФИО обязательны для заполнения', err: true };
    }

    return { status: true, firstName, middleName, surName, err: false };
}

async function validatePassword(fields, userPassword) {
    let { oldPassword, newPassword } = fields;
    if (oldPassword && newPassword) {
        const match = await bcrypt.compare(oldPassword, userPassword);
        if (!match) {
            return { status: 'Неверный пароль', err: true };
        }
        const newCryptedPassword = await bcrypt.hash(newPassword, 10);

        return { status: true, newCryptedPassword, err: false };
    } else {
        return { err: false };
    }
}

function validateAvatar(files) {
    if (files.avatar) {
        const avatar = files.avatar;
        return { avatar, err: false };
    }

    return { err: false };
}

function validationErrorHandler(error, res, avatar = null) {
    console.error(error);
    if (avatar) {
        unlinkFile(avatar.path).then(() => console.log('File removed'));
    }

    return res.status(400).json({ message: error });
}

async function getUserFromToken(token) {
    const decodedToken = jwt.decode(token);
    return await User.findOne({ where: { id: decodedToken.id } });
}

function getUserObject(user) {
    return {
        firstName: user.firstName,
        id: user.id,
        image: user.image,
        middleName: user.middleName,
        permission: user.permission,
        surName: user.surName,
        username: user.username,
    };
}
