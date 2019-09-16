import { Next, Request, Response, Server } from 'restify';
import { IRoute } from '@app/common/rest/rest';

const basePath: string = `/hello`;;

export class HelloRoute implements IRoute {

    constructor() {}

    public applyRoutes(server: Server): void {
        server.get(`${basePath}/world`, (request: Request, response: Response, next: Next) => {
            response.send(`Hello World!`);
            next();
        });
    }
}
