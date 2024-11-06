const net = require('net');

let secretNumber; 

const server = net.createServer((socket) => {
    console.log('Игрок подключился. Готов к игре...');

    socket.on('data', (data) => {
        try {
            const message = JSON.parse(data);

            if (message.range) {
                const [min, max] = message.range.split('-').map(Number);
                secretNumber = Math.floor(Math.random() * (max - min + 1)) + min;
                console.log(`Диапазон получен: ${min}-${max}. Загадано число: ${secretNumber}`);
                socket.write(JSON.stringify({ message: "Диапазон принят, начинаем игру!" }));
                return;
            }

            
            if (message.answer !== undefined) {
                const guessedNumber = Number(message.answer);
                console.log(`Получено предположение от клиента: ${guessedNumber}`);
                if (guessedNumber < secretNumber) {
                    console.log('Отправка подсказки: больше');
                    socket.write(JSON.stringify({ hint: "more" })); 
                } else if (guessedNumber > secretNumber) {
                    console.log('Отправка подсказки: меньше');
                    socket.write(JSON.stringify({ hint: "less" })); 
                } else {
                    console.log('Игрок угадал число!');
                    socket.write(JSON.stringify({ hint: "correct" })); 
                    socket.end(); 
                }
            }
        } catch (error) {
            console.error('Ошибка при обработке данных от клиента:', error.message);
        }
    });

    socket.on('end', () => {
        console.log('Клиент отключился');
    });
});

server.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
