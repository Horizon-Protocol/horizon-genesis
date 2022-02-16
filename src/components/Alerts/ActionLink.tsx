import { SyntheticEvent, useCallback, useMemo } from "react";
import { Link, LinkProps } from "@mui/material";
// import { ArrowRightAlt } from "@mui/icons-material";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { COLOR } from "@utils/theme/constants";

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
  color,
  ...props
}: Props) {
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
      underline='hover'
      onClick={handleClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 10,
        fontWeight: 700,
        color: color == null ? COLOR.safe : color,
        cursor: "pointer",
      }}
      {...linkProps}
      {...props}
    >
      {children} &#8594;
    </Link>
  );
}
