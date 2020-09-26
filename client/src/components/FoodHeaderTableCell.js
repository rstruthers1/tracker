import {withStyles} from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";

const FoodHeaderTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#00548F',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },

}))(TableCell);

export default FoodHeaderTableCell;
