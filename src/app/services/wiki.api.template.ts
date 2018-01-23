import { Item, Body, ContextType, Keyvalue } from "app/models/item";

export class WikiTemplate {

    static bodyData(body: Body): Array<Keyvalue> {
        switch (body.mode) {
            case ContextType.urlencoded:
                return body.urlencoded;
            case ContextType.formdata:
                return body.formdata;
            case ContextType.raw:
                return [ new Keyvalue('',body.raw)];
        }

    }


    static trLoop(values: Array<any>) {
        var result = '';
        for (let v of values) {
            if(!v.key){
                continue;
            }
            result += `
            |-
            | ${v.key}
            | ${v.value}
            | ${v.description}`;
        }
        return result;

    }


    
    static responseExample(values: Array<any>) {
        var result = '';
        for (let v of values) {
            result += `
* '''${v.key}'''
<source lang="javascript">
${v.value}
</source>`;
        }
        return result;
    }

    static api(item: Item, parentTitle:string) {
        
        return `=='''개 요'''==
* PC 플래시 플레이어에서 생방송 시청에 필요한 정보를 얻기 위한 API


=='''Request URL'''==
* ${item.request.url}


=='''Request method'''==
* ${item.request.method}


=='''Request Parameter'''==
* mode : ${item.request.body.mode}
{| class="basic" width="100%" style="font-size:12px;"
! width="120" | 요청 변수
! width="200" | 값
! 설명
${WikiTemplate.trLoop(WikiTemplate.bodyData(item.request.body))}
|}




=='''Response'''==
${WikiTemplate.responseExample(item.response.examples)}        


[[category:${parentTitle}]]
        `;


        
    }


    /**
     * parent
     */
    static parent(description, parentName) {
return `${description}

[[Category:${parentName}]]
`;
    }

}