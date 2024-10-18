const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const getFilePathFromUser = async () => {
    return new Promise((resolve) => {
        rl.question('Введите путь до файла: ', (filePath) => {
            resolve(filePath);
        });
    });
};

const logData = async (data, logFilePath) => {
    const logEntry = `${JSON.stringify(data, null, 0).replace(/":"/g, '" : "').replace(/","/g, '", "')}\n`;
    await fs.appendFile(logFilePath, logEntry);
};

const checkJsonFile = async (filePath) => {
    const logFilePath = `${path.basename(filePath, path.extname(filePath))}.json`;
    try {
        await fs.access(filePath, fs.constants.F_OK);
    } catch (err) {
        console.error(`Ошибка доступа к файлу: ${err.message}`);
        return;
    }

    try {
        let jsonData = await fs.readFile(filePath, 'utf8');
        jsonData = JSON.parse(jsonData);

        for (let index in jsonData) {
            const item = jsonData[index];
            const logEntry = {};

            if (item.strNameShort !== undefined) {
                logEntry["strNameShort"] = item.strNameShort;
            }

            if (item.strName !== undefined) {
                logEntry["strName"] = item.strName
            }

            if (item.strNameFriendly !== undefined) {
                logEntry["strNameFriendly"] = item.strNameFriendly;
            }
            if (item.strNameDesc !== undefined) {
                logEntry["strNameDesc"] = item.strNameDesc;
            }
            if (item.strTitle !== undefined) {
                logEntry["strTitle"] = item.strTitle;
            }
            if (item.strDesc !== undefined) {
                logEntry["strDesc"] = item.strDesc;
            }
            if (item.strTooltip !== undefined) {
                logEntry["strTooltip"] = item.strTooltip;
            }

            if (Object.keys(logEntry).length > 0) {
                await logData(logEntry, logFilePath);
            }
        }

        console.log('Строки успешно записаны в лог-файл.');
    } catch (err) {
        console.error(`Ошибка обработки файла: ${err.message}`);
    } finally {
        rl.close();
    }
};

(async () => {
    const filePath = await getFilePathFromUser();
    await checkJsonFile(filePath);
})();