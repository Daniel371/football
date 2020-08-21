import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Players from './players'
import Teams from './teams'
import Home from './home'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'

//Widgets
import {
	Switch,
	CssBaseline,
	Grid,
	AppBar,
	Typography,
	Container
} from '@material-ui/core'

class Layout extends Component {
	state = {
		darkMode: false
	}

	toggleDarkMode() {
		this.setState({ darkMode: !this.state.darkMode })
	}

	render() {
		const theme = createMuiTheme({
			palette: {
				type: this.state.darkMode ? 'dark' : 'light',
				secondary: {
					main: '#ff5252',
				}
			},
		})

		let toggleTitle = `Switch to ${this.state.darkMode ? 'Light' : 'Dark'} mode`

		return (
			<ThemeProvider theme={theme}>
				<CssBaseline />

				{/* Header */}
				<AppBar position='static'>
					<Grid>
						<Typography display='inline' variant='subtitle1'>{toggleTitle}</Typography>
						<Switch
							size='medium'
							checked={this.state.darkMode}
							onChange={() => this.toggleDarkMode()} />
					</Grid>
				</AppBar>

				{/* Content */}
				<Container style={{ height: 'calc(100vh - 38px' }}>
					<Route exact path='/' component={Home} />
					<Route exact path='/players' component={Players} />
					<Route exact path='/teams' component={Teams} />
				</Container>
			</ThemeProvider >
		)
	}


}

export default Layout
