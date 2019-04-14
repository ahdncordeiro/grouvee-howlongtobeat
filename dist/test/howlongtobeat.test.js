"use strict";
exports.__esModule = true;
var chai = require("chai");
var fs = require("fs");
var howlongtobeat_1 = require("../main/howlongtobeat");
var expect = chai.expect;
var assert = chai.assert;
describe('Testing HowLongToBeatParser', function () {
    describe('Test for calcDistancePercentage()', function () {
        it('dark souls and dark souls should have 100% similarity', function () {
            var perc = howlongtobeat_1.HowLongToBeatParser.calcDistancePercentage('Dark Souls', 'Dark Souls');
            assert.strictEqual(perc, 1);
        });
        it('dark souls and dark soul should have 90% similarity', function () {
            var perc = howlongtobeat_1.HowLongToBeatParser.calcDistancePercentage('Dark Souls', 'Dark Soul');
            assert.strictEqual(perc, 0.9);
        });
    });
    describe('Test for parseSearch, if this succeeds, but live installment fails, howlongtobeat.com may have changed their html', function () {
        it('should parse the search result (static, from search of Persona 4)', function () {
            var html = fs.readFileSync('src/test/resources/search.html', 'utf-8');
            var results = howlongtobeat_1.HowLongToBeatParser.parseSearch(html, 'Persona 4');
            assert.isTrue(results.length === 5);
            assert.strictEqual(results[0].name, 'Persona 4: Golden');
            assert.strictEqual(results[0].similarity, 0.53);
            assert.strictEqual(results[0].imageUrl, 'https://howlongtobeat.com/gameimages/persona_4_golden_large.jpg');
            //
            assert.strictEqual(results[2].gameplayCompletionist, 18.5);
            //special case with range
            assert.strictEqual(results[3].gameplayMain, 18);
            assert.strictEqual(results[3].gameplayMainExtra, 20.5);
            assert.strictEqual(results[4].gameplayMain, 10);
            assert.strictEqual(results[4].gameplayMainExtra, 16);
        });
    });
    describe('Test for parseDetail, if this succeeds, but live installment fails, howlongtobeat.com may have changed their html', function () {
        it('should parse the details page  (static, from id=3978 - God of War 3)', function () {
            var html = fs.readFileSync('src/test/resources/detail_gow3.html', 'utf-8');
            var detail = howlongtobeat_1.HowLongToBeatParser.parseDetails(html, '3978');
            assert.isDefined(detail);
            assert.strictEqual(detail.name, 'God of War III');
            assert.strictEqual(detail.similarity, 1);
            assert.strictEqual(detail.gameplayCompletionist, 17);
            assert.strictEqual(detail.gameplayMain, 10);
            assert.strictEqual(detail.gameplayMainExtra, 10.5);
        });
    });
    describe('Test for parsing minutes correctly from detail page. Example is Street Fighter which claims to take 50 Mins to beat (main)', function () {
        it('should parse the main time correctly  (static, from id=9224 - Street Fighter, takes 50 Minutes)', function () {
            var html = fs.readFileSync('src/test/resources/detail_street_fighter.html', 'utf-8');
            var detail = howlongtobeat_1.HowLongToBeatParser.parseDetails(html, '9224');
            assert.isDefined(detail);
            assert.strictEqual(detail.name, 'Street Fighter');
            assert.strictEqual(detail.similarity, 1);
            //should be one, since 1 hours is the minimum
            assert.strictEqual(detail.gameplayMain, 1);
            assert.strictEqual(detail.gameplayMainExtra, 1);
            assert.strictEqual(detail.gameplayCompletionist, 3.5);
        });
    });
    describe('Test for parsing minutes correctly from search list. Example is Street Fighter which claims to take 50 Mins to beat (main)', function () {
        it('should parse the main time correctly from search (static, from search "Street Fighter")', function () {
            var html = fs.readFileSync('src/test/resources/search_street_fighter.html', 'utf-8');
            var search = howlongtobeat_1.HowLongToBeatParser.parseSearch(html, 'Street Fighter');
            assert.isDefined(search);
            assert.strictEqual(search.length, 18);
            var streetFighter = search[0];
            assert.strictEqual(streetFighter.name, 'Street Fighter');
            assert.strictEqual(streetFighter.gameplayMain, 1);
            assert.strictEqual(streetFighter.gameplayMainExtra, 1);
            assert.strictEqual(streetFighter.gameplayCompletionist, 3.5);
            var streetFighterAlpha = search[15];
            assert.strictEqual(streetFighterAlpha.name, "Street Fighter Alpha: Warriors' Dreams");
            assert.strictEqual(streetFighterAlpha.gameplayMain, 1);
            assert.strictEqual(streetFighterAlpha.gameplayMainExtra, 2.5);
            assert.strictEqual(streetFighterAlpha.gameplayCompletionist, 3.5);
        });
    });
    describe('Test for parsing minutes correctly from detail page. Example is Guns of Icarus Online which does not have Co-Op time but it has Vs.', function () {
        it('should parse the Co-Op and Vs. time correctly  (static, from id=4216 - Street Fighter, takes 0 Minutes and 20.5 for Vs.)', function () {
            var html = fs.readFileSync('src/test/resources/detail_guns_of_icarus_online.html', 'utf-8');
            var detail = howlongtobeat_1.HowLongToBeatParser.parseDetails(html, '4216');
            assert.isDefined(detail);
            assert.strictEqual(detail.name, 'Guns of Icarus Online');
            assert.strictEqual(detail.similarity, 1);
            //should be one, since 1 hours is the minimum
            assert.strictEqual(detail.gameplayMain, 0);
            assert.strictEqual(detail.gameplayMainExtra, 0);
            assert.strictEqual(detail.gameplayCompletionist, 20.5);
        });
    });
    describe('Test for parsing minutes & Time Label correctly from search list. The examples are Grand Theft Auto V and Grand Theft Auto Online which has different time labels', function () {
        it('should parse the 3 times correctly and the according time labels from search (static, from search "Grand Theft Auto")', function () {
            var html = fs.readFileSync('src/test/resources/search_grand_theft_auto.html', 'utf-8');
            var search = howlongtobeat_1.HowLongToBeatParser.parseSearch(html, 'Grand Theft Auto');
            assert.isDefined(search);
            assert.strictEqual(search.length, 18);
            var gtaV = search[2];
            assert.strictEqual(gtaV.name, 'Grand Theft Auto V');
            assert.strictEqual(gtaV.gameplayMain, 31);
            assert.strictEqual(gtaV.gameplayMainExtra, 46.5);
            assert.strictEqual(gtaV.gameplayCompletionist, 78.5);
            var gtaVTimeLabels = [['gameplayMain', 'Main Story'], ['gameplayMainExtra', 'Main + Extra'], ['gameplayCompletionist', 'Completionist']];
            expect(gtaV.timeLabels).to.eql(gtaVTimeLabels);
            var gtaOnline = search[15];
            assert.strictEqual(gtaOnline.name, 'Grand Theft Auto Online');
            assert.strictEqual(gtaOnline.gameplayMain, 32.5);
            assert.strictEqual(gtaOnline.gameplayMainExtra, 28);
            assert.strictEqual(gtaOnline.gameplayCompletionist, 67);
            var gtaOnlineTimeLabels = [['gameplayMain', 'Solo'], ['gameplayMainExtra', 'Co-Op'], ['gameplayCompletionist', 'Vs.']];
            expect(gtaOnline.timeLabels).to.eql(gtaOnlineTimeLabels);
        });
    });
});
//# sourceMappingURL=howlongtobeat.test.js.map