import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../configs/constants/api';
import { FeedbackDtoOut } from '../configs/interfaces/feedback.interface';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private httpBE: HttpClient;

  constructor(private httpBackend: HttpBackend) {
    this.httpBE = new HttpClient(this.httpBackend);
  }

  public sendFeedback$(body: FeedbackDtoOut): Observable<void> {
    return this.httpBE.post<void>(`${API_URL}/feedback`, body);
  }
}
