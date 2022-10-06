import { executeFormulaFromPackDef } from "@codahq/packs-sdk/dist/development";
import assert = require("assert");
import { pack } from "../pack";

describe("Summoner integration test", () => {
  it("executes Summoner() formula", async () => {
    const result = await executeFormulaFromPackDef(pack, "Summoner", ["honkerino", "NA"], undefined, undefined, {
      useRealFetcher: true,
      manifestPath: require.resolve("../pack"),
    });
    assert(result.SummonerId);
    assert(result.Puuid);
  });
});
