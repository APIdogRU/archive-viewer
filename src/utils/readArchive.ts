import type { IArchiveRoot } from '@typings/IArchiveRoot';
import type { IArchiveLegacyRoot } from '@typings/legacy/IArchiveLegacyRoot';

import { upgradeLegacyArchiveFormat } from './upgradeLegacyArchiveFormat';

/**
 * Читает файл в строку
 * @param file Данный пользователем файл
 * @returns Содержимое файла в виде строки
 */
function readFileAsString(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as string);
        };

        reader.onerror = error => reject(error);

        reader.readAsText(file);
    });
}

/**
 * Пытается распарсить строку и проверить формат архива
 * @param jsonString Строка
 * @returns В случае успеха и прохождения всех проверок - объект типа IArchiveRoot
 */
function parseJsonAsArchive(jsonString: string): IArchiveRoot {
    try {
        const json: IArchiveRoot = JSON.parse(jsonString);

        if (!(json.meta && json.meta.v && json.data && Array.isArray(json.data))) {
            throw new Error('Неизвестный формат архива.');
        }

        return json;
    } catch (e) {
        throw new Error('Переданный файл не является корректным архивом (non-JSON)');
    }
}

/**
 * Проверка на то, что архив в старом формате
 * @param archive Объект архива
 * @returns true, если архив в старом формате
 */
function isLegacyFormat(archive: IArchiveRoot | IArchiveLegacyRoot): archive is IArchiveLegacyRoot {
    return archive.meta.v < '2.0';
}

/**
 * Пытается прочитать файл и вернуть объект архива
 * @param file Переданный пользователем файл
 * @returns Объект архива
 */
export async function readArchive(file: File): Promise<IArchiveRoot> {
    const jsonString = await readFileAsString(file);
    let archive = parseJsonAsArchive(jsonString);

    if (isLegacyFormat(archive)) {
        archive = upgradeLegacyArchiveFormat(archive);
    }

    archive.data.sort((a, b) => a.id - b.id);

    return archive;
}
