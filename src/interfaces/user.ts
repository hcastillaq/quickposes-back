export interface User {
	id?: string;
	email: string;
	password: string;
	favorites?: string[];
	aud?: string;
}
