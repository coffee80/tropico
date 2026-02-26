import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuoteCard } from "./quote-card/quote-card";

@Component({
  selector: 'app-root',
  imports: [QuoteCard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tropico');
}
