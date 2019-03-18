import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownToggle, DropdownMenu, Form, Label, Input, Button } from 'reactstrap';
import { account } from '../store';

function Account({ name, status, users, logIn, logOff }) {
	const [user, setState] = useState({ login: '', password: '' });
	const [isOpen, toggle] = useState(false);

	// watching user inputs
	function handleChange(event) {
		event.target.type === 'text' && setState({ ...user, login: event.target.value });
		event.target.type === 'password' && setState({ ...user, password: event.target.value });
	}

	// check if user is known
	function handleSubmit(event) {
		event.preventDefault();
		let match = false, userInfo = {};
		users.forEach(person => {
			if (person.login === user.login && person.password === user.password) {
				match = true;
				userInfo = { name: person.name, status: person.status };
			}

		});
		if (match) {
			toggle(false);
			logIn(userInfo);
		} else {
			alert('No pasaran!');
		}
	}

	// toggling account dropdown
	function handleToggle() {
		toggle(!isOpen);
	}

	return <div className='menu-account'>
		<span>Name:</span>
		<span className='ml-1 mr-2 font-weight-bold'>{name}</span>
		<span className='mr-2'>|</span>
		<span>Status:</span>
		<span className='ml-1 mr-2 font-weight-bold'>{status}</span>

		{status === 'guest' &&
			<Dropdown isOpen={isOpen} toggle={handleToggle}>
				<DropdownToggle className='account-enter'>Enter</DropdownToggle>
				<DropdownMenu className='account-dropdown'>
					<Form onSubmit={handleSubmit}>
						<Label>Name</Label>
						<Input value={user.name} onChange={handleChange} autoComplete='off' />
						<Label>Password</Label>
						<Input value={user.password} onChange={handleChange} type='password' autoComplete='off' />
						<div className='d-flex justify-content-center'>
							<Button type='submit' color='info' size='sm'>Submit</Button>
						</div>
					</Form>
				</DropdownMenu>
			</Dropdown>
		}

		{status !== 'guest' &&
			<Button className='account-enter' onClick={logOff}>Exit</Button>
		}
	</div>;
}

function stateToProps({ account }) {
	return {
		name: account.name,
		status: account.status,
		users: account.users,
	};
}

export default connect(stateToProps, account.dispatcher)(Account);