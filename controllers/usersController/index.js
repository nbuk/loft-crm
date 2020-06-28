const User = require('../../db').models.user;
const Message = require('../../db').models.message;
const Sequelize = require('sequelize');
const path = require('path');
const unlinkFile = require('../../helpers/utils').unlinkFile;

module.exports.get = async (req, res) => {
    try {
        const results = await User.findAll({
            attributes: [
                'id',
                'firstName',
                'middleName',
                'surName',
                'username',
                'permission',
                'image',
            ],
        });
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports.patch = async (req, res) => {
    const id = req.params.id;
    const permission = req.body.permission;
    if (!permission) {
        res.status(400).json({ message: 'Неверные данные' });
    }

    try {
        await User.update({ permission }, { where: { id } });
        res.status(200).send('ok');
    } catch (err) {
        console.err(err);
        return res.status(500).end();
    }
};

module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ where: { id } });
        await Message.destroy({
            where: {
                [Sequelize.Op.or]: [{ userId: id }, { recipientId: id }],
            },
        });
        const userAvatarPath = path.join(process.cwd(), 'public', user.image);
        if (!userAvatarPath.includes('no-user-image-big.png')) {
            unlinkFile(userAvatarPath)
                .then(() => console.log('User avatar was removed'))
                .catch((err) => console.error(err));
        }
        const result = user.destroy();
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
