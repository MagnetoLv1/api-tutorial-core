import { CONFIG } from "app/enums";

export enum ContextType {
    urlencoded = 'urlencoded',
    formdata = 'formdata',
    raw = 'raw',
  }
  export enum TYPE {
    FOLDER = 1 << 0,
    REQUEST = 1 << 1,
  }

export class Item {
    constructor(public path: string = CONFIG.root_path,
    public name: string='',
    public description:string='',
    public request: ItemRequest = new ItemRequest(),
    public response: ItemResponse = new ItemResponse()) {
    }
}
export class ItemRequest {
    url: string = ''
    method: string = '';
    body: Body = new Body();
    header: Array<Keyvalue> = [];
}
export class Body {

    constructor(public mode: string = ContextType.urlencoded,
        public formdata: Array<Keyvalue> = [new Keyvalue()],
        public urlencoded: Array<Keyvalue> = [new Keyvalue()],
        public raw: string = '') {
    }
}
export class Keyvalue {

    constructor(public key: string = '',
        public value: string = '',
        public description: string='',
        public type: string='') {
    }
}

export class ItemResponse {

    constructor(public status: number = 0,
        public statusText: string = '',
        public headers: Array<Keyvalue> = [],
        public body: string = '',
        public examples: Array<Keyvalue> = []) {
    }
}