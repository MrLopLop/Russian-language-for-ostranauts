const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const getFilePathFromUser  = async (message) => {
    return new Promise((resolve) => {
        rl.question(message, (filePath) => {
            resolve(filePath);
        });
    });
};

const readJsonFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Ошибка чтения файла: ${err.message}`);
        return null;
    }
};

const writeJsonFile = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log(`Данные успешно записаны в файл: ${filePath}`);
    } catch (err) {
        console.error(`Ошибка записи в файл: ${err.message}`);
    }
};

const updateJsonData = (targetData, newData) => {
    const targetMap = new Map(targetData.map(item => [item.strName, item]));

    for (const item of newData) {
        const targetItem = targetMap.get(item.strName);
        if (targetItem) {
            targetItem.strNameShort = item.strNameShort;
            targetItem.strNameFriendly = item.strNameFriendly;
            targetItem.strNameDesc = item.strNameDesc;
            targetItem.strTitle = item.strTitle;
            targetItem.strDesc = item.strDesc;
            targetItem.strTooltip = item.strTooltip;
        }
    }
};

const main = async () => {
    const newStringsPath = await getFilePathFromUser ('Введите путь до файла с новыми строками: ');
    const targetFilePath = await getFilePathFromUser ('Введите путь до файла, в котором нужно заменить строки: ');

    const newStrings = await readJsonFile(newStringsPath);
    const targetData = await readJsonFile(targetFilePath);

    if (newStrings && targetData) {
        updateJsonData(targetData, newStrings);
        await writeJsonFile(targetFilePath, targetData);
    }

    rl.close();
};

main().catch(err => {
    console.error(`Ошибка: ${err.message}`);
    console.log(data);
});