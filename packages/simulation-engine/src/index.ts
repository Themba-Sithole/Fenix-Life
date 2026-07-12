/** Save blob envelope v1 — Doc 26 simplified JSON transport for Phase C. */
import { CONTENT_JOB_LISTINGS } from '@fenix/content';
import { mergeContentJobListings } from '@fenix/domain';

mergeContentJobListings(CONTENT_JOB_LISTINGS);

export { SAVE_BLOB_FORMAT_VERSION, SAVE_SCHEMA_VERSION } from './constants.js';
export { addDays, formatGameDate, parseGameDate } from './time-engine.js';
export { runDailyTick } from './tick-orchestrator.js';
export {
  applyDailyEconomyTick,
  applyInflationToMonthlyExpenses,
  economyCycleHeadline,
  inflationHeadline,
} from './economy-engine.js';
export {
  applyDailyCompanyTick,
  companyPerformanceHeadline,
  companyRunwayHeadline,
  companyRunwayMonths,
} from './company-engine.js';
export { applyDailyCareerTick, careerHeadline } from './career-engine.js';
export { applyDailyInvestmentTick, portfolioPerformanceHeadline } from './investment-engine.js';
export {
  runCatchUpTicks,
  estimateCatchUpDays,
  buildWhileYouWereAwaySummary,
  type WhileAwaySummary,
  type WhileAwayBeat,
} from './catch-up.js';
export {
  applyDailyHousingTick,
  applyDailyTransportationTick,
  applyDailyFamilyTick,
  applyMonthlyHousingSettlement,
  applyMonthlyTransportCosts,
  applyMonthlyBillsSettlement,
  computeMonthlyBillBreakdown,
  housingHeadline,
  familyHeadline,
  type MonthlyBillBreakdown,
} from './lifestyle-engine.js';
export {
  applyDailyCivicTick,
  type CivicStatus,
} from './civic-engine.js';
export {
  createSaveBlobV1,
  parseSaveBlobV1,
  serializeSaveBlobV1,
  type SaveBlobV1,
} from './serialize.js';
