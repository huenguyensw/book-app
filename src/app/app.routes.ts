import { Routes } from '@angular/router';
import { authGuard  } from './guards/auth.guard';
import { BookListComponent } from './components/book-lists/book-list.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {  path: '', redirectTo: '/books', pathMatch: 'full' },
    {
        path: 'books',
        component: BookListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    }
];
