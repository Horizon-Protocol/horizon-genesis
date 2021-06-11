import { SyntheticEvent, useCallback, useMemo } from "react";
import { Link, LinkProps } from "@material-ui/core";
// import { ArrowRightAlt } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { COLOR } from "@utils/theme/constants";

const useStyles = makeStyles({
  actionLink: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: 10,
    fontWeight: 700,
    color: COLOR.safe,
    cursor: "pointer",
  },
});

// const ArrowIcon = withStyles({
//   root: {
//     fontSize: 16,
//     fontWeight: 700,
//     color: COLOR.safe,
//   },
// })(ArrowRightAlt);

type Props = {
  to?: string;
  onClick?: () => void;
} & Omit<RouterLinkProps, "to" | "onClick"> &
  Omit<LinkProps, "href" | "onClick">;

export default function ActionLink({
  to,
  href,
  onClick,
  children,
  ...props
}: Props) {
  const classes = useStyles();

  const handleClick = useCallback(
    (e: SyntheticEvent) => {
      if (to === "#") {
        e.preventDefault();
      }
      onClick?.();
    },
    [to, onClick]
  );

  const linkProps = useMemo(() => {
    if (to) {
      return { to, component: RouterLink };
    }
    return { href };
  }, [href, to]);

  return (
    <Link
      {...linkProps}
      onClick={handleClick}
      classes={{ root: classes.actionLink }}
      {...props}
    >
      {children} &#8594;
    </Link>
  );
}