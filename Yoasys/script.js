const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const readline = require('readline');
require('dotenv/config');

const client = new OpenAIClient(
    process.env.GPT_ENDPOINT,
    new AzureKeyCredential(process.env.GPT_KEY),
);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const askQuestion = () => {
    return new Promise((resolve) => {
        rl.question('Por favor, digite algo (ou digite "sair" para encerrar): ', (answer) => {
            resolve(answer);
        });
    });
};

const getMessage = async (message) => {
    try {
        const response = await client.getCompletions(
            process.env.GPT_MODEL,
            message,
            {
                temperature: 0.7,
                maxTokens: 70,
            }
        );
        return response.choices[0].text.trim();
    } catch (error) {
        console.error(error);
    }
};

(async () => {

    while (true) {
        const userInput = await askQuestion();

        if (userInput.toLowerCase() === 'sair') {
            console.log('Encerrando o programa...');
            running = false;
            break;
        }

        const response = await getMessage(userInput);
        console.log(response);
    }

    rl.close();
})();

