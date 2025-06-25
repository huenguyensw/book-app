import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BookListComponent } from './book-list.component';
import { BookService } from '../../services/book.service';
import { of, throwError, Subject } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ChangeDetectorRef } from '@angular/core';

import { UrlTree } from '@angular/router';

const dummyUrlTree: UrlTree = {
    root: null!,
    queryParams: {},
    fragment: null,
    queryParamMap: null!
};

describe('BookListComponent', () => {
    let component: BookListComponent;
    let fixture: ComponentFixture<BookListComponent>;
    let bookServiceSpy: jasmine.SpyObj<BookService>;
    let routerEvents$: Subject<any>;
    let routerSpy: jasmine.SpyObj<Router>;
    let dialogSpy: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        bookServiceSpy = jasmine.createSpyObj('BookService', ['getBooks', 'deleteBook']);
        routerEvents$ = new Subject();

        routerSpy = jasmine.createSpyObj(
            'Router',
            ['navigate', 'createUrlTree', 'serializeUrl'],
            { events: routerEvents$ }
        );

        routerSpy.createUrlTree.and.returnValue(dummyUrlTree);
        routerSpy.serializeUrl.and.returnValue('');

        dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

        await TestBed.configureTestingModule({
            imports: [BookListComponent],
            providers: [
                { provide: BookService, useValue: bookServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: MatDialog, useValue: dialogSpy },
                { provide: ActivatedRoute, useValue: {} },  // also add this if needed
                ChangeDetectorRef
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BookListComponent);
        component = fixture.componentInstance;
    });


    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should load books on init', fakeAsync(() => {
        const mockBooks = [{ title: 'Book A' }, { title: 'Book B' }];
        bookServiceSpy.getBooks.and.returnValue(of(mockBooks));

        component.ngOnInit();
        tick();

        expect(bookServiceSpy.getBooks).toHaveBeenCalled();
        expect(component.books).toEqual(mockBooks);
        expect(component.loading).toBeFalse();
    }));

    it('should handle error when loading books', fakeAsync(() => {
        const error = { status: 401 };
        bookServiceSpy.getBooks.and.returnValue(throwError(() => error));

        component.loadBooks();
        tick();

        expect(component.error).toBe('Du måste logga in för att se böckerna');
        expect(component.loading).toBeFalse();
    }));

    it('should reload books on navigation end event', fakeAsync(() => {
        bookServiceSpy.getBooks.and.returnValue(of([]));
        component.ngOnInit();
        tick();

        routerEvents$.next(new NavigationEnd(1, '/login', '/books'));
        tick();

        expect(bookServiceSpy.getBooks).toHaveBeenCalledTimes(2); // one on init, one on nav
    }));

    it('should confirm and delete book if confirmed', fakeAsync(() => {
        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
        dialogSpy.open.and.returnValue(dialogRefSpyObj);
        bookServiceSpy.deleteBook.and.returnValue(of({}));
        bookServiceSpy.getBooks.and.returnValue(of([])); // for reload

        component.deleteBook('123');
        tick();

        expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, jasmine.anything());
        expect(bookServiceSpy.deleteBook).toHaveBeenCalledWith('123');
        expect(bookServiceSpy.getBooks).toHaveBeenCalled(); // reload after delete
    }));

    it('should not delete book if dialog canceled', fakeAsync(() => {
        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(false) });
        dialogSpy.open.and.returnValue(dialogRefSpyObj);

        component.deleteBook('123');
        tick();

        expect(bookServiceSpy.deleteBook).not.toHaveBeenCalled();
    }));

    it('should set error if book deletion fails', fakeAsync(() => {
        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
        dialogSpy.open.and.returnValue(dialogRefSpyObj);
        bookServiceSpy.deleteBook.and.returnValue(throwError(() => new Error('delete failed')));

        component.deleteBook('123');
        tick();

        expect(component.error).toBe('Misslyckades att radera boken');
        expect(component.loading).toBeFalse();
    }));
});
