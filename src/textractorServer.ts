import nodeConsole from './utils/nodeConsole';
import {Sentence} from './configuration/Configuration';
import * as net from 'net';
import delay from './utils/delay';

const PIPE_NAME = 'MRGRD56_TextractorPipe_f30799d5-c7eb-48e2-b723-bd6314a03ba2';
const PIPE_PATH = '\\\\.\\pipe\\' + PIPE_NAME;

const connectToPipe = async (): Promise<net.Socket> => {
    while (true) {
        try {
            console.log('Connecting to ' + PIPE_PATH)
            nodeConsole.log('Connecting to ' + PIPE_PATH)
            return net.connect(PIPE_PATH, () => {
                console.log('Connected to ' + PIPE_PATH);
                nodeConsole.log('Connected to ' + PIPE_PATH);
            });
        } catch (e) {
            console.error('Error connecting to pipe, retrying', e)
            nodeConsole.error('Error connecting to pipe, retrying', e)
            await delay(500);
        }
    }
}

export const listenToPipe = async (onSentence: (sentence: Sentence) => void): Promise<void> => {
    const client = await connectToPipe();

    let remainingBuffer = Buffer.alloc(0);

    client.on('data', (data) => {
        remainingBuffer = Buffer.concat([remainingBuffer, data]);

        while (remainingBuffer.length > 4) {
            const messageLength = remainingBuffer.readUInt32LE(0);

            if (remainingBuffer.length >= 4 + messageLength) {
                // Достаточно данных для извлечения сообщения
                const message = remainingBuffer.subarray(4, 4 + messageLength);
                // Удалить извлеченное сообщение из буфера
                remainingBuffer = remainingBuffer.subarray(4 + messageLength);

                const data = JSON.parse(message.toString('utf-8'));
                onSentence(data as Sentence);
            } else {
                // Не достаточно данных для полного сообщения, ожидать больше данных
                break;
            }
        }
    });

    client.on('end', () => {
        console.log('Pipe disconnected. Trying to reconnect');
        nodeConsole.log('Pipe disconnected. Trying to reconnect');
        listenToPipe(onSentence);
    });
};
