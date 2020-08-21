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

import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';

const db = firebase.firestore()

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const createData = (docId, code, firstName, lastName, injury) => {
  let fullName = `${firstName} ${lastName}`
  return { docId, code, fullName, injury };
}

const removePlayerHandler = docId => {
  db.collection("players").doc(docId).delete().then(() => {
    console.log("Document successfully deleted!");
  }).catch(error => {
    console.error("Error removing document: ", error);
  });
}


const PlayersTable = props => {
  const classes = useStyles();
  let rows = []

  props.playersData.forEach(player => {
    rows.push(createData(player.docId, player.code, player.firstName, player.lastName, player.injury))
  })

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow >
            <TableCell><b>Player Code</b></TableCell>
            <TableCell align="right"><b>Full Name</b></TableCell>
            <TableCell align="right"><b>Fit to Play</b></TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.code}>
              <TableCell component="th" scope="row">
                {row.code}
              </TableCell>
              <TableCell align="right">{row.fullName}</TableCell>
              <TableCell align="right">{row.injury ? '' : <CheckOutlinedIcon />}</TableCell>
              <TableCell align="right">
                <Button variant='outlined'
                  color='secondary'
                  size='small'
                  onClick={() => removePlayerHandler(row.docId)}>Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PlayersTable