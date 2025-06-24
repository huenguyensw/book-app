import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

// src/app/services/book.service.ts
@Injectable({
    providedIn: 'root'
})
export class BookService {
    private baseUrl = `${environment.apiUrl}/api/books`;

    constructor(private http: HttpClient) {}

    getBooks() {
        return this.http.get<any[]>(this.baseUrl, { withCredentials: true });
    }
    getBookById(id: string) {
        return this.http.get<any>(`${this.baseUrl}/${id}`, { withCredentials: true });
    }
    addBook(book: any) {
       
        return this.http.post<any>(this.baseUrl, book, { withCredentials: true });
    }
    updateBook(id: string, book: any) {
        
        return this.http.put<any>(`${this.baseUrl}/${id}`, book, { withCredentials: true });
    }
    deleteBook(id: string) {
        return this.http.delete<any>(`${this.baseUrl}/${id}`, { withCredentials: true });
    }
    searchBooks(query: string) {
        return this.http.get<any[]>(`${this.baseUrl}/search`, { params: { q: query }, withCredentials: true });
    }
}