import { Component, inject, signal } from '@angular/core';
import { QuoteService } from '../quote-service';
import { Quote } from '../model/Quote';

@Component({
  selector: 'app-quote-card',
  imports: [],
  templateUrl: './quote-card.html',
  styleUrl: './quote-card.css',
})
export class QuoteCard {

    // il ts prende e manda i dati al service

    quoteService = inject(QuoteService);
    quote = signal<Quote | null>(null);

    constructor(){
        this.loadRandomQuote();
    }

    loadRandomQuote(){
         this.quoteService.getRandom().subscribe(quote => this.quote.set(quote));
    }

}
