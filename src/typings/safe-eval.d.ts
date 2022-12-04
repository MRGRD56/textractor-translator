declare module 'safe-eval' {
    function safeEval(code: string, context?: Record<string, any>, opts?: any): any;
    export = safeEval;
}