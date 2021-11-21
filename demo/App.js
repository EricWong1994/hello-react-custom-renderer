import React, { Component } from 'react';

import { Text, render } from '../src/cIndex';

class App extends Component {
	render() {
		return (
			<Text>
				Congrats! You've successfully completed the tutorial. I'm
				excited to see what you build
			</Text>
		);
	}
}
render(<App />, `${__dirname}/text.docx`);

export default App;
