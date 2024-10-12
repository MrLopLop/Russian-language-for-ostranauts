const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const getFilePathFromUser = async () => {
    return new Promise((resolve) => {
        rl.question('Введите путь до файла, который хотите проверить: ', (filePath) => {
            resolve(filePath);
        });
    });
};

const logData = async (message, logFilePath) => {
    const logEntry = `${new Date().toISOString()}: ${message}\n`;
    await fs.appendFile(logFilePath, logEntry);
};

const checkDuplicates = async (array, fieldName, index, logFilePath) => {
    const uniqueItems = new Set(array);
    if (uniqueItems.size !== array.length) {
        await logData(`Ошибка: Элемент ${index} содержит дубликаты в массиве '${fieldName}'.`, logFilePath);
    }
};

const containsRussianCharacters = (str) => /[а-яА-ЯёЁ]/.test(str);

const checkJsonFile = async (filePath) => {
    const logFilePath = `${path.basename(filePath, path.extname(filePath))}.log`;
    try {
        await fs.access(filePath, fs.constants.F_OK);
    } catch (err) {
        console.error(`Ошибка доступа к файлу: ${err.message}`);
        return;
    }

    try {
        let jsonData = await fs.readFile(filePath, 'utf8');
        jsonData = JSON.parse(jsonData);

        if (!Array.isArray(jsonData)) {
            await logData('Ошибка: JSON не является массивом.', logFilePath);
            return;
        }

        if (jsonData.length === 0) {
            await logData('Ошибка: JSON массив пуст.', logFilePath);
            return;
        }

        const nameSet = new Set();

        for (let index in jsonData) {
            const item = jsonData[index];

            await logData(`Проверка элемента ${index}: ${JSON.stringify(item)}`, logFilePath);

            if (!item.strName || typeof item.strName !== 'string') {
                await logData(`Ошибка: Элемент ${index} не содержит обязательное поле 'strName' или оно не является строкой.`, logFilePath);
                continue;
            }

            if (containsRussianCharacters(item.strName)) {
                await logData(`Ошибка: Элемент ${index} содержит русские символы в 'strName': ${item.strName}`, logFilePath);
            }

            if (nameSet.has(item.strName)) {
                await logData(`Ошибка: Элемент ${index} содержит дубликат 'strName': ${item.strName}`, logFilePath);
            } else {
                nameSet.add(item.strName);
            }

            if (item.strRaiseUI !== undefined){
                if (containsRussianCharacters(item.strRaiseUI)){
                    await logData(`Ошибка: Элемент ${index} содержит русские символы в 'strRaiseUI': ${item.strRaiseUI}`, logFilePath);
                }
            }

            if (item.strColor !== undefined){
                if (containsRussianCharacters(item.strColor)){
                    await logData(`Ошибка: Элемент ${index} содержит русские символы в 'strColor': ${item.strColor}`, logFilePath);
                }
            }

            if (item.strAnim !== undefined){
                if (containsRussianCharacters(item.strAnim)){
                    await logData(`Ошибка: Элемент ${index} содержит русские символы в 'strAnim': ${item.strAnim}`, logFilePath);
                }
            }

            if (item.strTargetPoint !== undefined){
                if (containsRussianCharacters(item.strTargetPoint)){
                    await logData(`Ошибка: Элемент ${index} содержит русские символы в 'strTargetPoint': ${item.strTargetPoint}`, logFilePath);
                }
            }

            if (item.strThemType !== undefined){
                if (containsRussianCharacters(item.strThemType)){
                    await logData(`Ошибка: Элемент ${index} содержит русские символы в 'strThemType': ${item.strThemType}`, logFilePath);
                }
            }

            if (item.strActionGroup !== undefined){
                if (containsRussianCharacters(item.strActionGroup)){
                    await logData(`Ошибка: Элемент ${index} содержит русские символы в 'strActionGroup': ${item.strActionGroup}`, logFilePath);
                }
            }

            if (item.nStackLimit !== undefined && typeof item.nStackLimit !== 'number' && item.nStackLimit !== null) {
                await logData(`Ошибка: 'nStackLimit' в элементе ${index} должен быть числом.`, logFilePath);
            }

            if (item.aInteractions !== undefined) {
                if (!Array.isArray(item.aInteractions)) {
                    await logData(`Ошибка: 'aInteractions' в элементе ${index} должно быть массивом.`, logFilePath);
                } else (item.aInteractions.length !== 0); {
                    await checkDuplicates(item.aInteractions, 'aInteractions', index, logFilePath);
                    for (let interaction of item.aInteractions) {
                        if (containsRussianCharacters(interaction)) {
                            await logData(`Ошибка: Элемент ${index} содержит русские символы в 'aInteractions': ${interaction}`, logFilePath);
                        }
                    }
                }
            }

            if (item.aStartingConds !== undefined) {
                if (!Array.isArray(item.aStartingConds)) {
                    await logData(`Ошибка: 'aStartingConds' в элементе ${index} должно быть массивом.`, logFilePath);
                } else (item.aStartingConds.length !== 0); {
                    await checkDuplicates(item.aStartingConds, 'aStartingConds', index, logFilePath);
                    for (let cond of item.aStartingConds) {
                        if (containsRussianCharacters(cond)) {
                            await logData(`Ошибка: Элемент ${index} содержит русские символы в 'aStartingConds': ${cond}`, logFilePath);
                        }
                    }
                }
            }

            if (item.aInverse !== undefined) {
                if (!Array.isArray(item.aInverse)) {
                    await logData(`Ошибка: 'aInverse' в элементе ${index} должно быть массивом.`, logFilePath);
                } else (item.aInverse.length !== 0); {
                    await checkDuplicates(item.aInverse, 'aInverse', index, logFilePath);
                    for (let Inverse of item.aInverse) {
                        if (containsRussianCharacters(Inverse)) {
                            await logData(`Ошибка: Элемент ${index} содержит русские символы в 'aInverse': ${Inverse}`, logFilePath);
                        }
                    }
                }
            }
        }
    } catch (parseError) {
        await logData(`Ошибка при парсинге JSON: ${parseError.message}`, logFilePath);
    } finally {
        rl.close();
    }
};

(async () => {
    const filePath = await getFilePathFromUser();
    await checkJsonFile(filePath);
})();