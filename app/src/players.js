import React, { Component } from 'react'
import PlayersTable from './playersTable'
import firebase from './firebase'
// Widgets
import { Paper, Grid, Input, Checkbox, FormControlLabel, Button } from '@material-ui/core'

const db = firebase.firestore()

class Players extends Component {
  constructor() {
    super()
    this.unsubscribe = null
  }
  state = {
    players: []
  }


  componentDidMount() {
    this.unsubscribe = db.collection("players").onSnapshot(querySnapshot => {
      let playersData = []
      querySnapshot.forEach(doc => {
        playersData.push({
          docId: doc.id,
          code: doc.data().code,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          injury: doc.data().injury
        })
      })
      this.setState({ players: playersData })
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  noSubmitHandler(event) {
    event.preventDefault()
    let code = event.target.lastName.value.substring(0, 3) + Math.floor(Math.random() * 900 + 100)
    const player = {
      code: code.toUpperCase(),
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      injury: event.target.injury.checked
    }

    db.collection("players").add(player)
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id)
      })
      .catch(error => { console.log("Errro writting document: ", error) })
    event.target.reset()
  }

  render() {
    return (
      <Grid container direction='column' alignItems='center' justify='space-between' style={{ height: "calc(100% - 20px" }}>
        <Paper style={{ marginTop: '40px', minWidth: '300px', padding: '16px' }} >
          <form onSubmit={(event) => this.noSubmitHandler(event)}>
            <Grid container direction='column'>
              <Input type='text' name='firstName' required placeholder='First Name...' style={{ marginBottom: '16px' }} />
              <Input type='text' name='lastName' required placeholder='Last Name...' style={{ marginBottom: '16px' }} />
              <FormControlLabel
                control={<Checkbox defaultChecked={false} name="injury" />}
                label="Injury"
                style={{ marginBottom: '16px' }}
              />
            </Grid>
            <Button variant='contained' color='primary' type='submit'>Add Player</Button>
          </form>
        </Paper>

        <PlayersTable playersData={this.state.players} />
      </Grid>
    )
  }
}

export default Players
