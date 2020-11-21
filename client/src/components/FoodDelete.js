import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FoodDelete(props) {
  let open = props.open;
  let handleCloseOk = props.handleCloseOk;
  let handleCloseCancel = props.handleCloseCancel;
  let food = props.food;
  
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCloseCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           Are you sure you want to delete food {food ? food.description: ""}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOk} color="primary">
            Yes
          </Button>
          <Button onClick={handleCloseCancel} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
