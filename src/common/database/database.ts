export enum DATATYPES {
    BIGINT = 'bigint',
    BIT = 'bit',
    BLOB = 'blob',
    CHAR = 'char',
    CLOB = 'clob',
    DATE = 'date',
    DATETIME = 'datetime',
    DECIMAL = 'decimal',
    DOUBLE = 'double',
    FLOAT = 'float',
    INT = 'int',
    JSON = 'json',
    MONEY = 'money',
    NCHAR = 'nchar',
    NULL = 'null',
    SMALLDATETIME = 'smalldatetime',
    SMALLINT = 'smallint',
    SMALLMONEY = 'smallmoney',
    TIME = 'time',
    TIMESTAMP = 'timestamp',
    TINYINT = 'tinyint',
    UNIQUEIDENTIFIER = 'uniqueidentifier'
}

export interface IDatabaseAdapter {
    executeTransaction<T>(transaction: PreparedStatement[]): Promise<T[]>,
    query<T>(statement: PreparedStatement): any
}

export class PreparedStatement {
    private readonly query: string[];
    public values: any[];
    private _step: string;

    constructor(query: string[], values: any[]) {
        this.query = query;
        this.values = values;
    }

    append(input: PreparedStatement | string): PreparedStatement {
        if (input instanceof PreparedStatement) {
            this.query.push(...input.query);
            this.query.push.apply(this.values, input.values);
        } else {
            this.query[this.query.length -1] += input;
        }
        return this;
    }
    
    get step() {
        return this._step;
    }

    setStep(step: string): void {
        this._step = step;
    }

    get text() {
        return this.query.reduce((prev, curr, i) => prev + '$' + i + curr);
    }
}

export function Prepare(query: any, ..._values: any[]): PreparedStatement {
    return new PreparedStatement(query, Array.from(arguments).slice(1));
}