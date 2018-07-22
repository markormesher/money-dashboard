import React, { Component } from "react";
import { Link } from "react-router-dom";

class Nav extends Component {
	render() {
		return (
				<ul>
					<li><Link to="/">Dashboard</Link></li>
					<li><Link to="/transactions">Transactions</Link></li>
				</ul>
		)
	}
}

export default Nav
