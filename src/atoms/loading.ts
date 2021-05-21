import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

enum Loading {
  All,
  Available,
  Staked,
  Earned,
  Stats,
}

type Param = { name: Loading; loading?: boolean };
const loadingFamily = atomFamily(
  ({ loading = false }: Param) => atom(loading),
  (a, b) => a.name === b.name
);

export const loadingAllAtom = atom(
  (get) => get(loadingFamily({ name: Loading.All })),
  (get, set, val: boolean) => set(loadingFamily({ name: Loading.All }), val)
);

export const loadingAvailableAtom = atom(
  (get) => get(loadingFamily({ name: Loading.Available })),
  (get, set, val: boolean) =>
    set(loadingFamily({ name: Loading.Available }), val)
);
