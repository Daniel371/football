import React from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  categoryButton: {
    minWidth: 275,
    minHeight: 100,
    margin: 16,
    canGrow: 1,
  }
})

const CategoryButton = props => {

  const classes = useStyles()

  return (
    <Button className={classes.categoryButton}
      href={props.link}
      color='primary'
      variant='contained'
      startIcon={<img src={props.icon_src} alt='category' />}>
      {props.children}
    </Button>
  )
}

export default CategoryButton

