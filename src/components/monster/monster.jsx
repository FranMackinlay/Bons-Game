import React from 'react';

export default function Monster({ monster: { name, hp, shield, maxHp } }) {
	return (
		<div id='monster' className='card'>
			<div className='row no-gutters'>
				<div className='user col-md-4'>
					<i className='fas fa-user'></i>
				</div>
				<div className='col-md-8'>
					<div className='card-body'>
						<h5 className='card-title'>{name}</h5>
						<div className='hp-shield'>
							<h6 className='card-text'>
								HP: {hp}/{maxHp}
							</h6>
							<h6 className='card-text'>Shield: {shield}</h6>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
