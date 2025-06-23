import { Routes } from '@angular/router';
import { authGuard  } from './guards/auth.guard';
import { BookListComponent } from './components/books/book-list.component';
import { AddBookForm } from './components/books/add-book.component';
import { LoginComponent } from './components/login/login.component';
import { EditBookForm } from './components/books/edit-book.component';
import { QuotesComponent } from './components/quotes/quotes.component';

export const routes: Routes = [
    {  path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'books',
        component: BookListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'books/add',
        component: AddBookForm,
        canActivate: [authGuard]

    },
    {
        path: 'books/edit/:id',
        component: EditBookForm,
        canActivate: [authGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'quotes',
        component: QuotesComponent,
    },
];
