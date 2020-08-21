import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from './firebase'
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Popover,
  IconButton,
  Typography
} from '@material-ui/core';


const db = firebase.firestore()

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  typography: {
    padding: theme.spacing(2),
  }
}));

const createData = (docId, code, teamName, venue, location) => {
  return { docId, code, teamName, venue, location };
}


const TeamsTable = props => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  let rows = []

  props.teamsData.forEach(team => {
    rows.push(createData(team.docId, team.code, team.teamName, team.venue, team.location))
  })

  const removeTeamHandler = docId => {
    db.collection("teams").doc(docId).delete().then(() => {
      console.log("Document successfully deleted!");
    }).catch(error => {
      console.error("Error removing document: ", error);
    });
  }


  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow >
            <TableCell><b>Team Code</b></TableCell>
            <TableCell align="right"><b>Team Name</b></TableCell>
            <TableCell align="right"><b>Venue</b></TableCell>
            <TableCell align="right"><b>Location</b></TableCell>
            <TableCell align="right"><b>Players</b></TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.code}>
              <TableCell component="th" scope="row">
                {row.code}
              </TableCell>
              <TableCell align="right">{row.teamName}</TableCell>
              <TableCell align="right">{row.venue}</TableCell>
              <TableCell align="right">{row.location}</TableCell>
              <TableCell align="right">
                <IconButton aria-label="players" aria-describedby={id} onClick={handleClick}>
                  <PermIdentityIcon size='small' />
                </IconButton>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <Typography className={classes.typography}>The content of the Popover.</Typography>
                </Popover>
              </TableCell>
              <TableCell align="right">
                <Button variant='outlined'
                  color='secondary'
                  size='small'
                  onClick={() => removeTeamHandler(row.docId)}>Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TeamsTable