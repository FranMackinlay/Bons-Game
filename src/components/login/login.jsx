import React, { Component } from 'react';
import api from '../../services/api';
import './login.css';

const { login } = api();

export default class Login extends Component {
	state = {
		userInput: '',
	};

	userTyping = event => {
		this.setState({
			userInput: event.target.value,
		});
	};

	onSubmit = async event => {
		event.preventDefault();
		const { userInput } = this.state;

		const isLoginOk = await login(userInput);

		if (!isLoginOk.ok) {
			alert(isLoginOk.error);
			this.props.history.push('/login');
		} else {
			this.props.history.push({
				pathname: '/gameBoard',
				state: { name: userInput },
			});
		}
	};

	render() {
		return (
			<div className='login'>
				<h1>Welcome to Bons Game!</h1>
				<h3>What's your name?</h3>
				<form onSubmit={this.onSubmit}>
					<input type='text' onChange={this.userTyping} placeholder='Name..' />
					<button type='submit'>Let's play!</button>
				</form>
			</div>
		);
	}
}
