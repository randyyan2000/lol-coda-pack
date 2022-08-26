import { executeSyncFormulaFromPackDef } from "@codahq/packs-sdk/dist/development";
import assert = require("assert");
import { pack } from "../pack";

describe("Champions sync integration test", () => {
  it("executes the sync formula", async () => {
    const result = await executeSyncFormulaFromPackDef(pack, "Champions", [], undefined, undefined, {
      useRealFetcher: true,
      manifestPath: require.resolve("../pack"),
    });
    assert(result.length);
  });
});
