import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent } from "react";
import * as bs from "../../bootstrap-aliases";
import { combine } from "../../helpers/style-helpers";
import * as style from "./Login.scss";

class Login extends PureComponent {

	public render() {
		return (
				<div className={style.loginWrapper}>
					<div className={style.titleWrapper}>
						<h1>Login</h1>
					</div>
					<form action="/auth/google/login" method="get">
						<button role="submit" className={combine(bs.btn, bs.btnOutlinePrimary, bs.mt4)}>
							<FontAwesomeIcon icon={faGoogle} className={bs.mr2}/>
							Login with Google
						</button>
					</form>
				</div>
		);
	}
}

export {
	Login,
};
