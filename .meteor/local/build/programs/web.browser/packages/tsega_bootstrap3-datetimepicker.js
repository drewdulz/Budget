//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var moment = Package['momentjs:moment'].moment;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/tsega:bootstrap3-datetimepicker/lib/js/bootstrap3-datetimepicker.js                                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/*                                                                                                                   // 1
//! version : 3.1.3                                                                                                  // 2
=========================================================                                                            // 3
bootstrap-datetimepicker.js                                                                                          // 4
https://github.com/Eonasdan/bootstrap-datetimepicker                                                                 // 5
=========================================================                                                            // 6
The MIT License (MIT)                                                                                                // 7
                                                                                                                     // 8
Copyright (c) 2014 Jonathan Peterson                                                                                 // 9
                                                                                                                     // 10
Permission is hereby granted, free of charge, to any person obtaining a copy                                         // 11
of this software and associated documentation files (the "Software"), to deal                                        // 12
in the Software without restriction, including without limitation the rights                                         // 13
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell                                            // 14
copies of the Software, and to permit persons to whom the Software is                                                // 15
furnished to do so, subject to the following conditions:                                                             // 16
                                                                                                                     // 17
The above copyright notice and this permission notice shall be included in                                           // 18
all copies or substantial portions of the Software.                                                                  // 19
                                                                                                                     // 20
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR                                           // 21
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,                                             // 22
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE                                          // 23
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER                                               // 24
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,                                        // 25
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN                                            // 26
THE SOFTWARE.                                                                                                        // 27
*/                                                                                                                   // 28
                                                                                                                     // 29
;(function (root, factory) {                                                                                         // 30
    'use strict';                                                                                                    // 31
    if (typeof define === 'function' && define.amd) {                                                                // 32
        // AMD is used - Register as an anonymous module.                                                            // 33
        define(['jquery', 'moment'], factory);                                                                       // 34
    } else if (typeof exports === 'object') {                                                                        // 35
        factory(require('jquery'), require('moment'));                                                               // 36
    }                                                                                                                // 37
    else {                                                                                                           // 38
        // Neither AMD or CommonJS used. Use global variables.                                                       // 39
        if (!jQuery) {                                                                                               // 40
            throw new Error('bootstrap-datetimepicker requires jQuery to be loaded first');                          // 41
        }                                                                                                            // 42
        if (!moment) {                                                                                               // 43
            throw new Error('bootstrap-datetimepicker requires moment.js to be loaded first');                       // 44
        }                                                                                                            // 45
        factory(root.jQuery, moment);                                                                                // 46
    }                                                                                                                // 47
}(this, function ($, moment) {                                                                                       // 48
    'use strict';                                                                                                    // 49
    if (typeof moment === 'undefined') {                                                                             // 50
        throw new Error('momentjs is required');                                                                     // 51
    }                                                                                                                // 52
                                                                                                                     // 53
    var dpgId = 0,                                                                                                   // 54
                                                                                                                     // 55
    DateTimePicker = function (element, options) {                                                                   // 56
        var defaults = $.fn.datetimepicker.defaults,                                                                 // 57
                                                                                                                     // 58
            icons = {                                                                                                // 59
                time: 'glyphicon glyphicon-time',                                                                    // 60
                date: 'glyphicon glyphicon-calendar',                                                                // 61
                up: 'glyphicon glyphicon-chevron-up',                                                                // 62
                down: 'glyphicon glyphicon-chevron-down'                                                             // 63
            },                                                                                                       // 64
                                                                                                                     // 65
            picker = this,                                                                                           // 66
            errored = false,                                                                                         // 67
            dDate,                                                                                                   // 68
                                                                                                                     // 69
        init = function () {                                                                                         // 70
            var icon = false, localeData, rInterval;                                                                 // 71
            picker.options = $.extend({}, defaults, options);                                                        // 72
            picker.options.icons = $.extend({}, icons, picker.options.icons);                                        // 73
                                                                                                                     // 74
            picker.element = $(element);                                                                             // 75
                                                                                                                     // 76
            dataToOptions();                                                                                         // 77
                                                                                                                     // 78
            if (!(picker.options.pickTime || picker.options.pickDate)) {                                             // 79
                throw new Error('Must choose at least one picker');                                                  // 80
            }                                                                                                        // 81
                                                                                                                     // 82
            picker.id = dpgId++;                                                                                     // 83
            moment.locale(picker.options.language);                                                                  // 84
            picker.date = moment();                                                                                  // 85
            picker.unset = false;                                                                                    // 86
            picker.isInput = picker.element.is('input');                                                             // 87
            picker.component = false;                                                                                // 88
                                                                                                                     // 89
            if (picker.element.hasClass('input-group')) {                                                            // 90
                if (picker.element.find('.datepickerbutton').size() === 0) {//in case there is more then one 'input-group-addon' Issue #48
                    picker.component = picker.element.find('[class^="input-group-"]');                               // 92
                }                                                                                                    // 93
                else {                                                                                               // 94
                    picker.component = picker.element.find('.datepickerbutton');                                     // 95
                }                                                                                                    // 96
            }                                                                                                        // 97
            picker.format = picker.options.format;                                                                   // 98
                                                                                                                     // 99
            localeData = moment().localeData();                                                                      // 100
                                                                                                                     // 101
            if (!picker.format) {                                                                                    // 102
                picker.format = (picker.options.pickDate ? localeData.longDateFormat('L') : '');                     // 103
                if (picker.options.pickDate && picker.options.pickTime) {                                            // 104
                    picker.format += ' ';                                                                            // 105
                }                                                                                                    // 106
                picker.format += (picker.options.pickTime ? localeData.longDateFormat('LT') : '');                   // 107
                if (picker.options.useSeconds) {                                                                     // 108
                    if (localeData.longDateFormat('LT').indexOf(' A') !== -1) {                                      // 109
                        picker.format = picker.format.split(' A')[0] + ':ss A';                                      // 110
                    }                                                                                                // 111
                    else {                                                                                           // 112
                        picker.format += ':ss';                                                                      // 113
                    }                                                                                                // 114
                }                                                                                                    // 115
            }                                                                                                        // 116
            picker.use24hours = (picker.format.toLowerCase().indexOf('a') < 0 && picker.format.indexOf('h') < 0);    // 117
                                                                                                                     // 118
            if (picker.component) {                                                                                  // 119
                icon = picker.component.find('span');                                                                // 120
            }                                                                                                        // 121
                                                                                                                     // 122
            if (picker.options.pickTime) {                                                                           // 123
                if (icon) {                                                                                          // 124
                    icon.addClass(picker.options.icons.time);                                                        // 125
                }                                                                                                    // 126
            }                                                                                                        // 127
            if (picker.options.pickDate) {                                                                           // 128
                if (icon) {                                                                                          // 129
                    icon.removeClass(picker.options.icons.time);                                                     // 130
                    icon.addClass(picker.options.icons.date);                                                        // 131
                }                                                                                                    // 132
            }                                                                                                        // 133
                                                                                                                     // 134
            picker.options.widgetParent =                                                                            // 135
                typeof picker.options.widgetParent === 'string' && picker.options.widgetParent ||                    // 136
                picker.element.parents().filter(function () {                                                        // 137
                    return 'scroll' === $(this).css('overflow-y');                                                   // 138
                }).get(0) ||                                                                                         // 139
                'body';                                                                                              // 140
                                                                                                                     // 141
            picker.widget = $(getTemplate()).appendTo(picker.options.widgetParent);                                  // 142
                                                                                                                     // 143
            picker.minViewMode = picker.options.minViewMode || 0;                                                    // 144
            if (typeof picker.minViewMode === 'string') {                                                            // 145
                switch (picker.minViewMode) {                                                                        // 146
                    case 'months':                                                                                   // 147
                        picker.minViewMode = 1;                                                                      // 148
                        break;                                                                                       // 149
                    case 'years':                                                                                    // 150
                        picker.minViewMode = 2;                                                                      // 151
                        break;                                                                                       // 152
                    default:                                                                                         // 153
                        picker.minViewMode = 0;                                                                      // 154
                        break;                                                                                       // 155
                }                                                                                                    // 156
            }                                                                                                        // 157
            picker.viewMode = picker.options.viewMode || 0;                                                          // 158
            if (typeof picker.viewMode === 'string') {                                                               // 159
                switch (picker.viewMode) {                                                                           // 160
                    case 'months':                                                                                   // 161
                        picker.viewMode = 1;                                                                         // 162
                        break;                                                                                       // 163
                    case 'years':                                                                                    // 164
                        picker.viewMode = 2;                                                                         // 165
                        break;                                                                                       // 166
                    default:                                                                                         // 167
                        picker.viewMode = 0;                                                                         // 168
                        break;                                                                                       // 169
                }                                                                                                    // 170
            }                                                                                                        // 171
                                                                                                                     // 172
            picker.viewMode = Math.max(picker.viewMode, picker.minViewMode);                                         // 173
                                                                                                                     // 174
            picker.options.disabledDates = indexGivenDates(picker.options.disabledDates);                            // 175
            picker.options.enabledDates = indexGivenDates(picker.options.enabledDates);                              // 176
                                                                                                                     // 177
            picker.startViewMode = picker.viewMode;                                                                  // 178
            picker.setMinDate(picker.options.minDate);                                                               // 179
            picker.setMaxDate(picker.options.maxDate);                                                               // 180
            fillDow();                                                                                               // 181
            fillMonths();                                                                                            // 182
            fillHours();                                                                                             // 183
            fillMinutes();                                                                                           // 184
            fillSeconds();                                                                                           // 185
            update();                                                                                                // 186
            showMode();                                                                                              // 187
            if (!getPickerInput().prop('disabled')) {                                                                // 188
                attachDatePickerEvents();                                                                            // 189
            }                                                                                                        // 190
            if (picker.options.defaultDate !== '' && getPickerInput().val() === '') {                                // 191
                picker.setValue(picker.options.defaultDate);                                                         // 192
            }                                                                                                        // 193
            if (picker.options.minuteStepping !== 1) {                                                               // 194
                rInterval = picker.options.minuteStepping;                                                           // 195
                picker.date.minutes((Math.round(picker.date.minutes() / rInterval) * rInterval) % 60).seconds(0);    // 196
            }                                                                                                        // 197
        },                                                                                                           // 198
                                                                                                                     // 199
        getPickerInput = function () {                                                                               // 200
            var input;                                                                                               // 201
                                                                                                                     // 202
            if (picker.isInput) {                                                                                    // 203
                return picker.element;                                                                               // 204
            }                                                                                                        // 205
            input = picker.element.find('.datepickerinput');                                                         // 206
            if (input.size() === 0) {                                                                                // 207
                input = picker.element.find('input');                                                                // 208
            }                                                                                                        // 209
            else if (!input.is('input')) {                                                                           // 210
                throw new Error('CSS class "datepickerinput" cannot be applied to non input element');               // 211
            }                                                                                                        // 212
            return input;                                                                                            // 213
        },                                                                                                           // 214
                                                                                                                     // 215
        dataToOptions = function () {                                                                                // 216
            var eData;                                                                                               // 217
            if (picker.element.is('input')) {                                                                        // 218
                eData = picker.element.data();                                                                       // 219
            }                                                                                                        // 220
            else {                                                                                                   // 221
                eData = picker.element.find('input').data();                                                         // 222
            }                                                                                                        // 223
            if (eData.dateFormat !== undefined) {                                                                    // 224
                picker.options.format = eData.dateFormat;                                                            // 225
            }                                                                                                        // 226
            if (eData.datePickdate !== undefined) {                                                                  // 227
                picker.options.pickDate = eData.datePickdate;                                                        // 228
            }                                                                                                        // 229
            if (eData.datePicktime !== undefined) {                                                                  // 230
                picker.options.pickTime = eData.datePicktime;                                                        // 231
            }                                                                                                        // 232
            if (eData.dateUseminutes !== undefined) {                                                                // 233
                picker.options.useMinutes = eData.dateUseminutes;                                                    // 234
            }                                                                                                        // 235
            if (eData.dateUseseconds !== undefined) {                                                                // 236
                picker.options.useSeconds = eData.dateUseseconds;                                                    // 237
            }                                                                                                        // 238
            if (eData.dateUsecurrent !== undefined) {                                                                // 239
                picker.options.useCurrent = eData.dateUsecurrent;                                                    // 240
            }                                                                                                        // 241
            if (eData.calendarWeeks !== undefined) {                                                                 // 242
                picker.options.calendarWeeks = eData.calendarWeeks;                                                  // 243
            }                                                                                                        // 244
            if (eData.dateMinutestepping !== undefined) {                                                            // 245
                picker.options.minuteStepping = eData.dateMinutestepping;                                            // 246
            }                                                                                                        // 247
            if (eData.dateMindate !== undefined) {                                                                   // 248
                picker.options.minDate = eData.dateMindate;                                                          // 249
            }                                                                                                        // 250
            if (eData.dateMaxdate !== undefined) {                                                                   // 251
                picker.options.maxDate = eData.dateMaxdate;                                                          // 252
            }                                                                                                        // 253
            if (eData.dateShowtoday !== undefined) {                                                                 // 254
                picker.options.showToday = eData.dateShowtoday;                                                      // 255
            }                                                                                                        // 256
            if (eData.dateCollapse !== undefined) {                                                                  // 257
                picker.options.collapse = eData.dateCollapse;                                                        // 258
            }                                                                                                        // 259
            if (eData.dateLanguage !== undefined) {                                                                  // 260
                picker.options.language = eData.dateLanguage;                                                        // 261
            }                                                                                                        // 262
            if (eData.dateDefaultdate !== undefined) {                                                               // 263
                picker.options.defaultDate = eData.dateDefaultdate;                                                  // 264
            }                                                                                                        // 265
            if (eData.dateDisableddates !== undefined) {                                                             // 266
                picker.options.disabledDates = eData.dateDisableddates;                                              // 267
            }                                                                                                        // 268
            if (eData.dateEnableddates !== undefined) {                                                              // 269
                picker.options.enabledDates = eData.dateEnableddates;                                                // 270
            }                                                                                                        // 271
            if (eData.dateIcons !== undefined) {                                                                     // 272
                picker.options.icons = eData.dateIcons;                                                              // 273
            }                                                                                                        // 274
            if (eData.dateUsestrict !== undefined) {                                                                 // 275
                picker.options.useStrict = eData.dateUsestrict;                                                      // 276
            }                                                                                                        // 277
            if (eData.dateDirection !== undefined) {                                                                 // 278
                picker.options.direction = eData.dateDirection;                                                      // 279
            }                                                                                                        // 280
            if (eData.dateSidebyside !== undefined) {                                                                // 281
                picker.options.sideBySide = eData.dateSidebyside;                                                    // 282
            }                                                                                                        // 283
            if (eData.dateDaysofweekdisabled !== undefined) {                                                        // 284
                picker.options.daysOfWeekDisabled = eData.dateDaysofweekdisabled;                                    // 285
            }                                                                                                        // 286
        },                                                                                                           // 287
                                                                                                                     // 288
        place = function () {                                                                                        // 289
            var position = 'absolute',                                                                               // 290
                offset = picker.component ? picker.component.offset() : picker.element.offset(),                     // 291
                $window = $(window),                                                                                 // 292
                placePosition;                                                                                       // 293
                                                                                                                     // 294
            picker.width = picker.component ? picker.component.outerWidth() : picker.element.outerWidth();           // 295
            offset.top = offset.top + picker.element.outerHeight();                                                  // 296
                                                                                                                     // 297
            if (picker.options.direction === 'up') {                                                                 // 298
                placePosition = 'top';                                                                               // 299
            } else if (picker.options.direction === 'bottom') {                                                      // 300
                placePosition = 'bottom';                                                                            // 301
            } else if (picker.options.direction === 'auto') {                                                        // 302
                if (offset.top + picker.widget.height() > $window.height() + $window.scrollTop() && picker.widget.height() + picker.element.outerHeight() < offset.top) {
                    placePosition = 'top';                                                                           // 304
                } else {                                                                                             // 305
                    placePosition = 'bottom';                                                                        // 306
                }                                                                                                    // 307
            }                                                                                                        // 308
            if (placePosition === 'top') {                                                                           // 309
                offset.bottom = $window.height() - offset.top + picker.element.outerHeight() + 3;                    // 310
                picker.widget.addClass('top').removeClass('bottom');                                                 // 311
            } else {                                                                                                 // 312
                offset.top += 1;                                                                                     // 313
                picker.widget.addClass('bottom').removeClass('top');                                                 // 314
            }                                                                                                        // 315
                                                                                                                     // 316
            if (picker.options.width !== undefined) {                                                                // 317
                picker.widget.width(picker.options.width);                                                           // 318
            }                                                                                                        // 319
                                                                                                                     // 320
            if (picker.options.orientation === 'left') {                                                             // 321
                picker.widget.addClass('left-oriented');                                                             // 322
                offset.left = offset.left - picker.widget.width() + 20;                                              // 323
            }                                                                                                        // 324
                                                                                                                     // 325
            if (isInFixed()) {                                                                                       // 326
                position = 'fixed';                                                                                  // 327
                offset.top -= $window.scrollTop();                                                                   // 328
                offset.left -= $window.scrollLeft();                                                                 // 329
            }                                                                                                        // 330
                                                                                                                     // 331
            if ($window.width() < offset.left + picker.widget.outerWidth()) {                                        // 332
                offset.right = $window.width() - offset.left - picker.width;                                         // 333
                offset.left = 'auto';                                                                                // 334
                picker.widget.addClass('pull-right');                                                                // 335
            } else {                                                                                                 // 336
                offset.right = 'auto';                                                                               // 337
                picker.widget.removeClass('pull-right');                                                             // 338
            }                                                                                                        // 339
                                                                                                                     // 340
            if (placePosition === 'top') {                                                                           // 341
                picker.widget.css({                                                                                  // 342
                    position: position,                                                                              // 343
                    bottom: offset.bottom,                                                                           // 344
                    top: 'auto',                                                                                     // 345
                    left: offset.left,                                                                               // 346
                    right: offset.right                                                                              // 347
                });                                                                                                  // 348
            } else {                                                                                                 // 349
                picker.widget.css({                                                                                  // 350
                    position: position,                                                                              // 351
                    top: offset.top,                                                                                 // 352
                    bottom: 'auto',                                                                                  // 353
                    left: offset.left,                                                                               // 354
                    right: offset.right                                                                              // 355
                });                                                                                                  // 356
            }                                                                                                        // 357
        },                                                                                                           // 358
                                                                                                                     // 359
        notifyChange = function (oldDate, eventType) {                                                               // 360
            if (moment(picker.date).isSame(moment(oldDate)) && !errored) {                                           // 361
                return;                                                                                              // 362
            }                                                                                                        // 363
            errored = false;                                                                                         // 364
            picker.element.trigger({                                                                                 // 365
                type: 'dp.change',                                                                                   // 366
                date: moment(picker.date),                                                                           // 367
                oldDate: moment(oldDate)                                                                             // 368
            });                                                                                                      // 369
                                                                                                                     // 370
            if (eventType !== 'change') {                                                                            // 371
                picker.element.change();                                                                             // 372
            }                                                                                                        // 373
        },                                                                                                           // 374
                                                                                                                     // 375
        notifyError = function (date) {                                                                              // 376
            errored = true;                                                                                          // 377
            picker.element.trigger({                                                                                 // 378
                type: 'dp.error',                                                                                    // 379
                date: moment(date, picker.format, picker.options.useStrict)                                          // 380
            });                                                                                                      // 381
        },                                                                                                           // 382
                                                                                                                     // 383
        update = function (newDate) {                                                                                // 384
            moment.locale(picker.options.language);                                                                  // 385
            var dateStr = newDate;                                                                                   // 386
            if (!dateStr) {                                                                                          // 387
                dateStr = getPickerInput().val();                                                                    // 388
                if (dateStr) {                                                                                       // 389
                    picker.date = moment(dateStr, picker.format, picker.options.useStrict);                          // 390
                }                                                                                                    // 391
                if (!picker.date) {                                                                                  // 392
                    picker.date = moment();                                                                          // 393
                }                                                                                                    // 394
            }                                                                                                        // 395
            picker.viewDate = moment(picker.date).startOf('month');                                                  // 396
            fillDate();                                                                                              // 397
            fillTime();                                                                                              // 398
        },                                                                                                           // 399
                                                                                                                     // 400
        fillDow = function () {                                                                                      // 401
            moment.locale(picker.options.language);                                                                  // 402
            var html = $('<tr>'), weekdaysMin = moment.weekdaysMin(), i;                                             // 403
            if (picker.options.calendarWeeks === true) {                                                             // 404
                html.append('<th class="cw">#</th>');                                                                // 405
            }                                                                                                        // 406
            if (moment().localeData()._week.dow === 0) { // starts on Sunday                                         // 407
                for (i = 0; i < 7; i++) {                                                                            // 408
                    html.append('<th class="dow">' + weekdaysMin[i] + '</th>');                                      // 409
                }                                                                                                    // 410
            } else {                                                                                                 // 411
                for (i = 1; i < 8; i++) {                                                                            // 412
                    if (i === 7) {                                                                                   // 413
                        html.append('<th class="dow">' + weekdaysMin[0] + '</th>');                                  // 414
                    } else {                                                                                         // 415
                        html.append('<th class="dow">' + weekdaysMin[i] + '</th>');                                  // 416
                    }                                                                                                // 417
                }                                                                                                    // 418
            }                                                                                                        // 419
            picker.widget.find('.datepicker-days thead').append(html);                                               // 420
        },                                                                                                           // 421
                                                                                                                     // 422
        fillMonths = function () {                                                                                   // 423
            moment.locale(picker.options.language);                                                                  // 424
            var html = '', i, monthsShort = moment.monthsShort();                                                    // 425
            for (i = 0; i < 12; i++) {                                                                               // 426
                html += '<span class="month">' + monthsShort[i] + '</span>';                                         // 427
            }                                                                                                        // 428
            picker.widget.find('.datepicker-months td').append(html);                                                // 429
        },                                                                                                           // 430
                                                                                                                     // 431
        fillDate = function () {                                                                                     // 432
            if (!picker.options.pickDate) {                                                                          // 433
                return;                                                                                              // 434
            }                                                                                                        // 435
            moment.locale(picker.options.language);                                                                  // 436
            var year = picker.viewDate.year(),                                                                       // 437
                month = picker.viewDate.month(),                                                                     // 438
                startYear = picker.options.minDate.year(),                                                           // 439
                startMonth = picker.options.minDate.month(),                                                         // 440
                endYear = picker.options.maxDate.year(),                                                             // 441
                endMonth = picker.options.maxDate.month(),                                                           // 442
                currentDate,                                                                                         // 443
                prevMonth, nextMonth, html = [], row, clsName, i, days, yearCont, currentYear, months = moment.months();
                                                                                                                     // 445
            picker.widget.find('.datepicker-days').find('.disabled').removeClass('disabled');                        // 446
            picker.widget.find('.datepicker-months').find('.disabled').removeClass('disabled');                      // 447
            picker.widget.find('.datepicker-years').find('.disabled').removeClass('disabled');                       // 448
                                                                                                                     // 449
            picker.widget.find('.datepicker-days th:eq(1)').text(                                                    // 450
                months[month] + ' ' + year);                                                                         // 451
                                                                                                                     // 452
            prevMonth = moment(picker.viewDate, picker.format, picker.options.useStrict).subtract(1, 'months');      // 453
            days = prevMonth.daysInMonth();                                                                          // 454
            prevMonth.date(days).startOf('week');                                                                    // 455
            if ((year === startYear && month <= startMonth) || year < startYear) {                                   // 456
                picker.widget.find('.datepicker-days th:eq(0)').addClass('disabled');                                // 457
            }                                                                                                        // 458
            if ((year === endYear && month >= endMonth) || year > endYear) {                                         // 459
                picker.widget.find('.datepicker-days th:eq(2)').addClass('disabled');                                // 460
            }                                                                                                        // 461
                                                                                                                     // 462
            nextMonth = moment(prevMonth).add(42, 'd');                                                              // 463
            while (prevMonth.isBefore(nextMonth)) {                                                                  // 464
                if (prevMonth.weekday() === moment().startOf('week').weekday()) {                                    // 465
                    row = $('<tr>');                                                                                 // 466
                    html.push(row);                                                                                  // 467
                    if (picker.options.calendarWeeks === true) {                                                     // 468
                        row.append('<td class="cw">' + prevMonth.week() + '</td>');                                  // 469
                    }                                                                                                // 470
                }                                                                                                    // 471
                clsName = '';                                                                                        // 472
                if (prevMonth.year() < year || (prevMonth.year() === year && prevMonth.month() < month)) {           // 473
                    clsName += ' old';                                                                               // 474
                } else if (prevMonth.year() > year || (prevMonth.year() === year && prevMonth.month() > month)) {    // 475
                    clsName += ' new';                                                                               // 476
                }                                                                                                    // 477
                if (prevMonth.isSame(moment({y: picker.date.year(), M: picker.date.month(), d: picker.date.date()}))) {
                    clsName += ' active';                                                                            // 479
                }                                                                                                    // 480
                if (isInDisableDates(prevMonth, 'day') || !isInEnableDates(prevMonth)) {                             // 481
                    clsName += ' disabled';                                                                          // 482
                }                                                                                                    // 483
                if (picker.options.showToday === true) {                                                             // 484
                    if (prevMonth.isSame(moment(), 'day')) {                                                         // 485
                        clsName += ' today';                                                                         // 486
                    }                                                                                                // 487
                }                                                                                                    // 488
                if (picker.options.daysOfWeekDisabled) {                                                             // 489
                    for (i = 0; i < picker.options.daysOfWeekDisabled.length; i++) {                                 // 490
                        if (prevMonth.day() === picker.options.daysOfWeekDisabled[i]) {                              // 491
                            clsName += ' disabled';                                                                  // 492
                            break;                                                                                   // 493
                        }                                                                                            // 494
                    }                                                                                                // 495
                }                                                                                                    // 496
                row.append('<td class="day' + clsName + '">' + prevMonth.date() + '</td>');                          // 497
                                                                                                                     // 498
                currentDate = prevMonth.date();                                                                      // 499
                prevMonth.add(1, 'd');                                                                               // 500
                                                                                                                     // 501
                if (currentDate === prevMonth.date()) {                                                              // 502
                    prevMonth.add(1, 'd');                                                                           // 503
                }                                                                                                    // 504
            }                                                                                                        // 505
            picker.widget.find('.datepicker-days tbody').empty().append(html);                                       // 506
            currentYear = picker.date.year();                                                                        // 507
            months = picker.widget.find('.datepicker-months').find('th:eq(1)').text(year).end().find('span').removeClass('active');
            if (currentYear === year) {                                                                              // 509
                months.eq(picker.date.month()).addClass('active');                                                   // 510
            }                                                                                                        // 511
            if (year - 1 < startYear) {                                                                              // 512
                picker.widget.find('.datepicker-months th:eq(0)').addClass('disabled');                              // 513
            }                                                                                                        // 514
            if (year + 1 > endYear) {                                                                                // 515
                picker.widget.find('.datepicker-months th:eq(2)').addClass('disabled');                              // 516
            }                                                                                                        // 517
            for (i = 0; i < 12; i++) {                                                                               // 518
                if ((year === startYear && startMonth > i) || (year < startYear)) {                                  // 519
                    $(months[i]).addClass('disabled');                                                               // 520
                } else if ((year === endYear && endMonth < i) || (year > endYear)) {                                 // 521
                    $(months[i]).addClass('disabled');                                                               // 522
                }                                                                                                    // 523
            }                                                                                                        // 524
                                                                                                                     // 525
            html = '';                                                                                               // 526
            year = parseInt(year / 10, 10) * 10;                                                                     // 527
            yearCont = picker.widget.find('.datepicker-years').find(                                                 // 528
                'th:eq(1)').text(year + '-' + (year + 9)).parents('table').find('td');                               // 529
            picker.widget.find('.datepicker-years').find('th').removeClass('disabled');                              // 530
            if (startYear > year) {                                                                                  // 531
                picker.widget.find('.datepicker-years').find('th:eq(0)').addClass('disabled');                       // 532
            }                                                                                                        // 533
            if (endYear < year + 9) {                                                                                // 534
                picker.widget.find('.datepicker-years').find('th:eq(2)').addClass('disabled');                       // 535
            }                                                                                                        // 536
            year -= 1;                                                                                               // 537
            for (i = -1; i < 11; i++) {                                                                              // 538
                html += '<span class="year' + (i === -1 || i === 10 ? ' old' : '') + (currentYear === year ? ' active' : '') + ((year < startYear || year > endYear) ? ' disabled' : '') + '">' + year + '</span>';
                year += 1;                                                                                           // 540
            }                                                                                                        // 541
            yearCont.html(html);                                                                                     // 542
        },                                                                                                           // 543
                                                                                                                     // 544
        fillHours = function () {                                                                                    // 545
            moment.locale(picker.options.language);                                                                  // 546
            var table = picker.widget.find('.timepicker .timepicker-hours table'), html = '', current, i, j;         // 547
            table.parent().hide();                                                                                   // 548
            if (picker.use24hours) {                                                                                 // 549
                current = 0;                                                                                         // 550
                for (i = 0; i < 6; i += 1) {                                                                         // 551
                    html += '<tr>';                                                                                  // 552
                    for (j = 0; j < 4; j += 1) {                                                                     // 553
                        html += '<td class="hour">' + padLeft(current.toString()) + '</td>';                         // 554
                        current++;                                                                                   // 555
                    }                                                                                                // 556
                    html += '</tr>';                                                                                 // 557
                }                                                                                                    // 558
            }                                                                                                        // 559
            else {                                                                                                   // 560
                current = 1;                                                                                         // 561
                for (i = 0; i < 3; i += 1) {                                                                         // 562
                    html += '<tr>';                                                                                  // 563
                    for (j = 0; j < 4; j += 1) {                                                                     // 564
                        html += '<td class="hour">' + padLeft(current.toString()) + '</td>';                         // 565
                        current++;                                                                                   // 566
                    }                                                                                                // 567
                    html += '</tr>';                                                                                 // 568
                }                                                                                                    // 569
            }                                                                                                        // 570
            table.html(html);                                                                                        // 571
        },                                                                                                           // 572
                                                                                                                     // 573
        fillMinutes = function () {                                                                                  // 574
            var table = picker.widget.find('.timepicker .timepicker-minutes table'), html = '', current = 0, i, j, step = picker.options.minuteStepping;
            table.parent().hide();                                                                                   // 576
            if (step === 1)  {                                                                                       // 577
                step = 5;                                                                                            // 578
            }                                                                                                        // 579
            for (i = 0; i < Math.ceil(60 / step / 4) ; i++) {                                                        // 580
                html += '<tr>';                                                                                      // 581
                for (j = 0; j < 4; j += 1) {                                                                         // 582
                    if (current < 60) {                                                                              // 583
                        html += '<td class="minute">' + padLeft(current.toString()) + '</td>';                       // 584
                        current += step;                                                                             // 585
                    } else {                                                                                         // 586
                        html += '<td></td>';                                                                         // 587
                    }                                                                                                // 588
                }                                                                                                    // 589
                html += '</tr>';                                                                                     // 590
            }                                                                                                        // 591
            table.html(html);                                                                                        // 592
        },                                                                                                           // 593
                                                                                                                     // 594
        fillSeconds = function () {                                                                                  // 595
            var table = picker.widget.find('.timepicker .timepicker-seconds table'), html = '', current = 0, i, j;   // 596
            table.parent().hide();                                                                                   // 597
            for (i = 0; i < 3; i++) {                                                                                // 598
                html += '<tr>';                                                                                      // 599
                for (j = 0; j < 4; j += 1) {                                                                         // 600
                    html += '<td class="second">' + padLeft(current.toString()) + '</td>';                           // 601
                    current += 5;                                                                                    // 602
                }                                                                                                    // 603
                html += '</tr>';                                                                                     // 604
            }                                                                                                        // 605
            table.html(html);                                                                                        // 606
        },                                                                                                           // 607
                                                                                                                     // 608
        fillTime = function () {                                                                                     // 609
            if (!picker.date) {                                                                                      // 610
                return;                                                                                              // 611
            }                                                                                                        // 612
            var timeComponents = picker.widget.find('.timepicker span[data-time-component]'),                        // 613
                hour = picker.date.hours(),                                                                          // 614
                period = picker.date.format('A');                                                                    // 615
            if (!picker.use24hours) {                                                                                // 616
                if (hour === 0) {                                                                                    // 617
                    hour = 12;                                                                                       // 618
                } else if (hour !== 12) {                                                                            // 619
                    hour = hour % 12;                                                                                // 620
                }                                                                                                    // 621
                picker.widget.find('.timepicker [data-action=togglePeriod]').text(period);                           // 622
            }                                                                                                        // 623
            timeComponents.filter('[data-time-component=hours]').text(padLeft(hour));                                // 624
            timeComponents.filter('[data-time-component=minutes]').text(padLeft(picker.date.minutes()));             // 625
            timeComponents.filter('[data-time-component=seconds]').text(padLeft(picker.date.second()));              // 626
        },                                                                                                           // 627
                                                                                                                     // 628
        click = function (e) {                                                                                       // 629
            e.stopPropagation();                                                                                     // 630
            e.preventDefault();                                                                                      // 631
            picker.unset = false;                                                                                    // 632
            var target = $(e.target).closest('span, td, th'), month, year, step, day, oldDate = moment(picker.date); // 633
            if (target.length === 1) {                                                                               // 634
                if (!target.is('.disabled')) {                                                                       // 635
                    switch (target[0].nodeName.toLowerCase()) {                                                      // 636
                        case 'th':                                                                                   // 637
                            switch (target[0].className) {                                                           // 638
                                case 'picker-switch':                                                                // 639
                                    showMode(1);                                                                     // 640
                                    break;                                                                           // 641
                                case 'prev':                                                                         // 642
                                case 'next':                                                                         // 643
                                    step = dpGlobal.modes[picker.viewMode].navStep;                                  // 644
                                    if (target[0].className === 'prev') {                                            // 645
                                        step = step * -1;                                                            // 646
                                    }                                                                                // 647
                                    picker.viewDate.add(step, dpGlobal.modes[picker.viewMode].navFnc);               // 648
                                    fillDate();                                                                      // 649
                                    break;                                                                           // 650
                            }                                                                                        // 651
                            break;                                                                                   // 652
                        case 'span':                                                                                 // 653
                            if (target.is('.month')) {                                                               // 654
                                month = target.parent().find('span').index(target);                                  // 655
                                picker.viewDate.month(month);                                                        // 656
                            } else {                                                                                 // 657
                                year = parseInt(target.text(), 10) || 0;                                             // 658
                                picker.viewDate.year(year);                                                          // 659
                            }                                                                                        // 660
                            if (picker.viewMode === picker.minViewMode) {                                            // 661
                                picker.date = moment({                                                               // 662
                                    y: picker.viewDate.year(),                                                       // 663
                                    M: picker.viewDate.month(),                                                      // 664
                                    d: picker.viewDate.date(),                                                       // 665
                                    h: picker.date.hours(),                                                          // 666
                                    m: picker.date.minutes(),                                                        // 667
                                    s: picker.date.seconds()                                                         // 668
                                });                                                                                  // 669
                                set();                                                                               // 670
                                notifyChange(oldDate, e.type);                                                       // 671
                            }                                                                                        // 672
                            showMode(-1);                                                                            // 673
                            fillDate();                                                                              // 674
                            break;                                                                                   // 675
                        case 'td':                                                                                   // 676
                            if (target.is('.day')) {                                                                 // 677
                                day = parseInt(target.text(), 10) || 1;                                              // 678
                                month = picker.viewDate.month();                                                     // 679
                                year = picker.viewDate.year();                                                       // 680
                                if (target.is('.old')) {                                                             // 681
                                    if (month === 0) {                                                               // 682
                                        month = 11;                                                                  // 683
                                        year -= 1;                                                                   // 684
                                    } else {                                                                         // 685
                                        month -= 1;                                                                  // 686
                                    }                                                                                // 687
                                } else if (target.is('.new')) {                                                      // 688
                                    if (month === 11) {                                                              // 689
                                        month = 0;                                                                   // 690
                                        year += 1;                                                                   // 691
                                    } else {                                                                         // 692
                                        month += 1;                                                                  // 693
                                    }                                                                                // 694
                                }                                                                                    // 695
                                picker.date = moment({                                                               // 696
                                    y: year,                                                                         // 697
                                    M: month,                                                                        // 698
                                    d: day,                                                                          // 699
                                    h: picker.date.hours(),                                                          // 700
                                    m: picker.date.minutes(),                                                        // 701
                                    s: picker.date.seconds()                                                         // 702
                                }                                                                                    // 703
                                );                                                                                   // 704
                                picker.viewDate = moment({                                                           // 705
                                    y: year, M: month, d: Math.min(28, day)                                          // 706
                                });                                                                                  // 707
                                fillDate();                                                                          // 708
                                set();                                                                               // 709
                                notifyChange(oldDate, e.type);                                                       // 710
                            }                                                                                        // 711
                            break;                                                                                   // 712
                    }                                                                                                // 713
                }                                                                                                    // 714
            }                                                                                                        // 715
        },                                                                                                           // 716
                                                                                                                     // 717
        actions = {                                                                                                  // 718
            incrementHours: function () {                                                                            // 719
                checkDate('add', 'hours', 1);                                                                        // 720
            },                                                                                                       // 721
                                                                                                                     // 722
            incrementMinutes: function () {                                                                          // 723
                checkDate('add', 'minutes', picker.options.minuteStepping);                                          // 724
            },                                                                                                       // 725
                                                                                                                     // 726
            incrementSeconds: function () {                                                                          // 727
                checkDate('add', 'seconds', 1);                                                                      // 728
            },                                                                                                       // 729
                                                                                                                     // 730
            decrementHours: function () {                                                                            // 731
                checkDate('subtract', 'hours', 1);                                                                   // 732
            },                                                                                                       // 733
                                                                                                                     // 734
            decrementMinutes: function () {                                                                          // 735
                checkDate('subtract', 'minutes', picker.options.minuteStepping);                                     // 736
            },                                                                                                       // 737
                                                                                                                     // 738
            decrementSeconds: function () {                                                                          // 739
                checkDate('subtract', 'seconds', 1);                                                                 // 740
            },                                                                                                       // 741
                                                                                                                     // 742
            togglePeriod: function () {                                                                              // 743
                var hour = picker.date.hours();                                                                      // 744
                if (hour >= 12) {                                                                                    // 745
                    hour -= 12;                                                                                      // 746
                } else {                                                                                             // 747
                    hour += 12;                                                                                      // 748
                }                                                                                                    // 749
                picker.date.hours(hour);                                                                             // 750
            },                                                                                                       // 751
                                                                                                                     // 752
            showPicker: function () {                                                                                // 753
                picker.widget.find('.timepicker > div:not(.timepicker-picker)').hide();                              // 754
                picker.widget.find('.timepicker .timepicker-picker').show();                                         // 755
            },                                                                                                       // 756
                                                                                                                     // 757
            showHours: function () {                                                                                 // 758
                picker.widget.find('.timepicker .timepicker-picker').hide();                                         // 759
                picker.widget.find('.timepicker .timepicker-hours').show();                                          // 760
            },                                                                                                       // 761
                                                                                                                     // 762
            showMinutes: function () {                                                                               // 763
                picker.widget.find('.timepicker .timepicker-picker').hide();                                         // 764
                picker.widget.find('.timepicker .timepicker-minutes').show();                                        // 765
            },                                                                                                       // 766
                                                                                                                     // 767
            showSeconds: function () {                                                                               // 768
                picker.widget.find('.timepicker .timepicker-picker').hide();                                         // 769
                picker.widget.find('.timepicker .timepicker-seconds').show();                                        // 770
            },                                                                                                       // 771
                                                                                                                     // 772
            selectHour: function (e) {                                                                               // 773
                var hour = parseInt($(e.target).text(), 10);                                                         // 774
                if (!picker.use24hours) {                                                                            // 775
                    if (picker.date.hours() >= 12) {                                                                 // 776
                        if (hour !== 12) {                                                                           // 777
                            hour += 12;                                                                              // 778
                        }                                                                                            // 779
                    } else {                                                                                         // 780
                        if (hour === 12) {                                                                           // 781
                            hour = 0;                                                                                // 782
                        }                                                                                            // 783
                    }                                                                                                // 784
                }                                                                                                    // 785
                picker.date.hours(hour);                                                                             // 786
                actions.showPicker.call(picker);                                                                     // 787
            },                                                                                                       // 788
                                                                                                                     // 789
            selectMinute: function (e) {                                                                             // 790
                picker.date.minutes(parseInt($(e.target).text(), 10));                                               // 791
                actions.showPicker.call(picker);                                                                     // 792
            },                                                                                                       // 793
                                                                                                                     // 794
            selectSecond: function (e) {                                                                             // 795
                picker.date.seconds(parseInt($(e.target).text(), 10));                                               // 796
                actions.showPicker.call(picker);                                                                     // 797
            }                                                                                                        // 798
        },                                                                                                           // 799
                                                                                                                     // 800
        doAction = function (e) {                                                                                    // 801
            var oldDate = moment(picker.date),                                                                       // 802
                action = $(e.currentTarget).data('action'),                                                          // 803
                rv = actions[action].apply(picker, arguments);                                                       // 804
            stopEvent(e);                                                                                            // 805
            if (!picker.date) {                                                                                      // 806
                picker.date = moment({y: 1970});                                                                     // 807
            }                                                                                                        // 808
            set();                                                                                                   // 809
            fillTime();                                                                                              // 810
            notifyChange(oldDate, e.type);                                                                           // 811
            return rv;                                                                                               // 812
        },                                                                                                           // 813
                                                                                                                     // 814
        stopEvent = function (e) {                                                                                   // 815
            e.stopPropagation();                                                                                     // 816
            e.preventDefault();                                                                                      // 817
        },                                                                                                           // 818
                                                                                                                     // 819
        keydown = function (e) {                                                                                     // 820
            if (e.keyCode === 27) { // allow escape to hide picker                                                   // 821
                picker.hide();                                                                                       // 822
            }                                                                                                        // 823
        },                                                                                                           // 824
                                                                                                                     // 825
        change = function (e) {                                                                                      // 826
            moment.locale(picker.options.language);                                                                  // 827
            var input = $(e.target), oldDate = moment(picker.date), newDate = moment(input.val(), picker.format, picker.options.useStrict);
            if (newDate.isValid() && !isInDisableDates(newDate) && isInEnableDates(newDate)) {                       // 829
                update();                                                                                            // 830
                picker.setValue(newDate);                                                                            // 831
                notifyChange(oldDate, e.type);                                                                       // 832
                set();                                                                                               // 833
            }                                                                                                        // 834
            else {                                                                                                   // 835
                picker.viewDate = oldDate;                                                                           // 836
                picker.unset = true;                                                                                 // 837
                notifyChange(oldDate, e.type);                                                                       // 838
                notifyError(newDate);                                                                                // 839
            }                                                                                                        // 840
        },                                                                                                           // 841
                                                                                                                     // 842
        showMode = function (dir) {                                                                                  // 843
            if (dir) {                                                                                               // 844
                picker.viewMode = Math.max(picker.minViewMode, Math.min(2, picker.viewMode + dir));                  // 845
            }                                                                                                        // 846
            picker.widget.find('.datepicker > div').hide().filter('.datepicker-' + dpGlobal.modes[picker.viewMode].clsName).show();
        },                                                                                                           // 848
                                                                                                                     // 849
        attachDatePickerEvents = function () {                                                                       // 850
            var $this, $parent, expanded, closed, collapseData;                                                      // 851
            picker.widget.on('click', '.datepicker *', $.proxy(click, this)); // this handles date picker clicks     // 852
            picker.widget.on('click', '[data-action]', $.proxy(doAction, this)); // this handles time picker clicks  // 853
            picker.widget.on('mousedown', $.proxy(stopEvent, this));                                                 // 854
            picker.element.on('keydown', $.proxy(keydown, this));                                                    // 855
            if (picker.options.pickDate && picker.options.pickTime) {                                                // 856
                picker.widget.on('click.togglePicker', '.accordion-toggle', function (e) {                           // 857
                    e.stopPropagation();                                                                             // 858
                    $this = $(this);                                                                                 // 859
                    $parent = $this.closest('ul');                                                                   // 860
                    expanded = $parent.find('.in');                                                                  // 861
                    closed = $parent.find('.collapse:not(.in)');                                                     // 862
                                                                                                                     // 863
                    if (expanded && expanded.length) {                                                               // 864
                        collapseData = expanded.data('collapse');                                                    // 865
                        if (collapseData && collapseData.transitioning) {                                            // 866
                            return;                                                                                  // 867
                        }                                                                                            // 868
                        expanded.collapse('hide');                                                                   // 869
                        closed.collapse('show');                                                                     // 870
                        $this.find('span').toggleClass(picker.options.icons.time + ' ' + picker.options.icons.date); // 871
                        if (picker.component) {                                                                      // 872
                            picker.component.find('span').toggleClass(picker.options.icons.time + ' ' + picker.options.icons.date);
                        }                                                                                            // 874
                    }                                                                                                // 875
                });                                                                                                  // 876
            }                                                                                                        // 877
            if (picker.isInput) {                                                                                    // 878
                picker.element.on({                                                                                  // 879
                    'click': $.proxy(picker.show, this),                                                             // 880
                    'focus': $.proxy(picker.show, this),                                                             // 881
                    'change': $.proxy(change, this),                                                                 // 882
                    'blur': $.proxy(picker.hide, this)                                                               // 883
                });                                                                                                  // 884
            } else {                                                                                                 // 885
                picker.element.on({                                                                                  // 886
                    'change': $.proxy(change, this)                                                                  // 887
                }, 'input');                                                                                         // 888
                if (picker.component) {                                                                              // 889
                    picker.component.on('click', $.proxy(picker.show, this));                                        // 890
                    picker.component.on('mousedown', $.proxy(stopEvent, this));                                      // 891
                } else {                                                                                             // 892
                    picker.element.on('click', $.proxy(picker.show, this));                                          // 893
                }                                                                                                    // 894
            }                                                                                                        // 895
        },                                                                                                           // 896
                                                                                                                     // 897
        attachDatePickerGlobalEvents = function () {                                                                 // 898
            $(window).on(                                                                                            // 899
                'resize.datetimepicker' + picker.id, $.proxy(place, this));                                          // 900
            if (!picker.isInput) {                                                                                   // 901
                $(document).on(                                                                                      // 902
                    'mousedown.datetimepicker' + picker.id, $.proxy(picker.hide, this));                             // 903
            }                                                                                                        // 904
        },                                                                                                           // 905
                                                                                                                     // 906
        detachDatePickerEvents = function () {                                                                       // 907
            picker.widget.off('click', '.datepicker *', picker.click);                                               // 908
            picker.widget.off('click', '[data-action]');                                                             // 909
            picker.widget.off('mousedown', picker.stopEvent);                                                        // 910
            if (picker.options.pickDate && picker.options.pickTime) {                                                // 911
                picker.widget.off('click.togglePicker');                                                             // 912
            }                                                                                                        // 913
            if (picker.isInput) {                                                                                    // 914
                picker.element.off({                                                                                 // 915
                    'focus': picker.show,                                                                            // 916
                    'change': change,                                                                                // 917
                    'click': picker.show,                                                                            // 918
                    'blur' : picker.hide                                                                             // 919
                });                                                                                                  // 920
            } else {                                                                                                 // 921
                picker.element.off({                                                                                 // 922
                    'change': change                                                                                 // 923
                }, 'input');                                                                                         // 924
                if (picker.component) {                                                                              // 925
                    picker.component.off('click', picker.show);                                                      // 926
                    picker.component.off('mousedown', picker.stopEvent);                                             // 927
                } else {                                                                                             // 928
                    picker.element.off('click', picker.show);                                                        // 929
                }                                                                                                    // 930
            }                                                                                                        // 931
        },                                                                                                           // 932
                                                                                                                     // 933
        detachDatePickerGlobalEvents = function () {                                                                 // 934
            $(window).off('resize.datetimepicker' + picker.id);                                                      // 935
            if (!picker.isInput) {                                                                                   // 936
                $(document).off('mousedown.datetimepicker' + picker.id);                                             // 937
            }                                                                                                        // 938
        },                                                                                                           // 939
                                                                                                                     // 940
        isInFixed = function () {                                                                                    // 941
            if (picker.element) {                                                                                    // 942
                var parents = picker.element.parents(), inFixed = false, i;                                          // 943
                for (i = 0; i < parents.length; i++) {                                                               // 944
                    if ($(parents[i]).css('position') === 'fixed') {                                                 // 945
                        inFixed = true;                                                                              // 946
                        break;                                                                                       // 947
                    }                                                                                                // 948
                }                                                                                                    // 949
                return inFixed;                                                                                      // 950
            } else {                                                                                                 // 951
                return false;                                                                                        // 952
            }                                                                                                        // 953
        },                                                                                                           // 954
                                                                                                                     // 955
        set = function () {                                                                                          // 956
            moment.locale(picker.options.language);                                                                  // 957
            var formatted = '';                                                                                      // 958
            if (!picker.unset) {                                                                                     // 959
                formatted = moment(picker.date).format(picker.format);                                               // 960
            }                                                                                                        // 961
            getPickerInput().val(formatted);                                                                         // 962
            picker.element.data('date', formatted);                                                                  // 963
            if (!picker.options.pickTime) {                                                                          // 964
                picker.hide();                                                                                       // 965
            }                                                                                                        // 966
        },                                                                                                           // 967
                                                                                                                     // 968
        checkDate = function (direction, unit, amount) {                                                             // 969
            moment.locale(picker.options.language);                                                                  // 970
            var newDate;                                                                                             // 971
            if (direction === 'add') {                                                                               // 972
                newDate = moment(picker.date);                                                                       // 973
                if (newDate.hours() === 23) {                                                                        // 974
                    newDate.add(amount, unit);                                                                       // 975
                }                                                                                                    // 976
                newDate.add(amount, unit);                                                                           // 977
            }                                                                                                        // 978
            else {                                                                                                   // 979
                newDate = moment(picker.date).subtract(amount, unit);                                                // 980
            }                                                                                                        // 981
            if (isInDisableDates(moment(newDate.subtract(amount, unit))) || isInDisableDates(newDate)) {             // 982
                notifyError(newDate.format(picker.format));                                                          // 983
                return;                                                                                              // 984
            }                                                                                                        // 985
                                                                                                                     // 986
            if (direction === 'add') {                                                                               // 987
                picker.date.add(amount, unit);                                                                       // 988
            }                                                                                                        // 989
            else {                                                                                                   // 990
                picker.date.subtract(amount, unit);                                                                  // 991
            }                                                                                                        // 992
            picker.unset = false;                                                                                    // 993
        },                                                                                                           // 994
                                                                                                                     // 995
        isInDisableDates = function (date, timeUnit) {                                                               // 996
            moment.locale(picker.options.language);                                                                  // 997
            var maxDate = moment(picker.options.maxDate, picker.format, picker.options.useStrict),                   // 998
                minDate = moment(picker.options.minDate, picker.format, picker.options.useStrict);                   // 999
                                                                                                                     // 1000
            if (timeUnit) {                                                                                          // 1001
                maxDate = maxDate.endOf(timeUnit);                                                                   // 1002
                minDate = minDate.startOf(timeUnit);                                                                 // 1003
            }                                                                                                        // 1004
                                                                                                                     // 1005
            if (date.isAfter(maxDate) || date.isBefore(minDate)) {                                                   // 1006
                return true;                                                                                         // 1007
            }                                                                                                        // 1008
            if (picker.options.disabledDates === false) {                                                            // 1009
                return false;                                                                                        // 1010
            }                                                                                                        // 1011
            return picker.options.disabledDates[date.format('YYYY-MM-DD')] === true;                                 // 1012
        },                                                                                                           // 1013
        isInEnableDates = function (date) {                                                                          // 1014
            moment.locale(picker.options.language);                                                                  // 1015
            if (picker.options.enabledDates === false) {                                                             // 1016
                return true;                                                                                         // 1017
            }                                                                                                        // 1018
            return picker.options.enabledDates[date.format('YYYY-MM-DD')] === true;                                  // 1019
        },                                                                                                           // 1020
                                                                                                                     // 1021
        indexGivenDates = function (givenDatesArray) {                                                               // 1022
            // Store given enabledDates and disabledDates as keys.                                                   // 1023
            // This way we can check their existence in O(1) time instead of looping through whole array.            // 1024
            // (for example: picker.options.enabledDates['2014-02-27'] === true)                                     // 1025
                                                                                                                     // 1026
            if (! givenDatesArray) return false;                                                                     // 1027
            var givenDatesIndexed = {}, givenDatesCount = 0, i;                                                      // 1028
            for (i = 0; i < givenDatesArray.length; i++) {                                                           // 1029
                if (moment.isMoment(givenDatesArray[i]) || givenDatesArray[i] instanceof Date) {                     // 1030
                    dDate = moment(givenDatesArray[i]);                                                              // 1031
                } else {                                                                                             // 1032
                    dDate = moment(givenDatesArray[i], picker.format, picker.options.useStrict);                     // 1033
                }                                                                                                    // 1034
                if (dDate.isValid()) {                                                                               // 1035
                    givenDatesIndexed[dDate.format('YYYY-MM-DD')] = true;                                            // 1036
                    givenDatesCount++;                                                                               // 1037
                }                                                                                                    // 1038
            }                                                                                                        // 1039
            if (givenDatesCount > 0) {                                                                               // 1040
                return givenDatesIndexed;                                                                            // 1041
            }                                                                                                        // 1042
            return false;                                                                                            // 1043
        },                                                                                                           // 1044
                                                                                                                     // 1045
        padLeft = function (string) {                                                                                // 1046
            string = string.toString();                                                                              // 1047
            if (string.length >= 2) {                                                                                // 1048
                return string;                                                                                       // 1049
            }                                                                                                        // 1050
            return '0' + string;                                                                                     // 1051
        },                                                                                                           // 1052
                                                                                                                     // 1053
        getTemplate = function () {                                                                                  // 1054
            var                                                                                                      // 1055
                headTemplate =                                                                                       // 1056
                        '<thead>' +                                                                                  // 1057
                            '<tr>' +                                                                                 // 1058
                                '<th class="prev">&lsaquo;</th><th colspan="' + (picker.options.calendarWeeks ? '6' : '5') + '" class="picker-switch"></th><th class="next">&rsaquo;</th>' +
                            '</tr>' +                                                                                // 1060
                        '</thead>',                                                                                  // 1061
                contTemplate =                                                                                       // 1062
                        '<tbody><tr><td colspan="' + (picker.options.calendarWeeks ? '8' : '7') + '"></td></tr></tbody>',
                template = '<div class="datepicker-days">' +                                                         // 1064
                    '<table class="table-condensed">' + headTemplate + '<tbody></tbody></table>' +                   // 1065
                '</div>' +                                                                                           // 1066
                '<div class="datepicker-months">' +                                                                  // 1067
                    '<table class="table-condensed">' + headTemplate + contTemplate + '</table>' +                   // 1068
                '</div>' +                                                                                           // 1069
                '<div class="datepicker-years">' +                                                                   // 1070
                    '<table class="table-condensed">' + headTemplate + contTemplate + '</table>' +                   // 1071
                '</div>',                                                                                            // 1072
                ret = '';                                                                                            // 1073
            if (picker.options.pickDate && picker.options.pickTime) {                                                // 1074
                ret = '<div class="bootstrap-datetimepicker-widget' + (picker.options.sideBySide ? ' timepicker-sbs' : '') + (picker.use24hours ? ' usetwentyfour' : '') + ' dropdown-menu" style="z-index:9999 !important;">';
                if (picker.options.sideBySide) {                                                                     // 1076
                    ret += '<div class="row">' +                                                                     // 1077
                       '<div class="col-sm-6 datepicker">' + template + '</div>' +                                   // 1078
                       '<div class="col-sm-6 timepicker">' + tpGlobal.getTemplate() + '</div>' +                     // 1079
                     '</div>';                                                                                       // 1080
                } else {                                                                                             // 1081
                    ret += '<ul class="list-unstyled">' +                                                            // 1082
                        '<li' + (picker.options.collapse ? ' class="collapse in"' : '') + '>' +                      // 1083
                            '<div class="datepicker">' + template + '</div>' +                                       // 1084
                        '</li>' +                                                                                    // 1085
                        '<li class="picker-switch accordion-toggle"><a class="btn" style="width:100%"><span class="' + picker.options.icons.time + '"></span></a></li>' +
                        '<li' + (picker.options.collapse ? ' class="collapse"' : '') + '>' +                         // 1087
                            '<div class="timepicker">' + tpGlobal.getTemplate() + '</div>' +                         // 1088
                        '</li>' +                                                                                    // 1089
                   '</ul>';                                                                                          // 1090
                }                                                                                                    // 1091
                ret += '</div>';                                                                                     // 1092
                return ret;                                                                                          // 1093
            }                                                                                                        // 1094
            if (picker.options.pickTime) {                                                                           // 1095
                return (                                                                                             // 1096
                    '<div class="bootstrap-datetimepicker-widget dropdown-menu">' +                                  // 1097
                        '<div class="timepicker">' + tpGlobal.getTemplate() + '</div>' +                             // 1098
                    '</div>'                                                                                         // 1099
                );                                                                                                   // 1100
            }                                                                                                        // 1101
            return (                                                                                                 // 1102
                '<div class="bootstrap-datetimepicker-widget dropdown-menu">' +                                      // 1103
                    '<div class="datepicker">' + template + '</div>' +                                               // 1104
                '</div>'                                                                                             // 1105
            );                                                                                                       // 1106
        },                                                                                                           // 1107
                                                                                                                     // 1108
        dpGlobal = {                                                                                                 // 1109
            modes: [                                                                                                 // 1110
                {                                                                                                    // 1111
                    clsName: 'days',                                                                                 // 1112
                    navFnc: 'month',                                                                                 // 1113
                    navStep: 1                                                                                       // 1114
                },                                                                                                   // 1115
                {                                                                                                    // 1116
                    clsName: 'months',                                                                               // 1117
                    navFnc: 'year',                                                                                  // 1118
                    navStep: 1                                                                                       // 1119
                },                                                                                                   // 1120
                {                                                                                                    // 1121
                    clsName: 'years',                                                                                // 1122
                    navFnc: 'year',                                                                                  // 1123
                    navStep: 10                                                                                      // 1124
                }                                                                                                    // 1125
            ]                                                                                                        // 1126
        },                                                                                                           // 1127
                                                                                                                     // 1128
        tpGlobal = {                                                                                                 // 1129
            hourTemplate: '<span data-action="showHours"   data-time-component="hours"   class="timepicker-hour"></span>',
            minuteTemplate: '<span data-action="showMinutes" data-time-component="minutes" class="timepicker-minute"></span>',
            secondTemplate: '<span data-action="showSeconds"  data-time-component="seconds" class="timepicker-second"></span>'
        };                                                                                                           // 1133
                                                                                                                     // 1134
        tpGlobal.getTemplate = function () {                                                                         // 1135
            return (                                                                                                 // 1136
                '<div class="timepicker-picker">' +                                                                  // 1137
                    '<table class="table-condensed">' +                                                              // 1138
                        '<tr>' +                                                                                     // 1139
                            '<td><a href="#" class="btn" data-action="incrementHours"><span class="' + picker.options.icons.up + '"></span></a></td>' +
                            '<td class="separator"></td>' +                                                          // 1141
                            '<td>' + (picker.options.useMinutes ? '<a href="#" class="btn" data-action="incrementMinutes"><span class="' + picker.options.icons.up + '"></span></a>' : '') + '</td>' +
                            (picker.options.useSeconds ?                                                             // 1143
                                '<td class="separator"></td><td><a href="#" class="btn" data-action="incrementSeconds"><span class="' + picker.options.icons.up + '"></span></a></td>' : '') +
                            (picker.use24hours ? '' : '<td class="separator"></td>') +                               // 1145
                        '</tr>' +                                                                                    // 1146
                        '<tr>' +                                                                                     // 1147
                            '<td>' + tpGlobal.hourTemplate + '</td> ' +                                              // 1148
                            '<td class="separator">:</td>' +                                                         // 1149
                            '<td>' + (picker.options.useMinutes ? tpGlobal.minuteTemplate : '<span class="timepicker-minute">00</span>') + '</td> ' +
                            (picker.options.useSeconds ?                                                             // 1151
                                '<td class="separator">:</td><td>' + tpGlobal.secondTemplate + '</td>' : '') +       // 1152
                            (picker.use24hours ? '' : '<td class="separator"></td>' +                                // 1153
                            '<td><button type="button" class="btn btn-primary" data-action="togglePeriod"></button></td>') +
                        '</tr>' +                                                                                    // 1155
                        '<tr>' +                                                                                     // 1156
                            '<td><a href="#" class="btn" data-action="decrementHours"><span class="' + picker.options.icons.down + '"></span></a></td>' +
                            '<td class="separator"></td>' +                                                          // 1158
                            '<td>' + (picker.options.useMinutes ? '<a href="#" class="btn" data-action="decrementMinutes"><span class="' + picker.options.icons.down + '"></span></a>' : '') + '</td>' +
                            (picker.options.useSeconds ?                                                             // 1160
                                '<td class="separator"></td><td><a href="#" class="btn" data-action="decrementSeconds"><span class="' + picker.options.icons.down + '"></span></a></td>' : '') +
                            (picker.use24hours ? '' : '<td class="separator"></td>') +                               // 1162
                        '</tr>' +                                                                                    // 1163
                    '</table>' +                                                                                     // 1164
                '</div>' +                                                                                           // 1165
                '<div class="timepicker-hours" data-action="selectHour">' +                                          // 1166
                    '<table class="table-condensed"></table>' +                                                      // 1167
                '</div>' +                                                                                           // 1168
                '<div class="timepicker-minutes" data-action="selectMinute">' +                                      // 1169
                    '<table class="table-condensed"></table>' +                                                      // 1170
                '</div>' +                                                                                           // 1171
                (picker.options.useSeconds ?                                                                         // 1172
                    '<div class="timepicker-seconds" data-action="selectSecond"><table class="table-condensed"></table></div>' : '')
            );                                                                                                       // 1174
        };                                                                                                           // 1175
                                                                                                                     // 1176
        picker.destroy = function () {                                                                               // 1177
            detachDatePickerEvents();                                                                                // 1178
            detachDatePickerGlobalEvents();                                                                          // 1179
            picker.widget.remove();                                                                                  // 1180
            picker.element.removeData('DateTimePicker');                                                             // 1181
            if (picker.component) {                                                                                  // 1182
                picker.component.removeData('DateTimePicker');                                                       // 1183
            }                                                                                                        // 1184
        };                                                                                                           // 1185
                                                                                                                     // 1186
        picker.show = function (e) {                                                                                 // 1187
            if (getPickerInput().prop('disabled')) {                                                                 // 1188
                return;                                                                                              // 1189
            }                                                                                                        // 1190
            if (picker.options.useCurrent) {                                                                         // 1191
                if (getPickerInput().val() === '') {                                                                 // 1192
                    if (picker.options.minuteStepping !== 1) {                                                       // 1193
                        var mDate = moment(),                                                                        // 1194
                        rInterval = picker.options.minuteStepping;                                                   // 1195
                        mDate.minutes((Math.round(mDate.minutes() / rInterval) * rInterval) % 60).seconds(0);        // 1196
                        picker.setValue(mDate.format(picker.format));                                                // 1197
                    } else {                                                                                         // 1198
                        picker.setValue(moment().format(picker.format));                                             // 1199
                    }                                                                                                // 1200
                    notifyChange('', e.type);                                                                        // 1201
                }                                                                                                    // 1202
            }                                                                                                        // 1203
            // if this is a click event on the input field and picker is already open don't hide it                  // 1204
            if (e && e.type === 'click' && picker.isInput && picker.widget.hasClass('picker-open')) {                // 1205
                return;                                                                                              // 1206
            }                                                                                                        // 1207
            if (picker.widget.hasClass('picker-open')) {                                                             // 1208
                picker.widget.hide();                                                                                // 1209
                picker.widget.removeClass('picker-open');                                                            // 1210
            }                                                                                                        // 1211
            else {                                                                                                   // 1212
                picker.widget.show();                                                                                // 1213
                picker.widget.addClass('picker-open');                                                               // 1214
            }                                                                                                        // 1215
            picker.height = picker.component ? picker.component.outerHeight() : picker.element.outerHeight();        // 1216
            place();                                                                                                 // 1217
            picker.element.trigger({                                                                                 // 1218
                type: 'dp.show',                                                                                     // 1219
                date: moment(picker.date)                                                                            // 1220
            });                                                                                                      // 1221
            attachDatePickerGlobalEvents();                                                                          // 1222
            if (e) {                                                                                                 // 1223
                stopEvent(e);                                                                                        // 1224
            }                                                                                                        // 1225
        };                                                                                                           // 1226
                                                                                                                     // 1227
        picker.disable = function () {                                                                               // 1228
            var input = getPickerInput();                                                                            // 1229
            if (input.prop('disabled')) {                                                                            // 1230
                return;                                                                                              // 1231
            }                                                                                                        // 1232
            input.prop('disabled', true);                                                                            // 1233
            detachDatePickerEvents();                                                                                // 1234
        };                                                                                                           // 1235
                                                                                                                     // 1236
        picker.enable = function () {                                                                                // 1237
            var input = getPickerInput();                                                                            // 1238
            if (!input.prop('disabled')) {                                                                           // 1239
                return;                                                                                              // 1240
            }                                                                                                        // 1241
            input.prop('disabled', false);                                                                           // 1242
            attachDatePickerEvents();                                                                                // 1243
        };                                                                                                           // 1244
                                                                                                                     // 1245
        picker.hide = function () {                                                                                  // 1246
            // Ignore event if in the middle of a picker transition                                                  // 1247
            var collapse = picker.widget.find('.collapse'), i, collapseData;                                         // 1248
            for (i = 0; i < collapse.length; i++) {                                                                  // 1249
                collapseData = collapse.eq(i).data('collapse');                                                      // 1250
                if (collapseData && collapseData.transitioning) {                                                    // 1251
                    return;                                                                                          // 1252
                }                                                                                                    // 1253
            }                                                                                                        // 1254
            picker.widget.hide();                                                                                    // 1255
            picker.widget.removeClass('picker-open');                                                                // 1256
            picker.viewMode = picker.startViewMode;                                                                  // 1257
            showMode();                                                                                              // 1258
            picker.element.trigger({                                                                                 // 1259
                type: 'dp.hide',                                                                                     // 1260
                date: moment(picker.date)                                                                            // 1261
            });                                                                                                      // 1262
            detachDatePickerGlobalEvents();                                                                          // 1263
        };                                                                                                           // 1264
                                                                                                                     // 1265
        picker.setValue = function (newDate) {                                                                       // 1266
            moment.locale(picker.options.language);                                                                  // 1267
            if (!newDate) {                                                                                          // 1268
                picker.unset = true;                                                                                 // 1269
                set();                                                                                               // 1270
            } else {                                                                                                 // 1271
                picker.unset = false;                                                                                // 1272
            }                                                                                                        // 1273
            if (!moment.isMoment(newDate)) {                                                                         // 1274
                newDate = (newDate instanceof Date) ? moment(newDate) : moment(newDate, picker.format, picker.options.useStrict);
            } else {                                                                                                 // 1276
                newDate = newDate.locale(picker.options.language);                                                   // 1277
            }                                                                                                        // 1278
            if (newDate.isValid()) {                                                                                 // 1279
                picker.date = newDate;                                                                               // 1280
                set();                                                                                               // 1281
                picker.viewDate = moment({y: picker.date.year(), M: picker.date.month()});                           // 1282
                fillDate();                                                                                          // 1283
                fillTime();                                                                                          // 1284
            }                                                                                                        // 1285
            else {                                                                                                   // 1286
                notifyError(newDate);                                                                                // 1287
            }                                                                                                        // 1288
        };                                                                                                           // 1289
                                                                                                                     // 1290
        picker.getDate = function () {                                                                               // 1291
            if (picker.unset) {                                                                                      // 1292
                return null;                                                                                         // 1293
            }                                                                                                        // 1294
            return moment(picker.date);                                                                              // 1295
        };                                                                                                           // 1296
                                                                                                                     // 1297
        picker.setDate = function (date) {                                                                           // 1298
            var oldDate = moment(picker.date);                                                                       // 1299
            if (!date) {                                                                                             // 1300
                picker.setValue(null);                                                                               // 1301
            } else {                                                                                                 // 1302
                picker.setValue(date);                                                                               // 1303
            }                                                                                                        // 1304
            notifyChange(oldDate, 'function');                                                                       // 1305
        };                                                                                                           // 1306
                                                                                                                     // 1307
        picker.setDisabledDates = function (dates) {                                                                 // 1308
            picker.options.disabledDates = indexGivenDates(dates);                                                   // 1309
            if (picker.viewDate) {                                                                                   // 1310
                update();                                                                                            // 1311
            }                                                                                                        // 1312
        };                                                                                                           // 1313
                                                                                                                     // 1314
        picker.setEnabledDates = function (dates) {                                                                  // 1315
            picker.options.enabledDates = indexGivenDates(dates);                                                    // 1316
            if (picker.viewDate) {                                                                                   // 1317
                update();                                                                                            // 1318
            }                                                                                                        // 1319
        };                                                                                                           // 1320
                                                                                                                     // 1321
        picker.setMaxDate = function (date) {                                                                        // 1322
            if (date === undefined) {                                                                                // 1323
                return;                                                                                              // 1324
            }                                                                                                        // 1325
            if (moment.isMoment(date) || date instanceof Date) {                                                     // 1326
                picker.options.maxDate = moment(date);                                                               // 1327
            } else {                                                                                                 // 1328
                picker.options.maxDate = moment(date, picker.format, picker.options.useStrict);                      // 1329
            }                                                                                                        // 1330
            if (picker.viewDate) {                                                                                   // 1331
                update();                                                                                            // 1332
            }                                                                                                        // 1333
        };                                                                                                           // 1334
                                                                                                                     // 1335
        picker.setMinDate = function (date) {                                                                        // 1336
            if (date === undefined) {                                                                                // 1337
                return;                                                                                              // 1338
            }                                                                                                        // 1339
            if (moment.isMoment(date) || date instanceof Date) {                                                     // 1340
                picker.options.minDate = moment(date);                                                               // 1341
            } else {                                                                                                 // 1342
                picker.options.minDate = moment(date, picker.format, picker.options.useStrict);                      // 1343
            }                                                                                                        // 1344
            if (picker.viewDate) {                                                                                   // 1345
                update();                                                                                            // 1346
            }                                                                                                        // 1347
        };                                                                                                           // 1348
                                                                                                                     // 1349
        init();                                                                                                      // 1350
    };                                                                                                               // 1351
                                                                                                                     // 1352
    $.fn.datetimepicker = function (options) {                                                                       // 1353
        return this.each(function () {                                                                               // 1354
            var $this = $(this),                                                                                     // 1355
                data = $this.data('DateTimePicker');                                                                 // 1356
            if (!data) {                                                                                             // 1357
                $this.data('DateTimePicker', new DateTimePicker(this, options));                                     // 1358
            }                                                                                                        // 1359
        });                                                                                                          // 1360
    };                                                                                                               // 1361
                                                                                                                     // 1362
    $.fn.datetimepicker.defaults = {                                                                                 // 1363
        format: false,                                                                                               // 1364
        pickDate: true,                                                                                              // 1365
        pickTime: true,                                                                                              // 1366
        useMinutes: true,                                                                                            // 1367
        useSeconds: false,                                                                                           // 1368
        useCurrent: true,                                                                                            // 1369
        calendarWeeks: false,                                                                                        // 1370
        minuteStepping: 1,                                                                                           // 1371
        minDate: moment({y: 1900}),                                                                                  // 1372
        maxDate: moment().add(100, 'y'),                                                                             // 1373
        showToday: true,                                                                                             // 1374
        collapse: true,                                                                                              // 1375
        language: moment.locale(),                                                                                   // 1376
        defaultDate: '',                                                                                             // 1377
        disabledDates: false,                                                                                        // 1378
        enabledDates: false,                                                                                         // 1379
        icons: {},                                                                                                   // 1380
        useStrict: false,                                                                                            // 1381
        direction: 'auto',                                                                                           // 1382
        sideBySide: false,                                                                                           // 1383
        daysOfWeekDisabled: [],                                                                                      // 1384
        widgetParent: false                                                                                          // 1385
    };                                                                                                               // 1386
}));                                                                                                                 // 1387
                                                                                                                     // 1388
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['tsega:bootstrap3-datetimepicker'] = {};

})();
