const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../db').models.user;
const jwtSecretKey = process.env.JWT_SECRET_KEY;

module.exports.login = async (req, res, next) => {
    if (req.body.username && req.body.password) {
        const { username, password } = req.body;
        try {
            const user = await User.findOne({ where: { username } });
            if (!user) {
                res.status(404).json({ message: 'Пользователь не найден' });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                res.status(401).json({ message: 'Неверный пароль' });
            }

            res.status(200).json(getAuthorizedUserObject(user));
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    } else {
        req.status(400).json({
            message: 'Не заполнены имя пользователя или пароль!',
        });
    }
};

module.exports.registration = async (req, res) => {
    const { username, surName, firstName, middleName, password } = req.body;
    if (username && surName && firstName && middleName && password) {
        try {
            const bcryptPassword = await bcrypt.hash(password, 10);
            const data = {
                username,
                surName,
                firstName,
                middleName,
                password: bcryptPassword
            };
            const result = await User.create(data);
            res.status(201).json(getAuthorizedUserObject(result.dataValues));
        } catch (err) {
            console.log(err);
            if (err.errors[0].message === 'username must be unique') {
                res.status(400).json({
                    message: 'Имя пользователя уже занято',
                });
            }
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    } else {
        res.status(400).json({ message: 'Необходимо заполнить все поля!' });
    }
};

module.exports.refreshToken = (req, res) => {
    const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
    res.status(200).json(getRefreshTokenObject(decodedToken.id));
};

function generateAccessToken(userID) {
    const token = jwt.sign({ id: userID }, jwtSecretKey, {
        expiresIn: 60 * 60,
    });

    return 'Bearer ' + token;
}

function getAuthorizedUserObject(user) {
    return Object.assign({
        firstName: user.firstName,
        id: user.id,
        image: user.image,
        middleName: user.middleName,
        permission: user.permission,
        surName: user.surName,
        username: user.username
    }, getRefreshTokenObject(user.id))
}

function getRefreshTokenObject(userID) {
    const token = generateAccessToken(userID);
    return {
        accessToken: token,
        refreshToken: token,
        accessTokenExpiredAt: Date.now() + 60 * 60 * 1000,
        refreshTokenExpiredAt: Date.now() + 60 * 60 * 1000,
    };
}
