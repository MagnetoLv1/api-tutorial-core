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
            result += `
            |-
            | purl
            | string
            | 시청 URL`;
        }
        return result;

    }

    static api(item: Item) {
        
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
        * '''성공일 경우'''
        <source lang="javascript">
        {"channel":
            {"result":"음수", "remsg":"결과 메세지"}
        }
        </source>
        
        * '''실패일 경우'''
        <source lang="javascript">
        {"channel":{"result":"-210", "pmst":"점검시작시간", "pmed":"점검종료시간","pmmo":"점검메세지","pmmo":"공지URL"}}
        </source>
        
             
        
        
        [[category:글로벌 아프리카TV:PC API 가이드]]
        `;
    }
}