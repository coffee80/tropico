import { inject, Injectable } from '@angular/core';
import { Quote } from './model/Quote';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  
    // IL SERVICE DI ANGULAR PARLA CON LE API
    // I COMPONENTI DI ANGULAR PARLANO COL SERVICE

    // COMPONENTE => SERVICE => API
    http= inject(HttpClient);
    
    // il service e il componente si parlano spesso tramite Observable
    // un Observable è una operazione asincrona PER NOI che serve per caricare dati dalle API
    public getRandom():Observable<Quote>{
        // perché la mia api non funziona
        return this.http.get<Quote>('http://localhost:3000/api/randomquote');
    }


}
