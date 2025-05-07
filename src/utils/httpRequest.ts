import nodeFetch from 'node-fetch';
// import type electronRequestDefault from 'electron-request';

const httpRequest = nodeFetch;// as unknown as typeof electronRequestDefault;

export default httpRequest;