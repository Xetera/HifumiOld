export interface IORMConfig {
    type: string;
    url?: string;
    host?: string;
    port?: number,
    username?: string;
    password?: string;
    database?: string;
    synchronize: boolean;
    logging: boolean;
    dropSchema: boolean;
    entities: string[];
    migrations: string;
    subscribers: string[];
    cli: {
        entitiesDir: string;
        migrationsDir: string;
        subscribersDir: string;
    }
}
