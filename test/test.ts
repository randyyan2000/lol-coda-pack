import { executeSyncFormulaFromPackDef } from "@codahq/packs-sdk/dist/development";
import { pack } from "../pack";

describe("Champion sync integration test", () => {
  it("executes the sync formuxla", async () => {
    const result = await executeSyncFormulaFromPackDef(
      pack,
      "Champions",
      [],
      undefined,
      undefined,
      {
        useRealFetcher: true,
        manifestPath: require.resolve("../pack"),
      }
    );
    console.log(result.length);
  });
});
