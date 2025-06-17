import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

// src/app/services/book.service.ts
@Injectable({
    providedIn: 'root'
    })
    export class BookService {
        private baseUrl = `${environment.apiUrl}/api/books`;

        constructor(private http: HttpClient) {}
        getBooks() {
            return this.http.get<any[]>(this.baseUrl);
        }
        getBookById(id: string) {
            return this.http.get<any>(`${this.baseUrl}/${id}`);
        }
        addBook(book: any) {
            return this.http.post<any>(this.baseUrl, book);
        }
        updateBook(id: string, book: any) {
            return this.http.put<any>(`${this.baseUrl}/${id}`, book);
        }
        deleteBook(id: string) {
            return this.http.delete<any>(`${this.baseUrl}/${id}`);
        }
        searchBooks(query: string) {
            return this.http.get<any[]>(`${this.baseUrl}/search`, { params: { q: query } });
        }
    }