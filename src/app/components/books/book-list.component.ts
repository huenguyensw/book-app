
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';


@Component({
    selector: 'app-book-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FontAwesomeModule],
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit {
    books: any[] = [];
    loading: boolean = true;
    error: string | null = null;
    faEdit = faEdit; // FontAwesome icon for edit action
    faTrash = faTrash; // FontAwesome icon for delete action
    faBook = faBook; // FontAwesome icon for book


    constructor(
        private bookService: BookService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        // Load initially
        this.loadBooks();

        // Reload on navigation back to /books
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.loadBooks();
            });
    }

    loadBooks() {
        const token = localStorage.getItem('token');
        if (!token) {
            this.error = 'You must be logged in to view books.';
            this.loading = false;
            return;
        }
        console.log('Token is...', token);
        this.loading = true;
        this.error = null;
        this.bookService.getBooks().subscribe({
            next: (data) => {
                console.log('Fetched books:', data);
                this.books = data;
                this.loading = false;
                // Force Angular to check the UI
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to load books:', err);
                this.error = 'Failed to load books';
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    deleteBook(id: string) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Radera bok',
                message: 'Är du säker på att du vill radera den här boken?'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.bookService.deleteBook(id).subscribe({
            next: () => {
                console.log('Book deleted. Reloading books...');
                this.loadBooks();

            },
            error: (err) => {
                 console.error('DELETE failed:', err);
                this.error = 'Misslyckades att radera boken';
                this.loading = false;

            }
        });
            }
        });
        
    }
}