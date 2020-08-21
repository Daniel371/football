import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from './firebase'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@material-ui/core';

const db = firebase.firestore()
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const createData = (docId, date, gameCode, home, score, away) => {
  return { docId, date, gameCode, home, score, away };
}

const removeGameHandler = docId => {
  db.collection("games").doc(docId).delete().then(() => {
    console.log("Document successfully deleted!");
  }).catch(error => {
    console.error("Error removing document: ", error);
  });
}


const GamesTable = props => {
  const classes = useStyles();
  let rows = []

  props.gamesData.forEach(game => {
    rows.push(createData(game.docId, game.date, game.gameCode, game.home, game.score, game.away))
  })

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow >
            <TableCell><b>Date</b></TableCell>
            <TableCell align="right"><b>Game Code</b></TableCell>
            <TableCell align="right"><b>Home Team</b></TableCell>
            <TableCell align="right"><b>Score</b></TableCell>
            <TableCell align="right"><b>Away Team</b></TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.docId}>
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell align="right">{row.gameCode}</TableCell>
              <TableCell align="right">{row.home}</TableCell>
              <TableCell align="right">{row.score}</TableCell>
              <TableCell align="right">{row.away}</TableCell>
              <TableCell align="right">
                <Button variant='outlined'
                  color='secondary'
                  size='small'
                  onClick={() => removeGameHandler(row.docId)}>Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GamesTable