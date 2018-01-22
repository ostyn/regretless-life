export class BaseGenericDao {
    constructor(http, name) {
        http.configure(config => {
            config
                .withBaseUrl(window.location.protocol + '//' + window.location.hostname + ':5000/' + name +'/')
                .withDefaults({
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    }
                });
        });
        this.http = http;
    }
}