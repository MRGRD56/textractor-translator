import express from 'express';
import nodeConsole from './utils/nodeConsole';
import {Sentence} from './configuration/Configuration';

const SERVER_PORT = 18952;

export const runTextractorServer = (onSentence: (sentence: Sentence) => void): void => {
    const expressApp = express();
    expressApp.use(express.json());

    expressApp.listen(SERVER_PORT, () => {
        nodeConsole.log(`The server is listening on http://localhost:${SERVER_PORT}/`);
    });

    expressApp.post('/sentence', (req, res) => {
        const sentence = req.body as Sentence;
        onSentence(sentence);

        res.status(200);
        res.end();
    });
};
