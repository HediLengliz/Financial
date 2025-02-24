import { environment } from '../environments/environement';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AbstractService {

    protected baseUrl = environment.baseUrl;
    constructor(protected http: HttpClient) { }
}
