const { accessToken } = require('./const');
const { vkApiRequest } = require('./vkApiRequest');

const commonParams = {
    access_token: accessToken,
    lang: 'ru',
    fields: 'photo_50,screen_name',
    v: '5.180',
};

/**
 * @param {Set<number>} ids
 * @returns {Promise<IUser[]>}
 */
function getUsersInfo(ids) {
    if (ids.size === 0) {
        return Promise.resolve([]);
    }

    try {
        return vkApiRequest('users.get', {
            ...commonParams,
            user_ids: [...ids].join(','),
        });
    } catch (e) {
        console.error('failed getUsers', e);
        return Promise.resolve([]);
    }
}

/**
 * @param {Set<number>} ids
 * @returns {Promise<IGroup[]>}
 */
async function getGroupsInfo(ids) {
    if (ids.size === 0) {
        return [];
    }

    try {
        const response = await vkApiRequest('groups.getById', {
            ...commonParams,
            group_ids: [...ids].join(','),
        });

        return response && response.groups || [];
    } catch (e) {
        console.error('failed getGroups', e);
        return [];
    }
}

function withResponse(handler) {
    return (req, res) => {
        handler(req).catch(err => err).then(result => {
            res.write(JSON.stringify({ result }));
            res.end();
        });
    };
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getUsers(req, res) {
    try {
        /** @type {string[]} */
        const ids = (req.body.userIds || req.query.userIds || '').split(',').filter(Boolean);

        if (ids.length === 0) {
            return [];
        }

        /** @type {Set<number>} */
        const userIds = new Set();
        /** @type {Set<number>} */
        const groupIds = new Set();

        ids.forEach(strId => {
            const id = Number(strId);

            (id > 0 ? userIds : groupIds).add(Math.abs(id));
        });

        const [users, groups] = await Promise.all([
            getUsersInfo(userIds),
            getGroupsInfo(groupIds),
        ]);

        return [...users, ...groups];
    } catch (e) {
        console.error('failed getUsers', e);
        return [];
    }
}

module.exports = withResponse(getUsers);
