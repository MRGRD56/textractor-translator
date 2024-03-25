declare namespace ElectronRequest {
    import { BinaryToTextEncoding } from 'crypto';
    import { Stream, Writable } from 'stream';

    interface Session {
        // Docs: https://electronjs.org/docs/api/session

        /**
         * A `Session` object, the default session object of the app.
         */
        defaultSession: Session;
    }

    interface Options {
        /**
         * Request method
         * @default 'GET'
         */
        method?: string;
        /**
         * Request body
         * @default null
         */
        body?: string | null | Buffer | Stream;
        /**
         * Request headers
         */
        headers?: Record<string, string | string[]>;
        /**
         * Request query
         */
        query?: Record<string, string>;
        /**
         * Allow redirect
         * @default true
         */
        followRedirect?: boolean;
        /**
         * Maximum redirect count. 0 to not follow redirect
         * @default 20
         */
        maxRedirectCount?: number;
        /**
         * Request/Response timeout in ms. 0 to disable
         * @default 0
         */
        timeout?: number;
        /**
         * Maximum response body size in bytes. 0 to disable
         * @default 0
         */
        size?: number;
        /**
         * Whether to use nodejs native request
         * @default false
         */
        useNative?: boolean;

        // Docs: https://www.electronjs.org/docs/api/client-request#new-clientrequestoptions

        /**
         * Only in Electron. When use authenticated HTTP proxy, username to use to authenticate
         */
        username?: string;
        /**
         * Only in Electron. When use authenticated HTTP proxy, password to use to authenticate
         */
        password?: string;
        /**
         * Only in Electron. Whether to send cookies with this request from the provided session
         * @default true
         */
        useSessionCookies?: boolean;
        /**
         * Only in Electron. The Session instance with which the request is associated
         * @default electron.session.defaultSession
         */
        session?: Session;
    }

    interface ProgressInfo {
        /** Total file bytes */
        total: number;
        /** Delta file bytes */
        delta: number;
        /** Transferred file bytes */
        transferred: number;
        /** Transferred percentage */
        percent: number;
        /** Bytes transferred per second */
        bytesPerSecond: number;
    }

    type ProgressCallback = (progressInfo: ProgressInfo) => void;

    interface ValidateOptions {
        /** Expected hash */
        expected: string;
        /**
         * Algorithm: first parameter of crypto.createHash
         * @default 'md5'
         */
        algorithm?: string;
        /**
         * Encoding: first parameter of Hash.digest
         * @default 'base64'
         */
        encoding?: BinaryToTextEncoding;
    }

    interface Response {
        /** Whether the response was successful (status in the range 200-299) */
        ok: boolean;
        /** Response headers */
        headers: Record<string, string | string[]>;
        /** Return origin stream */
        stream: Stream;
        /** Decode response as ArrayBuffer */
        arrayBuffer(): Promise<ArrayBuffer>;
        /** Decode response as Blob */
        blob(): Promise<Blob>;
        /** Decode response as text */
        text(): Promise<string>;
        /** Decode response as json */
        json<T>(): Promise<T>;
        /** Decode response as buffer */
        buffer(): Promise<Buffer>;
        /**
         * Download file to destination
         * @param {Writable} destination Writable destination stream
         * @param {ProgressCallback=} onProgress Download progress callback
         * @param {ValidateOptions=} validateOptions Validate options
         */
        download: (
            destination: Writable,
            onProgress?: ProgressCallback,
            validateOptions?: ValidateOptions,
        ) => Promise<void>;
    }

    interface Blob {
        size: number;
        type: string;
        isClosed: boolean;
        content: Buffer;
        slice(start?: number, end?: number, type?: string): Blob;
        close(): void;
        toString(): string;
    }

    // declare const main: (requestURL: string, options?: Options) => Promise<Response>;

    // export { ProgressInfo, Response, main as default };

}

const httpRequest: (requestURL: string, options?: ElectronRequest.Options) => Promise<ElectronRequest.Response>;