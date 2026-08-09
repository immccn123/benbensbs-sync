import { sql } from "drizzle-orm";
import { ccbUserStat } from "$lib/server/db/schema";

export const CCB_SCORE_K = 1000;

export const ccbScoreExpr = sql`case
	when ${ccbUserStat.total} > 0 then ${CCB_SCORE_K}
		* (1 / (1 + exp(-0.5 * (${ccbUserStat.total} - 20))))
		* exp(-0.3 * ${ccbUserStat.offsetSum}::numeric / ${ccbUserStat.total})
		* (${ccbUserStat.correctSum}::numeric / ${ccbUserStat.total})
	else -1
end`;
