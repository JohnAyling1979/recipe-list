import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
	user: User;
	loading: boolean;
	authError: string;
}

const initialState: State = {
	user: null,
	loading: false,
	authError: null,
};

export function authReducer(state: State = initialState, action: AuthActions.AuthActions) {
	switch (action.type) {
		case AuthActions.AUTHENTICATE_SUCCESS:
			return {
				...state,
				loading: false,
				user: action.payload.user,
			};
		case AuthActions.LOGOUT:
			return {
				...state,
				user: null,
			};
		case AuthActions.LOGIN_START:
		case AuthActions.SIGNUP_START:
			return {
				...state,
				loading: true,
				authError: null,
			};
		case AuthActions.AUTHENTICATE_FAIL:
			return {
				...state,
				user: null,
				loading: false,
				authError: action.payload,
			};
		case AuthActions.CLEAR_ERROR:
			return {
				...state,
				authError: null,
			};
		default:
			return { ...state };
	}
}