import * as React from "react";
import { Component } from "react";

class Login extends Component {
	public render() {
		return (
				<div>
					<div>Login</div>
					<a href="/auth/google/login">Login with Google</a>
				</div>
		);
	}
}

export default Login;
