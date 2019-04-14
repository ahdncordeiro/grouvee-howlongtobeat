"use strict";
exports.__esModule = true;
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var htmlscraper_1 = require("../main/htmlscraper");
chai.use(chaiAsPromised);
var expect = chai.expect;
var assert = chai.assert;
describe(' Integration-Testing HtmlScraper', function () {
    describe('Test for gameId (Dark Souls)', function () {
        it('should return the markup source for https://howlongtobeat.com/game.php?id=2224', function () {
            return expect((new htmlscraper_1.HtmlScraper().detailHtml('https://howlongtobeat.com/game.php?id=2224'))).to.be.fulfilled;
        });
    });
});
//# sourceMappingURL=htmlscraper.integration.test.js.map