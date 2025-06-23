import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-quotes',
    templateUrl: './quotes.component.html',
    imports: [CommonModule,  RouterModule]
})
export class QuotesComponent {
    quotes = [
        { text: 'Det viktigaste är att aldrig sluta fråga.', author: 'Albert Einstein' },
        { text: 'Livet är vad som händer medan du gör andra planer.', author: 'John Lennon' },
        { text: 'Var förändringen du vill se i världen.', author: 'Mahatma Gandhi' },
        { text: 'Framgång är summan av små ansträngningar upprepade dagligen.', author: 'Robert Collier' },
        { text: 'Tänk inte på vad andra tycker om dig, tänk på vad du tycker om dig själv.', author: 'Okänd' }
    ];
}