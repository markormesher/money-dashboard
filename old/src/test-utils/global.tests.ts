import * as chai from "chai";
import * as chaiString from "chai-string";

chai.use(chaiString);
chai.should();

const testGlobals = {
  init: (): void => {
    // do nothing
  },
};

export { testGlobals };
