import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn = require("classnames");
import * as React from "react";
import { Component } from "react";

import * as bs from "bootstrap/dist/css/bootstrap.css";
import * as style from "./Login.scss";

class Login extends Component {
	public render() {
		return (
				<div className={style.loginWrapper}>
					<div className={style.titleWrapper}>
						<h1>Login</h1>
					</div>
					<form action="/auth/google/login" method="get">
						<button role="submit" className={cn(bs.btn, bs.btnOutlinePrimary, bs.mt4)}>
							<FontAwesomeIcon icon={faGoogle} className={bs.mr2}/>
							Login with Google
						</button>
					</form>
				</div>
		);
	}
}

export default Login;
