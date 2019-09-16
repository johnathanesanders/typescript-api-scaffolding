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
    private strings: string[];
    public values: any[];
    private _step: string;
    private bind: any[];

    constructor(strings: string[], values: any[]) {
        this.strings = strings;
        this.values = values;
    }

    append(input: PreparedStatement | string): PreparedStatement {

        /** Since this.strings is a global and therefore soooo immutable, copy that dude... */
        let workingQuery: string[] = Array.from(this.strings);
        if (input instanceof PreparedStatement) {
            workingQuery.push(...input.query);
            this.values.push.apply(this.values, input.values);
        } else {
            workingQuery[this.query.length -1] += input;
        }
        this.strings = workingQuery;
        return this;
    }
    
    get query() {
        return this.bind ? this.text : this.strings.join('?');
    }

    get step() {
        return this._step;
    }

    useBind(value: any): any {
        if (value === undefined) {
            value = true;
        }
        if (value && !this.bind) {
            this.bind = this.values;
            delete this.values;
        } else if (!value && this.bind) {
            this.values = this.bind;
            delete this.bind;
        }
        return this;
    }

    setStep(step: string): void {
        this._step = step;
    }

    get text() {
        return this.strings.reduce((prev, curr, i) => prev + '$' + i + curr);
    }
}

export class ReadResult {
    rows: any[];
}

export function Prepare(query: any, ..._values: any[]): PreparedStatement {
    return new PreparedStatement(query, Array.from(arguments).slice(1));
}