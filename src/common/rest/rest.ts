import { Server } from 'restify';

export interface IRoute {
    applyRoutes(server: Server): void;
}

export interface IPreparedError {
    content: PreparedErrorContent;
    status: number;
}

export class PreparedErrorContent {
    code: any;
    message?: any;
}

export class PreparedError implements IPreparedError{
    public content: PreparedErrorContent;
    public status: number;


    constructor(private error: any) {
        this.error = this.prepareError(error);
    }

    /**
     * Prepare error responses for HTTP/REST callers
     * @param {any} error - The error in which to process
     * @returns {Promise<any>} The prepared error to return to the REST caller
     */
    public prepareError(error: any): IPreparedError {
        
        let responseError: IPreparedError = {
            status: 404,
            content: {
                code: error.code,
                message: error.message
            }
        }
        return responseError;
    }
}

export function PrepareError(error: any): IPreparedError {
    return new PreparedError(error);
}


    