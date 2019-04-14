"use strict";
exports.__esModule = true;
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var htmlscraper_1 = require("../main/htmlscraper");
chai.use(chaiAsPromised);
var expect = chai.expect;
var assert = chai.assert;
describe('Testing HtmlScraper', function () {
    describe('Test for illegal urls', function () {
        it('should throw an error', function () {
            return assert.isRejected(new htmlscraper_1.HtmlScraper().detailHtml('bla'), Error);
        });
    });
});
//# sourceMappingURL=htmlscraper.test.js.map