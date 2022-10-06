import { executeSyncFormulaFromPackDef } from "@codahq/packs-sdk/dist/development";
import assert = require("assert");
import { pack } from "../pack";

describe("Match sync integration test", () => {
  it("executes the sync formula", async () => {
    const result = await executeSyncFormulaFromPackDef(
      pack,
      "Matches",
      ["honkerino", "NA", 5, undefined, undefined, undefined], // Only retrieve 5 matches to avoid hitting rate limit
      undefined,
      undefined,
      {
        useRealFetcher: true,
        manifestPath: require.resolve("../pack"),
      }
    );
    assert(result.length);
  });
});
