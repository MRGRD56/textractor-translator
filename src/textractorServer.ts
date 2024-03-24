import nodeConsole from './utils/nodeConsole';
import {Sentence} from './configuration/Configuration';
import * as net from 'net';
import delay from './utils/delay';

const PIPE_NAME = 'MRGRD56_TextractorPipe_f30799d5-c7eb-48e2-b723-bd6314a03ba2';
const PIPE_PATH = '\\\\.\\pipe\\' + PIPE_NAME;

const connectToPipe = (): Promise<net.Socket> => {
    const executor = (resolve: (value: net.Socket) => void) => {
        try {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] Connecting to pipe`);
            nodeConsole.log(`[${timestamp}] Connecting to pipe`);

            const socket = net.connect(PIPE_PATH);

            socket.on('connect', () => {
                console.log('Connected to ' + PIPE_PATH);
                nodeConsole.log('Connected to ' + PIPE_PATH);
                resolve(socket);
            })

            socket.on('error', (e: any) => {
                // nodeConsole.error(`errno = ${e.errno}, syscall = ${e.syscall}, code = ${e.code}, address = ${e.address}`)
                if (e.syscall !== 'connect') {
                    console.error('Error on pipe', e);
                    nodeConsole.error('Error on pipe', e);
                    return;
                }

                console.error('Error connecting to pipe, retrying', e)
                nodeConsole.error('Error connecting to pipe, retrying', e)
                socket.destroy();
                delay(800).then(() => executor(resolve));
            });
        } catch (e) {
            console.error('Error connecting to pipe, retrying', e)
            nodeConsole.error('Error connecting to pipe, retrying', e)
            delay(800).then(() => executor(resolve));
        }
    };

    return new Promise(executor);
}

export const listenToPipe = async (onSentence: (sentence: Sentence) => void): Promise<void> => {
    const socket = await connectToPipe();

    let remainingBuffer = Buffer.alloc(0);

    socket.on('data', (data) => {
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

    socket.on('end', () => {
        console.log('Pipe disconnected. Trying to reconnect');
        nodeConsole.log('Pipe disconnected. Trying to reconnect');
        listenToPipe(onSentence);
    });
};
