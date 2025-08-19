const fetch = require('node-fetch');

/**
 * @template {T}
 * @param {string} method
 * @param {Record<string, string | number>} params
 * @returns {Promise<T>}
 */
async function vkApiRequest(method, params = {}) {
    const url = `https://api.vk.com/method/${method}`;

    /** @type {HeadersInit} */
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const body = new URLSearchParams(params).toString();

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
    });

    const result = await response.json();

    if ('error' in result) {
        throw result.error;
    }

    return result.response;
}

module.exports = { vkApiRequest };
