import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function useIsEarnPage() {
  const { pathname } = useLocation();

  const isEarnPage = useMemo(() => pathname === "/earn", [pathname]);

  return isEarnPage;
}
