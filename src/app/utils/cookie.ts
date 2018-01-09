export class CookieUtil {

    static parse(setCookies) {
        var cookies = [];
        if (setCookies == undefined) {
            return [];
        }
        for (var i = 0; i < setCookies.length; i++) {
            var parts = setCookies[i].split('; ');
            var part0 = parts.shift();

            var item = part0.split('=');
            if(item[1]=='deleted'){//삭제된거 제외
                continue;
            }
            var cookie = { name: item[0], value: decodeURIComponent(item[1]) }
            for (var j = 0; j < parts.length; j++) {
                item = parts[j].split('=');
                cookie[item[0]] = decodeURIComponent(item[1]);
            }
            cookies.push(cookie);
        }
        return cookies;
    }


    static merge(orignal: Array<any>, addtion: Array<any>) {
        for (let cookie of addtion) {
            let index = orignal.findIndex(c => {
                return c.name == cookie.name
            })
            if (index>=0) {
                orignal[index] = cookie;
            }
            else {
                orignal.push(cookie);
            }
        }
        return orignal;
    }


    /**
     * 헤더용 문자열
     * @param cookies 
     */
    static toString(cookies: Array<any>) {        
        var value = '';
        for (let cookie of cookies) {
            value += `${cookie.name}=${cookie.value};`;
        }
        return value;
    }
}