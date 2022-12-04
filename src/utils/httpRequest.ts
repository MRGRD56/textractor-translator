import electronRequest from 'electron-request';
// import type electronRequestDefault from 'electron-request';

const httpRequest = electronRequest;// as unknown as typeof electronRequestDefault;

export default httpRequest;