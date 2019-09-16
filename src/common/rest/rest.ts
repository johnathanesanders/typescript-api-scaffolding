import { Server } from 'restify';
import { Errors } from 'restify-errors';

export interface IRoute {
    applyRoutes(server: Server): void;
}

export interface IPreparedError {
    code: any;
    message: any;
    status: number;
}

export class PreparedError implements IPreparedError{
    public code: any;
    public message: any;
    public status: number;

    constructor(private error: any) {
        this.error = this.prepareError(error);
    }

    /**
     * Prepare error responses for HTTP/REST callers
     * @param {any} error - The error in which to process
     * @returns {Promise<any>} The prepared error to return to the REST caller
     */
    public prepareError(error: any): any {
        let responseCode: number;
        let responseMessage: string;
        let responseError: IPreparedError = {
            status: 404,
            code: responseCode,
            message: responseMessage
        }
        return Promise.resolve(responseError);
    }
}

export function PrepareError(error: any): IPreparedError {
    return new PreparedError(error);
}


    