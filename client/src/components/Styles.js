import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
  table: {
    minWidth: 200,
  },
  tableCell: {
    padding: 6
  },
  iconButton: {
    padding: 2
  },
  h1: {
    fontSize: '1.5rem'
  },
  h2: {
    fontSize: '1rem'
  },
  descriptionCell: {
    width: '400',
    cursor: 'pointer',
    "&:hover": {
      color: '#007bff;'
    },
    padding: 6
  },
  backdrop: {
    zIndex: 5000,
    color: '#fff',
  }
});

export default {
  useStyles
}
