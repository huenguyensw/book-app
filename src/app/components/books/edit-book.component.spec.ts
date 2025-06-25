import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditBookForm } from './edit-book.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BookService } from '../../services/book.service';

describe('EditBookForm', () => {
    let component: EditBookForm;
    let fixture: ComponentFixture<EditBookForm>;
    let bookServiceSpy: jasmine.SpyObj<BookService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const bookServiceMock = jasmine.createSpyObj('BookService', ['getBookById', 'updateBook']);
        const routerMock = jasmine.createSpyObj('Router', ['navigateByUrl'], { url: '/edit/123' });

        await TestBed.configureTestingModule({
            imports: [EditBookForm],
            providers: [
                { provide: BookService, useValue: bookServiceMock },
                { provide: Router, useValue: routerMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditBookForm);
        component = fixture.componentInstance;
        bookServiceSpy = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should load book data on init', fakeAsync(() => {
        const book = {
            id: '123',
            title: 'Test Book',
            author: 'Author A',
            genre: 'Fiction',
            publishedDate: '2023-01-01T00:00:00.000Z'
        };

        bookServiceSpy.getBookById.and.returnValue(of(book));

        component.ngOnInit();
        tick();

        expect(bookServiceSpy.getBookById).toHaveBeenCalledWith('123');
        expect(component.bookForm.value.title).toBe('Test Book');
        expect(component.bookForm.value.publishedDate).toBe('2023-01-01');
    }));

    it('should set error if book load fails', fakeAsync(() => {
        bookServiceSpy.getBookById.and.returnValue(throwError(() => new Error('Not found')));

        component.ngOnInit();
        tick();

        expect(component.error).toBe('Could not load book details');
    }));

    it('should submit updated book data and navigate', fakeAsync(() => {
        const updatedBook = {
            id: '123',
            title: 'Updated Book',
            author: 'New Author',
            genre: 'Mystery',
            publishedDate: '2023-06-01'
        };

        component.bookForm.setValue(updatedBook);
        bookServiceSpy.updateBook.and.returnValue(of({}));

        component.onSubmit();
        tick();

        expect(bookServiceSpy.updateBook).toHaveBeenCalled();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/books');
    }));

    it('should show error if update fails', fakeAsync(() => {
        const formValues = {
            id: '123',
            title: 'Fail Book',
            author: 'Author',
            genre: 'Drama',
            publishedDate: '2023-06-10'
        };

        component.bookForm.setValue(formValues);
        bookServiceSpy.updateBook.and.returnValue(throwError(() => new Error('Update error')));

        component.onSubmit();
        tick();

        expect(component.error).toBe('Failed to update book');
    }));

    it('should show error if form is invalid on submit', () => {
        component.bookForm.patchValue({
            id: '',
            title: '',
            author: '',
            genre: '',
            publishedDate: ''
        });

        component.onSubmit();

        expect(component.error).toBe('Please fill in all required fields');
        expect(bookServiceSpy.updateBook).not.toHaveBeenCalled();
    });
});
