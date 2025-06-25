import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BookService } from './book.service';
import { environment } from '../../environments/environment';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/books`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all books', () => {
    const mockBooks = [{ id: 1, title: 'Test Book' }];

    service.getBooks().subscribe((books) => {
      expect(books).toEqual(mockBooks);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockBooks);
  });

  it('should retrieve a book by ID', () => {
    const mockBook = { id: '123', title: 'Test Book' };

    service.getBookById('123').subscribe((book) => {
      expect(book).toEqual(mockBook);
    });

    const req = httpMock.expectOne(`${baseUrl}/123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockBook);
  });

  it('should add a book', () => {
    const newBook = { title: 'New Book' };
    const savedBook = { id: '1', ...newBook };

    service.addBook(newBook).subscribe((book) => {
      expect(book).toEqual(savedBook);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();
    expect(req.request.body).toEqual(newBook);
    req.flush(savedBook);
  });

  it('should update a book', () => {
    const updatedBook = { title: 'Updated Book' };

    service.updateBook('1', updatedBook).subscribe((res) => {
      expect(res).toEqual(updatedBook);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.withCredentials).toBeTrue();
    expect(req.request.body).toEqual(updatedBook);
    req.flush(updatedBook);
  });

  it('should delete a book', () => {
    service.deleteBook('1').subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ success: true });
  });

  it('should search books by query', () => {
    const query = 'angular';
    const mockResults = [{ id: 2, title: 'Angular for Beginners' }];

    service.searchBooks(query).subscribe((results) => {
      expect(results).toEqual(mockResults);
    });

    const req = httpMock.expectOne(`${baseUrl}/search?q=${query}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockResults);
  });
});
