import {Axios} from "axios";

export class HttpService extends Axios {

    constructor() {
        super();
    }

    public async getData<T>(url: string, config?: any): Promise<T> {
        console.log(config);
        return await this.get(url);
    }

    public async post<T>(url: string, data?: any, config?: any): Promise<T> {
        return await super.post(url, data, config);
    }
    public async put<T>(url: string, data?: any, config?: any): Promise<T> {
        return await super.put(url, data, config);
    }
}
