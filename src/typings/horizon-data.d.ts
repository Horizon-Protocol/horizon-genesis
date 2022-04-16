declare module "@horizon-protocol/data" {
  const graphAPIEndpoints: {
    hzn: string;
    rates: string;
    liquidations: string;
  };

  const pageResults: <T>(params: {
    api: string;
    max?: number;
    query: {
      entity: string;
      selection: {
        orderBy?: string;
        orderDirection?: string;
        first?: number;
        where?: any;
      };
      properties: string[];
    };
  }) => Promise<T>;

  interface Holder {
    address: string;
    block: number;
    timestamp: number;
    date: Date;
    collateral: number | null;
    balanceOf: number | null;
    transferable: number | null;
    initialDebtOwnership: number | null;
    debtEntryAtIndex: number | null;
    mints: number | 0;
    claims: number | 0;
  }

  interface HZN {
    holders(params?: { max?: number }): Promise<Holder[]>;
    total(): Promise<{
      issuers: number;
      snxHolders: number;
    }>;
    totalActiveStakers(): Promise<{ count: number }>;
    aggregateActiveStakers(params?: {
      max: number; // days: default 30
    }): Promise<
      {
        id: string;
        count: string;
      }[]
    >;
  }

  interface LiquidationsParams {
    maxTime?: number;
    minTime?: number;
    account?: string;
    max?: number;
  }
  interface FlaggedAccounts {
    id: string;
    deadline: number; // timestamp
    account: string;
    collateral: number;
    collateralRatio: number;
    liquidatableNonEscrowSNX: number;
  }
  interface Liquidations {
    /**
     *
     *
     * @param {LiquidationsParams} [params]
     * @param {number} [params.maxTime] - default check is 3 days from now
     * @param {number} [params.minTime] - default check is past 27 days
     * @param {number} [params.account] - query a certain account
     * @param {number} [params.max] - 5000
     * @return {*}  {Promise<FlaggedAccounts[]>}
     * @memberof Liquidations
     */
    accountsFlaggedForLiquidation(
      params?: LiquidationsParams
    ): Promise<FlaggedAccounts[]>;
    /**
     *
     *
     * @param {LiquidationsParams} [params]
     * @param {number} [params.maxTime] - now
     * @param {number} [params.minTime] - 30 days ago
     * @param {number} [params.account] - query a certain account
     * @param {number} [params.max] - 5000
     * @return {*}  {Promise<{
     *       id: string;
     *       time: number; // timestamp
     *       account:string;
     *     }>}
     * @memberof liquidations
     */
    accountsRemovedFromLiquidation(params?: LiquidationsParams): Promise<
      {
        id: string;
        time: number;
        account: string;
      }[]
    >;
    /**
     *
     *
     * @param {LiquidationsParams} [params]
     * @param {number} [params.maxTime] - now
     * @param {number} [params.minTime] - 30 days ago
     * @param {number} [params.account] - query a certain account
     * @param {number} [params.max] - 5000
     * @return {*}  {Promise<{
     *       id: string;
     *       time: number;
     *       account: string;
     *       liquidator: string;
     *       amountLiquidated: number;
     *       hznRedeemed: number;
     *     }>}
     * @memberof liquidations
     */
    accountsLiquidated(params?: LiquidationsParams): Promise<
      {
        id: string;
        time: number;
        account: string;
        liquidator: string;
        amountLiquidated: number;
        hznRedeemed: number;
      }[]
    >;

    /**
     *
     *
     * @param {LiquidationsParams} [params]
     * @param {number} [params.maxTime] - now
     * @param {number} [params.minTime] - 30 days ago
     * @param {number} [params.account] - query a certain account
     * @param {number} [params.max] - 5000
     * @return {*}  {Promise<FlaggedAccounts[]>}
     * @memberof Liquidations
     */
    getActiveLiquidations(
      params?: LiquidationsParams
    ): Promise<FlaggedAccounts[]>;
  }

  const hzn: HZN;
  const liquidations: Liquidations;
}
