import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private apiUrl = 'https://niyati-feedback-api-b6dfdsh4bagpe9gz.centralus-01.azurewebsites.net/api/Feedback'; // Use your .NET API port

  constructor(private http: HttpClient) {}

  submitFeedback(feedback: { name: string; email: string; message: string }): Observable<any> {
    return this.http.post(this.apiUrl, feedback);
  }
}
