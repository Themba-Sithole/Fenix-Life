import { useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import {
  formatMoney,
  getTrendingQuotes,
  portfolioDayChangeCents,
  portfolioGainCents,
  portfolioGainPercent,
  portfolioValueCents,
  stockDayChangeCents,
  stockDayChangePercent,
} from "@fenix/domain";
import { HistoryChart, ToolShell } from "../components/shell";

export default function StockMarket() {
  const { world, applyAction, formattedDate } = useSimulation();
  const [actionError, setActionError] = useState<string | null>(null);
  const [busySymbol, setBusySymbol] = useState<string | null>(null);

  async function handleTrade(symbol: string, kind: "BUY_STOCK" | "SELL_STOCK", shares: number) {
    setActionError(null);
    setBusySymbol(symbol);
    try {
      await applyAction({ kind, symbol, shares });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Trade failed.");
    } finally {
      setBusySymbol(null);
    }
  }

  const portfolioView = useMemo(() => {
    if (!world) {
      return null;
    }

    const { portfolio } = world;
    const currency = world.origin.currency;
    const quotesBySymbol = new Map(portfolio.quotes.map((quote) => [quote.symbol, quote]));
    const portfolioValue = portfolioValueCents(portfolio.holdings, portfolio.quotes);
    const dayChange = portfolioDayChangeCents(portfolio.holdings, portfolio.quotes);
    const dayChangePct =
      portfolioValue > 0 ? Number(((dayChange / portfolioValue) * 100).toFixed(2)) : 0;

    const holdings = portfolio.holdings
      .map((holding) => {
        const quote = quotesBySymbol.get(holding.symbol);
        if (!quote) {
          return null;
        }

        const valueCents = holding.shares * quote.priceCents;
        const changeCents = stockDayChangeCents(quote);
        const changePercent = stockDayChangePercent(quote);

        return {
          symbol: holding.symbol,
          name: quote.name,
          logo: quote.logo,
          price: quote.priceCents / 100,
          change: changeCents / 100,
          changePercent,
          shares: holding.shares,
          value: valueCents / 100,
        };
      })
      .filter((holding) => holding !== null);

    const portfolioData = portfolio.history.map((point, index) => ({
      date: index === portfolio.history.length - 1 ? "Now" : `D-${portfolio.history.length - index - 1}`,
      value: point.valueCents / 100,
    }));

    const trending = getTrendingQuotes(portfolio.quotes).map((quote) => ({
      symbol: quote.symbol,
      name: quote.name,
      change: stockDayChangePercent(quote),
      logo: quote.logo,
    }));

    return {
      currency,
      portfolioValue,
      dayChange,
      dayChangePct,
      totalGain: portfolioGainCents(portfolio),
      gainPercent: portfolioGainPercent(portfolio),
      holdingsCount: portfolio.holdings.length,
      dividendsYtd: portfolio.dividendsYtdCents,
      holdings,
      portfolioData,
      trending,
    };
  }, [world]);

  const simulationGate = useSimulationGate("Loading portfolio…");
  if (simulationGate) return simulationGate;
  if (!world || !portfolioView) return null;

  const {
    currency,
    portfolioValue,
    dayChange,
    dayChangePct,
    totalGain,
    gainPercent,
    holdingsCount,
    dividendsYtd,
    holdings,
    portfolioData,
    trending,
  } = portfolioView;

  return (
    <ToolShell
      institution="Fenix Brokerage"
      subtitle={`${world.player.displayName} · Tech index ${world.economy.techSectorIndex.toFixed(1)}`}
      lastUpdated={formattedDate ?? undefined}
      metrics={[
        { label: "Portfolio", value: formatMoney(portfolioValue, currency) },
        { label: "Today", value: formatMoney(dayChange, currency) },
        { label: "Holdings", value: String(holdingsCount) },
      ]}
    >
      <div>
        {actionError ? (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{actionError}</p>
        ) : null}
        <section className="mb-6 grid gap-5 border-y border-border py-5 text-sm md:grid-cols-4">
              <div>
                <div className="text-sm text-gray-300 mb-2">Portfolio Value</div>
                <div className="text-4xl mb-2">{formatMoney(portfolioValue, currency)}</div>
                <div className={`flex items-center gap-2 ${dayChange >= 0 ? "text-accent" : "text-red-300"}`}>
                  {dayChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm">
                    {dayChange >= 0 ? "+" : ""}
                    {formatMoney(dayChange, currency)} today ({dayChangePct >= 0 ? "+" : ""}
                    {dayChangePct}%)
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Total Gain</div>
                <div className={`text-3xl ${totalGain >= 0 ? "text-accent" : "text-red-300"}`}>
                  {totalGain >= 0 ? "+" : ""}
                  {formatMoney(totalGain, currency)}
                </div>
                <div className="text-sm text-gray-400">
                  {gainPercent >= 0 ? "+" : ""}
                  {gainPercent}% all time
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Holdings</div>
                <div className="text-3xl">{holdingsCount}</div>
                <div className="text-sm text-gray-400">Stocks</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Dividends (YTD)</div>
                <div className="text-3xl text-fenix-gold">{formatMoney(dividendsYtd, currency)}</div>
                <div className="text-sm text-gray-400">Accrued in simulation</div>
              </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          <HistoryChart
            title="Portfolio performance"
            description="Recorded portfolio snapshots from the simulation."
            data={portfolioData.map((point) => ({ label: point.date, value: point.value }))}
            emptyTitle="No portfolio history"
            emptyDescription="Advance time to record portfolio snapshots."
            valueFormatter={(value) => formatMoney(Math.round(value * 100), currency)}
          />

          <section className="rounded-lg border border-border bg-surface-1 p-5">
            <h2 className="mb-4 font-semibold text-secondary">Trending Stocks</h2>
              <ul className="divide-y divide-border">
                {trending.map((stock) => (
                  <li
                    key={stock.symbol}
                    className="py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{stock.logo}</div>
                        <div>
                          <div className="text-secondary">{stock.symbol}</div>
                          <div className="text-xs text-gray-500">{stock.name}</div>
                        </div>
                      </div>
                      <Badge className="bg-accent/20 text-accent border-accent/30">
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change}%
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-3 bg-fenix-gold hover:bg-fenix-gold/80 text-white"
                      disabled={busySymbol === stock.symbol}
                      onClick={() => handleTrade(stock.symbol, "BUY_STOCK", 1)}
                    >
                      Buy 1 Share
                    </Button>
                  </li>
                ))}
              </ul>
          </section>

          <section className="lg:col-span-3 rounded-lg border border-border bg-surface-1 p-5">
            <h2 className="mb-4 font-semibold text-secondary">Your Holdings</h2>
              {holdings.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">
                  No holdings yet. Buy shares from the market to start building your portfolio.
                </p>
              ) : (
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {holdings.map((stock) => (
                  <li key={stock.symbol} className="rounded-lg border border-border p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{stock.logo}</div>
                          <div>
                            <div className="text-lg text-secondary">{stock.symbol}</div>
                            <div className="text-xs text-gray-500">{stock.name}</div>
                          </div>
                        </div>
                        {stock.change >= 0 ? (
                          <TrendingUp className="w-5 h-5 text-accent" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Price</span>
                          <span className="text-secondary">{formatMoney(stock.price * 100, currency)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Change</span>
                          <span className={stock.change >= 0 ? "text-accent" : "text-red-400"}>
                            {stock.change >= 0 ? "+" : ""}
                            {formatMoney(stock.change * 100, currency)} ({stock.changePercent}%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                          <span className="text-sm text-gray-600">Your Value</span>
                          <span className="text-secondary">{formatMoney(stock.value * 100, currency)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Shares</span>
                          <span className="text-gray-500">{stock.shares}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="flex-1 bg-accent hover:bg-accent/80 text-white"
                          disabled={busySymbol === stock.symbol}
                          onClick={() => handleTrade(stock.symbol, "BUY_STOCK", 1)}
                        >
                          Buy
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          disabled={busySymbol === stock.symbol || stock.shares < 1}
                          onClick={() => handleTrade(stock.symbol, "SELL_STOCK", 1)}
                        >
                          Sell
                        </Button>
                      </div>
                  </li>
                ))}
              </ul>
              )}
          </section>
        </div>
      </div>
    </ToolShell>
  );
}
