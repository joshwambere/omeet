export interface ISocketData<T> {
    type: string;
    data: IData<any>;
}

export interface IData<T> {
    t: string;
    d: T;
}
