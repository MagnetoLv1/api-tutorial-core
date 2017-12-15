export interface IItem {
        path: string;
        name: string;
        request: IRequest;
        response: IResponse;
}
export interface IRequest {
        url: string
        method: string;
        body: IBody;
        header: Array<IKeyvalue>;
}
export interface IBody {
        mode: string;
        formdata: Array<IKeyvalue>;
        urlencoded: Array<IKeyvalue>;
        raw: string;
}
export interface IKeyvalue {
        key: string
        value: string
        description?: string
        type?: string
}

export interface IResponse {
        status: number;
        statusText: string;
        headers: Array<IKeyvalue>;
        body: string;
}