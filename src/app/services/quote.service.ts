import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class QuoteService {
    private baseUrl = `${environment.apiUrl}/api/quotes`;

    constructor(private http: HttpClient) {}

    getQuotes() {
        return this.http.get<any[]>(this.baseUrl, { withCredentials: true });
    }

    getQuoteById(id: string) {
        return this.http.get<any>(`${this.baseUrl}/${id}`, { withCredentials: true });
    }

    addQuote(quote: any) {
        return this.http.post<any>(this.baseUrl, quote, { withCredentials: true });
    }

    updateQuote(id: string, quote: any) {
        return this.http.put<any>(`${this.baseUrl}/${id}`, quote, { withCredentials: true });
    }

    deleteQuote(id: string) {
        return this.http.delete<any>(`${this.baseUrl}/${id}`, { withCredentials: true });
    }
}