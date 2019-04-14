"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var cheerio = require('cheerio');
var levenshtein = require('fast-levenshtein');
var htmlscraper_1 = require("./htmlscraper");
var HowLongToBeatService = /** @class */ (function () {
    function HowLongToBeatService() {
        this.scraper = new htmlscraper_1.HtmlScraper();
    }
    /**
     * Get HowLongToBeatEntry from game id, by fetching the detail page like https://howlongtobeat.com/game.php?id=6974 and parsing it.
     * @param gameId the hltb internal gameid
     * @return Promise<HowLongToBeatEntry> the promise that, when fullfilled, returns the game
     */
    HowLongToBeatService.prototype.detail = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            var detailPage, entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scraper.detailHtml("" + HowLongToBeatService.DETAIL_URL + gameId)];
                    case 1:
                        detailPage = _a.sent();
                        entry = HowLongToBeatParser.parseDetails(detailPage, gameId);
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    HowLongToBeatService.prototype.search = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var searchPage, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scraper.search(query, HowLongToBeatService.SEARCH_URL)];
                    case 1:
                        searchPage = _a.sent();
                        result = HowLongToBeatParser.parseSearch(searchPage, query);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    HowLongToBeatService.BASE_URL = 'https://howlongtobeat.com/';
    HowLongToBeatService.DETAIL_URL = HowLongToBeatService.BASE_URL + "game.php?id=";
    HowLongToBeatService.SEARCH_URL = HowLongToBeatService.BASE_URL + "search_results.php";
    return HowLongToBeatService;
}());
exports.HowLongToBeatService = HowLongToBeatService;
/**
 * Encapsulates a game detail
 */
var HowLongToBeatEntry = /** @class */ (function () {
    function HowLongToBeatEntry(id, name, imageUrl, timeLabels, gameplayMain, gameplayMainExtra, gameplayCompletionist, similarity) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.timeLabels = timeLabels;
        this.gameplayMain = gameplayMain;
        this.gameplayMainExtra = gameplayMainExtra;
        this.gameplayCompletionist = gameplayCompletionist;
        this.similarity = similarity;
    }
    return HowLongToBeatEntry;
}());
exports.HowLongToBeatEntry = HowLongToBeatEntry;
/**
 * Internal helper class to parse html and create a HowLongToBeatEntry
 */
var HowLongToBeatParser = /** @class */ (function () {
    function HowLongToBeatParser() {
    }
    /**
     * Parses the passed html to generate a HowLongToBeatyEntrys.
     * All the dirty DOM parsing and element traversing is done here.
     * @param html the html as basis for the parsing. taking directly from the response of the hltb detail page
     * @param id the hltb internal id
     * @return HowLongToBeatEntry representing the page
     */
    HowLongToBeatParser.parseDetails = function (html, id) {
        var $ = cheerio.load(html);
        var gameName = '';
        var imageUrl = '';
        var timeLabels = new Array();
        var gameplayMain = 0;
        var gameplayMainExtra = 0;
        var gameplayComplete = 0;
        gameName = $('.profile_header')[0].children[0].data.trim();
        imageUrl = $('.game_image img')[0].attribs.src;
        var liElements = $('.game_times li');
        liElements.each(function () {
            var type = $(this).find('h5').text();
            var time = HowLongToBeatParser.parseTime($(this).find('div').text());
            if (type.startsWith('Main Story') || type.startsWith('Single-Player') || type.startsWith('Solo')) {
                gameplayMain = time;
                timeLabels.push(['gameplayMain', type]);
            }
            else if (type.startsWith('Main + Extra') || type.startsWith('Co-Op')) {
                gameplayMainExtra = time;
                timeLabels.push(['gameplayMainExtra', type]);
            }
            else if (type.startsWith('Completionist') || type.startsWith('Vs.')) {
                gameplayComplete = time;
                timeLabels.push(['gameplayComplete', type]);
            }
        });
        return new HowLongToBeatEntry(id, gameName, imageUrl, timeLabels, gameplayMain, gameplayMainExtra, gameplayComplete, 1);
    };
    /**
     * Parses the passed html to generate an Array of HowLongToBeatyEntrys.
     * All the dirty DOM parsing and element traversing is done here.
     * @param html the html as basis for the parsing. taking directly from the response of the hltb search
     * @param searchTerm the query what was searched, only used to calculate the similarity
     * @return an Array<HowLongToBeatEntry>s
     */
    HowLongToBeatParser.parseSearch = function (html, searchTerm) {
        var results = new Array();
        var $ = cheerio.load(html);
        //check for result page
        if ($('h3').length > 0) {
            var liElements = $('li');
            liElements.each(function () {
                var gameTitleAnchor = $(this).find('a')[0];
                var gameName = gameTitleAnchor.attribs.title;
                var detailId = gameTitleAnchor.attribs.href.substring(gameTitleAnchor.attribs.href.indexOf('?id=') + 4);
                var gameImage = $(gameTitleAnchor).find('img')[0].attribs.src;
                //entry.setPropability(calculateSearchHitPropability(entry.getName(), searchTerm));
                var timeLabels = new Array();
                var main = 0;
                var mainExtra = 0;
                var complete = 0;
                try {
                    $(this).find('.search_list_details_block div.shadow_text').each(function () {
                        var type = $(this).text();
                        if (type.startsWith('Main Story') || type.startsWith('Single-Player') || type.startsWith('Solo')) {
                            var time = HowLongToBeatParser.parseTime($(this).next().text());
                            main = time;
                            timeLabels.push(['gameplayMain', type]);
                        }
                        else if (type.startsWith('Main + Extra') || type.startsWith('Co-Op')) {
                            var time = HowLongToBeatParser.parseTime($(this).next().text());
                            mainExtra = time;
                            timeLabels.push(['gameplayMainExtra', type]);
                        }
                        else if (type.startsWith('Completionist') || type.startsWith('Vs.')) {
                            var time = HowLongToBeatParser.parseTime($(this).next().text());
                            complete = time;
                            timeLabels.push(['gameplayCompletionist', type]);
                        }
                    });
                }
                catch (e) {
                    console.error(e);
                }
                var entry = new HowLongToBeatEntry(detailId, gameName, gameImage, timeLabels, main, mainExtra, complete, HowLongToBeatParser.calcDistancePercentage(gameName, searchTerm));
                results.push(entry);
            });
        }
        return results;
    };
    /**
     * Use this method to distinguish time descriptions for Online
     * from Story mode games.
     *
     * Online Game: Solo, Co-Op & Vs.
     * Story Game: Main Story, Main + Extra, Completionist
     *
     * @param times html snippet that contains the times
     *
     * @return true if is an online game, false for a story game
     */
    HowLongToBeatParser.isOnlineGameTimeData = function (element) {
        if (element.find('.search_list_tidbit_short').length > 0) {
            return true;
        }
        return false;
    };
    /**
       * Utility method used for parsing a given input text (like
       * &quot;44&#189;&quot;) as double (like &quot;44.5&quot;). The input text
       * represents the amount of hours needed to play this game.
       *
       * @param text
       *            representing the hours
       * @return the pares time as double
       */
    HowLongToBeatParser.parseTime = function (text) {
        // '65&#189; Hours/Mins'; '--' if not known
        if (text.startsWith('--')) {
            return 0;
        }
        if (text.indexOf(' - ') > -1) {
            return HowLongToBeatParser.handleRange(text);
        }
        return HowLongToBeatParser.getTime(text);
    };
    /**
     * Parses a range of numbers and creates the average.
       * @param text
       *            like '5 Hours - 12 Hours' or '2½ Hours - 33½ Hours'
       * @return the arithmetic median of the range
       */
    HowLongToBeatParser.handleRange = function (text) {
        var range = text.split(' - ');
        var d = (HowLongToBeatParser.getTime(range[0]) + HowLongToBeatParser.getTime(range[1])) / 2;
        return d;
    };
    /**
   * Parses a string to get a number
     * @param text,
     *            can be '12 Hours' or '5½ Hours' or '50 Mins'
     * @return the ttime, parsed from text
     */
    HowLongToBeatParser.getTime = function (text) {
        //check for Mins, then assume 1 hour at least
        var timeUnit = text.substring(text.indexOf(" ") + 1).trim();
        if (timeUnit === 'Mins') {
            return 1;
        }
        var time = text.substring(0, text.indexOf(" "));
        if (time.indexOf('½') > -1) {
            return 0.5 + parseInt(time.substring(0, text.indexOf('½')));
        }
        return parseInt(time);
    };
    /**
     * Calculates the similarty of two strings based on the levenshtein distance in relation to the string lengths.
     * It is used to see how similar the search term is to the game name. This, of course has only relevance if the search term is really specific and matches the game name as good as possible.
     * When using a proper search index, this would be the ranking/rating and much more sophisticated than this helper.
     * @param text the text to compare to
     * @param term the string of which the similarity is wanted
     */
    HowLongToBeatParser.calcDistancePercentage = function (text, term) {
        var longer = text.toLowerCase().trim();
        var shorter = term.toLowerCase().trim();
        if (longer.length < shorter.length) { // longer should always have
            // greater length
            var temp = longer;
            longer = shorter;
            shorter = temp;
        }
        var longerLength = longer.length;
        if (longerLength == 0) {
            return 1.0;
        }
        var distance = levenshtein.get(longer, shorter);
        return Math.round((longerLength - distance) / longerLength * 100) / 100;
    };
    return HowLongToBeatParser;
}());
exports.HowLongToBeatParser = HowLongToBeatParser;
//# sourceMappingURL=howlongtobeat.js.map