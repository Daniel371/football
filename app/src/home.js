import React, { useState, useEffect } from 'react'
import Player from './assets/player.png'
import Team from './assets/team.png'
import Pencil from './assets/pencil.png'
import GameTable from './gamesTable'
import CategoryButton from './categoryButton'
import RecordGameButton from './recordGameButton'
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { makeStyles } from '@material-ui/styles'
import firebase from 'firebase'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}))

const db = firebase.firestore()


export const Home = () => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [teamNames, setTeamNames] = useState([])
  const [gamesData, setGamesData] = useState([])
  const classes = useStyles()


  // GETTING LIST OF TEAMS
  useEffect(() => {
    db.collection('teams')
      .get()
      .then(docs => {
        let allTeams = []
        docs.forEach(doc => {
          allTeams.push({
            teamName: doc.data().teamName,
            teamCode: doc.data().code
          })
        })
        setTeamNames(allTeams)
      })
  }, [])

  const selectTeams = teamNames.map((team, index) => {
    return <MenuItem key={index} value={`${team.teamName}-${team.teamCode}`}>{team.teamName}</MenuItem>
  })


  // LISTENING FOR CHANGES IN GAMES TABLE
  useEffect(() => {
    db.collection("games").onSnapshot(querySnapshot => {
      let gamesData = []
      querySnapshot.forEach(doc => {
        gamesData.push({
          docId: doc.id,
          date: doc.data().date,
          gameCode: doc.data().gameCode,
          home: doc.data().home,
          score: doc.data().score,
          away: doc.data().away
        })
      })
      setGamesData(gamesData)
    })
  }, [])


  // GETTING VALUES FROM THE FORM
  const handleFormSubmit = (event) => {
    event.preventDefault()

    const home = event.target.homeTeam.value
    const away = event.target.awayTeam.value
    const date = event.target.selectedDate.value
    const homeScore = event.target.homeScore.value
    const awayScore = event.target.awayScore.value
    const gameCode = `${home.split('-')[1]}v${away.split('-')[1]}${date.split('/').join('')}`

    event.target.reset()
    const game = {
      date: date,
      gameCode: gameCode,
      home: home.split('-')[0],
      score: `${homeScore} : ${awayScore}`,
      away: away.split('-')[0]
    }

    db.collection("games").add(game)
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id)

      })
      .catch(error => { console.log("Errro writting document: ", error) })
    handleClose()
  }



  const handleDateChange = (date) => {
    setSelectedDate(date);
  }
  const handleClickOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }
  const handleHomeTeamChange = (event) => {
    setHomeTeam(event.target.value);
  }
  const handleAwayTeamChange = (event) => {
    setAwayTeam(event.target.value);
  }


  return (
    <>
      {/* DIALOG FOR ADDING NEW GAME */}
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add new game</DialogTitle>
        <DialogContent>
          <form onSubmit={(event) => handleFormSubmit(event)} className={classes.root}>
            {/* DATE PICKER */}
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-around">
                <KeyboardDatePicker
                  required
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yy"
                  margin="normal"
                  name='selectedDate'
                  id="date-picker-inline"
                  label="Date of the game"
                  value={selectedDate}
                  onChange={(handleDateChange)}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <Grid container direction='column' >
              {/* HOME TEAM SELECT */}

              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Home Team</InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={homeTeam}
                  name='homeTeam'
                  onChange={handleHomeTeamChange}
                >
                  {selectTeams}
                </Select>
              </FormControl>
              <TextField
                name='homeScore'
                id="standard-number"
                label="Home Score"
                type="number"
                inputProps='min="0" max="100'
                InputLabelProps={{ min: 0, max: 100 }}
                required
              />

              {/* AWAY TEAM SELECT */}
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Away Team</InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={awayTeam}
                  name='awayTeam'
                  onChange={handleAwayTeamChange}
                >
                  {selectTeams}
                </Select>
              </FormControl>
              <TextField
                name='awayScore'
                id="standard-number"
                label="Away Score"
                type="number"
                InputLabelProps={{}}
                required
              />
            </Grid>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type='submit' color="primary" variant='contained'>
                ADD GAME
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* HOME PAGE CONTROLS */}
      <Grid container direction='column' alignItems='center' justify='space-between' style={{ height: "calc(100% - 20px" }}>
        <Grid container justify='center'>
          <CategoryButton icon_src={Player} link='/players'>Players</CategoryButton>
          <CategoryButton icon_src={Team} link='/teams'>Teams</CategoryButton>
          {/* Record  game */}
          <Grid container justify='center'>
            <RecordGameButton icon_src={Pencil} onButtonClick={handleClickOpen}>Record a game</RecordGameButton>
          </Grid>
        </Grid>

        {/* Table of recorded games */}
        <GameTable gamesData={gamesData} />
      </Grid>
    </>
  )
}

export default Home
