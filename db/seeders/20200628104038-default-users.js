'use strict';

const bcrypt = require('bcrypt');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            'users',
            [
                {
                    firstName: 'admin',
                    middleName: 'admin',
                    surName: 'admin',
                    username: 'admin',
                    image: 'assets/img/no-user-image-big.png',
                    password: bcrypt.hashSync('admin', 10),
                    permission: JSON.stringify({
                        chat: { C: true, R: true, U: true, D: true },
                        news: { C: true, R: true, U: true, D: true },
                        settings: { C: true, R: true, U: true, D: true },
                    }),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    firstName: 'user',
                    middleName: 'user',
                    surName: 'user',
                    username: 'user',
                    image: 'assets/img/no-user-image-big.png',
                    password: bcrypt.hashSync('user', 10),
                    permission: JSON.stringify({
                        chat: { C: true, R: true, U: true, D: true },
                        news: { C: false, R: true, U: false, D: false },
                        settings: { C: false, R: false, U: false, D: false },
                    }),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {},
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('users', null, {});
    },
};
