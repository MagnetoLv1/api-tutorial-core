export class Item {
    path: string = '';
    name: string;
    request: ItemRequest = new ItemRequest();
    response: ItemResponse = new ItemResponse();
}
export class ItemRequest {
    url: string = ''
    method: string = '';
    body: Body = new Body();
    header: Array<Keyvalue> = [];
}
export class Body {
    mode: string = 'urlencoded';
    formdata: Array<Keyvalue> = [new Keyvalue()];
    urlencoded: Array<Keyvalue> = [new Keyvalue()];
    raw: string = '';
}
export class Keyvalue {
    key: string
    value: string
    description?: string
    type?: string
}

export class ItemResponse {

    constructor(public status: number = 0,
        public statusText: string = '',
        public headers: Array<Keyvalue> = [],
        public body: string = '') {
    }
}