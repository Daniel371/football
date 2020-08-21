import React from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  recordGame: {
    minWidth: 275,
    width: 400,
    margin: 16,
    minHeight: 100,
    backgroundColor: '#2e7d32',
    '&:hover': {
      backgroundColor: '#1b5e20'
    }
  }
})

const RecordGameButton = props => {

  const classes = useStyles()

  return (
    <Button className={classes.recordGame}
      color='primary'
      variant='contained'
      onClick={props.onButtonClick}
      startIcon={<img src={props.icon_src} alt='addingGame' />}>
      {props.children}
    </Button>
  )
}

export default RecordGameButton

