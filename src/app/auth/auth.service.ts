	// https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
	/*
		email	string	The email for the user to create.
		password	string	The password for the user to create.
		returnSecureToken	boolean	Whether or not to return an ID and refresh token. Should always be true.
	*/

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

interface AuthResponseData {
	idToken: string;
	email: string;
	refreshToken: string;
	expiresIn: string;
	localId: string;
}


@Injectable({providedIn: 'root'})
export class AuthService {
	private apiKey = 'AIzaSyC2COAURl3rWN06U5otc2C5-ed2it6h3rs';
	private signupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;

	constructor(private http:HttpClient) {}

	signup(email: string, password: string) {
		return this.http.post<AuthResponseData>(this.signupUrl, {
			email,
			password,
			returnSecureToken: true,
		})
	}
}