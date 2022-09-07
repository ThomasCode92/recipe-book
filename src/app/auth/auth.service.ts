import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

const BASE_URL =
  'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAn_4DJnapj3CknGFqPWmJgmwd73gWfrHM';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(BASE_URL, {
      email: email,
      password: password,
      returnSecureToken: true,
    });
  }
}
