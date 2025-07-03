import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule, Router, NavigationEnd } from "@angular/router";
import { QuoteService } from "../../services/quote.service";
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from "@angular/core";
import { filter } from "rxjs/operators";
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';



@Component({
    selector: 'app-quotes',
    standalone: true,
    templateUrl: './quotes.component.html',
    imports: [CommonModule, RouterModule, FontAwesomeModule]
})
export class QuotesComponent implements OnInit {
    // quotes = [
    //     { text: 'Det viktigaste är att aldrig sluta fråga.', author: 'Albert Einstein' },
    //     { text: 'Livet är vad som händer medan du gör andra planer.', author: 'John Lennon' },
    //     { text: 'Var förändringen du vill se i världen.', author: 'Mahatma Gandhi' },
    //     { text: 'Framgång är summan av små ansträngningar upprepade dagligen.', author: 'Robert Collier' },
    //     { text: 'Tänk inte på vad andra tycker om dig, tänk på vad du tycker om dig själv.', author: 'Okänd' }
    // ];
    quotes: any[] = [];
    loading: boolean = true;
    error: string | null = null;
    faEdit = faEdit;
    faTrash = faTrash;
    

    constructor(
        private quoteSevice: QuoteService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog

    ) { }

    ngOnInit(): void {
        // Load quotes initially
        this.loadQuotes();

        // Reload quotes on navigation back to /quotes
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.loadQuotes();
            });
    }

    loadQuotes() {
        this.loading = true;
        this.error = null;

        this.quoteSevice.getQuotes().subscribe({
            next: (data) => {
                this.quotes = data;
                this.loading = false;
                // Force Angular to check the UI
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading quotes:', err);
                this.error = err.status === 401
                    ? 'Du måste logga in för att se citaten'
                    : 'Misslyckades att hämta citat';
                this.cdr.detectChanges();
                this.loading = false;
            }
        });
    }

    deleteQuote(id: string) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Radera citat',
                message: 'Är du säker på att du vill radera det här citat?'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.quoteSevice.deleteQuote(id).subscribe({
                    next: () => {
                        console.log('Citat raderat. Laddar om citat...');
                        this.loadQuotes();
                    },
                    error: (err) => {
                        console.error('Misslyckades att radera citat:', err);
                        this.error = 'Misslyckades att radera citat';
                        this.loading = false;
                    }
                });
            }
        });

    }
}