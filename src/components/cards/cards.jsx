import React from 'react';
import './cards.css';

export default function Cards({ effect, value }) {
	return (
		<div id='card' className='card'>
			<h4>{effect}</h4>
			<div className='card-body'>
				<h5 className='card-text'>Value: {value}</h5>
			</div>
		</div>
	);
}
