import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

type DevelopmentLevel = 'd1' | 'd2' | 'd3' | 'd4';
type LeadershipStyle = 's1' | 's2' | 's3' | 's4';
export interface UserData {
  leadershipStyle: LeadershipStyle;
  developmentLevel: DevelopmentLevel;
  userQuery: string;
}
export interface LLMResponse {
  feedback: string;
  metadata: {
    development_level: DevelopmentLevel;
    recommended_style: LeadershipStyle;
    applied_style: LeadershipStyle;
    is_aligned: boolean;
    warning: string | null;
    tokens: {
      input_tokens: number;
      output_tokens: number;
      total_tokens: number;
    };
    credits: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  generateFeedback(data: UserData): Observable<LLMResponse> {
    return this.http.post<LLMResponse>(`${this.apiUrl}/feedback/`, data);
  }
}
