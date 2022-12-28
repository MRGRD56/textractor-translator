import * as process from 'process';
import * as console from 'console';

const nodeConsole = new console.Console(process.stdout, process.stderr);
export default nodeConsole;