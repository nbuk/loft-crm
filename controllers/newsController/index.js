const News = require('../../db').models.news;
const User = require('../../db').models.user;
const jwt = require('jsonwebtoken');

module.exports.get = async (req, res) => {
    try {
        const news = await getNewsObjects();
        res.status(200).json(news);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports.post = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userID = jwt.decode(token).id;
    const permission = await getUserPermissionFromToken(token);
    if (!permission.news.C) {
       return res.status(403).json({ message: 'Недостаточно прав' });
    }

    const { text, title } = req.body;
    const data = {
        created_at: new Date(),
        text,
        title,
        userID,
    };
    try {
        await News.create(data);
        const news = await getNewsObjects();
        res.status(200).json(news);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports.patch = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const permission = await getUserPermissionFromToken(token);
    if (!permission.news.U) {
       return res.status(403).json({ message: 'Недостаточно прав' });
    }

    if (!req.body.title || !req.body.text) {
        res.status(400).json({
            message: 'Заголовок и текст не могут быть пустыми',
        });
    }
    const data = req.body;
    const id = req.params.id;
    try {
        await News.update(data, { where: { id } });
        const news = await getNewsObjects();
        res.status(200).json(news);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports.delete = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const permission = await getUserPermissionFromToken(token);
    if (!permission.news.D) {
       return res.status(403).json({ message: 'Недостаточно прав' });
    }

    try {
        const id = req.params.id;
        await News.destroy({ where: { id } });
        const news = await getNewsObjects();
        res.status(200).json(news);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

async function getNewsObjects() {
    const news = await News.findAll({ include: User });

    return news.map(({ dataValues }) => {
        const user = dataValues.user.dataValues;
        return {
            id: dataValues.id,
            created_at: dataValues.created_at,
            text: dataValues.text,
            title: dataValues.title,
            user: {
                firstName: user.firstName,
                id: user.id,
                image: user.image,
                middleName: user.middleName,
                surName: user.surName,
                username: user.username,
            },
        };
    });
}

async function getUserPermissionFromToken(token) {
    const decodedToken = jwt.decode(token);
    const userID = decodedToken.id;
    console.log(userID)
    const user = await User.findOne({ attributes: ['permission'], where: { id: userID } });

    return user.permission;
}
