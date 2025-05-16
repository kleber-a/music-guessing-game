import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // //Novo
  // public name = signal('Kleber Andrade')

  // //Antiga
  // public name$ = new BehaviorSubject('Kleber Andrade $')

  constructor(private _http: HttpClient) { }

  #http = inject(HttpClient)
  #base = signal(environment.apiTask)
  #baseTest = signal(environment.apiTest)

  public httpListChart$(): Observable<any> {
    return this.#http.get<any>(`${this.#baseTest()}/test`).pipe(
      shareReplay()
    );
  }

  public httpGetMusic$(url:string): Observable<any> {
    return this.#http.get<any>(`${url}`);

  }


}
