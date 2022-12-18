import * as fs from 'fs';
import * as followRedirects from 'follow-redirects';

const {http, https} = followRedirects;

const downloadFile = (url: string, destination: string): Promise<void> => {
    const file = fs.createWriteStream(destination);

    const httpLib = url.startsWith('https://') ? https : http;

    return new Promise<void>((resolve, reject) => {
        httpLib.get(url, response => {
            response.pipe(file);

            file.on('finish', () => {
                file.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });

            file.on('error', (error) => {
                console.log('File download error', error);
                reject(error);
            })
        })
    });
};

export default downloadFile;