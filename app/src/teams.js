import React, { useState, useEffect } from 'react'
import TeamsTable from './teamsTable'
import firebase from './firebase'
import { makeStyles } from '@material-ui/styles'
import {
  Paper,
  Grid,
  Input,
  Button,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  FormControl,
  Checkbox
} from '@material-ui/core'


const db = firebase.firestore()
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const Teams = props => {
  const [teams, setTeams] = useState([])
  const [personName, setPersonName] = useState([])
  const [allPlayers, setAllPlayers] = useState([])
  const classes = useStyles();


  // GET PLAYER NAMES FOR SELECT
  useEffect(() => {
    let players = []
    db.collection('players')
      .get()
      .then(docs => {
        docs.forEach(doc => {
          players.push(`${doc.data().firstName} ${doc.data().lastName}`)
        })
        setAllPlayers(players)
      })
  }, [])
  const names = allPlayers


  // ADD DATA CHANGE LISTENER TO TEAMS TABLE
  useEffect(() => {
    db.collection("teams").onSnapshot(querySnapshot => {
      let teamsData = []
      querySnapshot.forEach(doc => {
        teamsData.push({
          docId: doc.id,
          code: doc.data().code,
          teamName: doc.data().teamName,
          venue: doc.data().venue,
          location: doc.data().location,
          players: doc.data().players
        })
      })
      setTeams(teamsData)
    })
  }, [])


  // SUBMIT ADDING NEW TEAM
  const onSubmitHandler = event => {
    event.preventDefault()
    let code = Math.floor(Math.random() * 900 + 100) + event.target.teamName.value.substring(0, 3)
    const team = {
      code: code.toUpperCase(),
      teamName: event.target.teamName.value,
      venue: event.target.venue.value,
      location: event.target.location.value,
      players: personName
    }
    db.collection("teams").add(team)
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id)
      })
      .catch(error => { console.log("Errro writting document: ", error) })
    event.target.reset()
    setPersonName([])
  }


  const handleChange = (event) => {
    setPersonName(event.target.value);
  };


  return (
    <Grid container direction='column' alignItems='center' justify='space-between' style={{ height: "calc(100% - 20px" }}>
      <Paper style={{ marginTop: '40px', minWidth: '300px', padding: '16px' }} >
        <form onSubmit={(event) => onSubmitHandler(event)}>
          <Grid container direction='column'>
            <Input type='text' name='teamName' required placeholder='Team Name...' style={{ marginBottom: '16px' }} />
            <Input type='text' name='venue' required placeholder='Venue...' style={{ marginBottom: '16px' }} />
            <Input type='text' name='location' required placeholder='Location...' style={{ marginBottom: '16px' }} />

            {/* Multiple selection select control */}
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-mutiple-checkbox-label">Select the players</InputLabel>
              <Select
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                multiple
                value={personName}
                onChange={handleChange}
                input={<Input />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}>

                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={personName.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Button variant='contained' color='primary' type='submit'>Add Team</Button>
        </form>
      </Paper>

      <TeamsTable teamsData={teams} />
    </Grid>
  )
}


export default Teams
