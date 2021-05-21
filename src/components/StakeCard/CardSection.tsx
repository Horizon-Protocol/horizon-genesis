import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { CARD_CONTENT } from "@utils/theme/constants";

const CardSection = withStyles({
  root: {
    ...CARD_CONTENT,
  },
})(Box);

export default CardSection;
