import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

// src/app/services/book.service.ts
@Injectable({
    providedIn: 'root'
})
export class BookService {
    private baseUrl = `${environment.apiUrl}/api/books`;

    constructor(private http: HttpClient) { }
    getBooks() {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<any[]>(this.baseUrl, { headers });
    }
    getBookById(id: string) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<any>(`${this.baseUrl}/${id}`, { headers });
    }
    addBook(book: any) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.http.post<any>(this.baseUrl, book, {headers});
    }
    updateBook(id: string, book: any) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.http.put<any>(`${this.baseUrl}/${id}`, book, { headers });
    }
    deleteBook(id: string) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers });
    }
    searchBooks(query: string) {
        return this.http.get<any[]>(`${this.baseUrl}/search`, { params: { q: query } });
    }
}