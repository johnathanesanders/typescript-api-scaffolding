import { createServer, plugins, Server } from 'restify';
import { asyncForEach, elementsAtPath, ElementAtPath } from '@app/common/utility/utility';
import { Environment } from '@environment/environment';

/**
 * RestService represents a Restify (RESTful HTTP) server
 */
export class RestService {
    private server: Server;
    public ready: Promise<any>;

    constructor() {
        this.ready = new Promise(async (resolve: any) => {
            try {
                this.server = createServer();
                await this.initialize();
                await this.mountRoutes();
                resolve(undefined);
            } catch (error) {
                console.log(error);
                process.exit(0);
            }
        });      
    }

    /**
     * Initialize the Restify server
     * @returns {Promise<void>}
     */
    private async initialize(): Promise<any> {
        try {
            this.server.name = `REST Server`;
            this.server.listen(Environment.httpListen || 8080, `localhost`, () => {
                console.log(`${this.server.name} listening at ${this.server.url}`);
            });

            /** Bypass problems specific to curl */
            this.server.pre(plugins.pre.userAgentConnection());
            /** Dedupe slashes in URL before routing */
            this.server.pre(plugins.pre.dedupeSlashes());
            return Promise.resolve(undefined);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Asynchronously iterate through all routes in /routes passing this.server so that they can be initialized
     * @returns {Promise<void>}
     */
    private async mountRoutes(): Promise<void> {
        try {
            const availableRoutes = await elementsAtPath(`${__dirname}/routes`, /(\.route\.ts)/);
            await asyncForEach(availableRoutes, async (availableRoute: ElementAtPath) => {
                try {
                    const importedRoute = await import(availableRoute.path); 
                    const route = new importedRoute[Object.keys(importedRoute)[0]];
                    route.applyRoutes(this.server);
                } catch (error) {
                    console.log(`Could not load route from ${JSON.stringify(availableRoute)}, skipping...`);
                }
            });

            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

}