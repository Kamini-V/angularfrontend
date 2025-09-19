import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ShopOwner } from '../models/shop-owner.model';

@Injectable({
  providedIn: 'root'
})
export class ShopOwnerService {
  private apiUrl = 'http://localhost:8080/api/shopowners';

  constructor(private http: HttpClient) {}

  getAllOwners(): Observable<ShopOwner[]> {
    return this.http.get<ShopOwner[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getOwnerById(id: number): Observable<ShopOwner> {
    return this.http.get<ShopOwner>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createOwner(owner: ShopOwner): Observable<ShopOwner> {
    return this.http.post<ShopOwner>(this.apiUrl, owner)
      .pipe(catchError(this.handleError));
  }

  updateOwner(id: number, owner: ShopOwner): Observable<ShopOwner> {
    return this.http.put<ShopOwner>(`${this.apiUrl}/${id}`, owner)
      .pipe(catchError(this.handleError));
  }

  deleteOwner(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('ShopOwnerService Error:', errorMessage);
    return throwError(() => errorMessage);
  }
}