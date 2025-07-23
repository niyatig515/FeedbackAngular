import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private apiUrl = 'https://localhost:7100/api/feedback'; // Use your .NET API port

  constructor(private http: HttpClient) {}

  submitFeedback(feedback: { name: string; email: string; message: string }): Observable<any> {
    return this.http.post(this.apiUrl, feedback);
  }
}
