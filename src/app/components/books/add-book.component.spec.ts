import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddBookForm } from './add-book.component';
import { BookService } from '../../services/book.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

describe('AddBookForm', () => {
  let component: AddBookForm;
  let fixture: ComponentFixture<AddBookForm>;
  let bookServiceSpy: jasmine.SpyObj<BookService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    bookServiceSpy = jasmine.createSpyObj('BookService', ['addBook']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [AddBookForm, ReactiveFormsModule],
      providers: [
        { provide: BookService, useValue: bookServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddBookForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component and initialize form with ID', () => {
    expect(component).toBeTruthy();
    expect(component.bookForm.get('Id')?.value.length).toBe(24);
  });

  it('should not submit if form is invalid', () => {
    component.bookForm.setValue({
      Id: '123456789012345678901234',
      title: '',
      author: '',
      genre: '',
      publishedDate: ''
    });

    component.onSubmit();

    expect(bookServiceSpy.addBook).not.toHaveBeenCalled();
  });

  it('should call addBook and navigate on valid form', fakeAsync(() => {
    const formValue = {
      Id: '123456789012345678901234',
      title: 'New Book',
      author: 'Author Name',
      genre: 'Fiction',
      publishedDate: '2023-10-01'
    };

    component.bookForm.setValue(formValue);
    bookServiceSpy.addBook.and.returnValue(of({}));
    routerSpy.navigateByUrl.and.returnValue(Promise.resolve(true));

    component.onSubmit();
    tick();

    expect(bookServiceSpy.addBook).toHaveBeenCalledWith(formValue);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/books');
  }));

  it('should handle addBook error', fakeAsync(() => {
    const formValue = {
      Id: '123456789012345678901234',
      title: 'New Book',
      author: 'Author Name',
      genre: 'Fiction',
      publishedDate: '2023-10-01'
    };

    component.bookForm.setValue(formValue);
    const mockError = { error: 'Something went wrong' };
    bookServiceSpy.addBook.and.returnValue(throwError(() => mockError));

    component.onSubmit();
    tick();

    expect(component.error).toBe('Failed to add book');
  }));
});
