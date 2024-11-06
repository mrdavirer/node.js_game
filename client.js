const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const min = parseInt(process.argv[2], 10);
const max = parseInt(process.argv[3], 10);

const client = new net.Socket();
client.connect(3000, '127.0.0.1', () => {
    console.log('Подключение к серверу...');

    client.write(JSON.stringify({ range: `${min}-${max}` }));
});

client.on('data', (data) => {
    const message = JSON.parse(data);

    if (message.message) {
        console.log(`Сообщение от сервера: ${message.message}`);
        promptGuess();
    }

    if (message.hint === "more") {
        console.log(`Сервер говорит "больше"`);
        promptGuess();
    } else if (message.hint === "less") {
        console.log(`Сервер говорит "меньше"`);
        promptGuess();
    } else if (message.hint === "correct") {
        console.log('Ура! Число угадано!');
        client.end();
        rl.close();
    }
});


function promptGuess() {
    rl.question('Введите ваше предположение: ', (answer) => {
        const guessedNumber = parseInt(answer, 10);
        if (!isNaN(guessedNumber)) {
            client.write(JSON.stringify({ answer: guessedNumber }));
        } else {
            console.log('Пожалуйста, введите корректное число.');
            promptGuess(); 
        }
    });
}

client.on('close', () => {
    console.log('Соединение закрыто');
});
