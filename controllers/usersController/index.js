const User = require('../../db').models.user;

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
                'image'
            ]
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
    res.status(400).json({ message: 'Неверные данные' })
  }

  try {
    await User.update({permission}, { where: { id } });
    res.status(200).send('ok')
  } catch (err) {
      console.err(err);
      return res.status(500).end();
  }
};

module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await User.destroy({ where: { id } });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
