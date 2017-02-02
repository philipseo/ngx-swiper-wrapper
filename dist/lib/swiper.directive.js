"use strict";
var Swiper = require('swiper');
var core_1 = require('@angular/core');
var core_2 = require('@angular/core');
var core_3 = require('@angular/core');
var swiper_interfaces_1 = require('./swiper.interfaces');
var SwiperDirective = (function () {
    function SwiperDirective(zone, elementRef, differs, defaults) {
        this.zone = zone;
        this.elementRef = elementRef;
        this.differs = differs;
        this.defaults = defaults;
        this.disabled = false;
        this.runInsideAngular = false;
        this.s_init = new core_2.EventEmitter();
        this.s_slideChangeStart = new core_2.EventEmitter();
        this.s_slideChangeEnd = new core_2.EventEmitter();
        this.s_slideNextStart = new core_2.EventEmitter();
        this.s_slideNextEnd = new core_2.EventEmitter();
        this.s_slidePrevStart = new core_2.EventEmitter();
        this.s_slidePrevEnd = new core_2.EventEmitter();
        this.s_transitionStart = new core_2.EventEmitter();
        this.s_transitionEnd = new core_2.EventEmitter();
        this.s_touchStart = new core_2.EventEmitter();
        this.s_touchMove = new core_2.EventEmitter();
        this.s_touchMoveOpposite = new core_2.EventEmitter();
        this.s_sliderMove = new core_2.EventEmitter();
        this.s_touchEnd = new core_2.EventEmitter();
        this.s_click = new core_2.EventEmitter();
        this.s_tap = new core_2.EventEmitter();
        this.s_doubleTap = new core_2.EventEmitter();
        this.s_imagesReady = new core_2.EventEmitter();
        this.s_progress = new core_2.EventEmitter();
        this.s_reachBeginning = new core_2.EventEmitter();
        this.s_reachEnd = new core_2.EventEmitter();
        this.s_destroy = new core_2.EventEmitter();
        this.s_setTranslate = new core_2.EventEmitter();
        this.s_setTransition = new core_2.EventEmitter();
        this.s_autoplay = new core_2.EventEmitter();
        this.s_autoplayStart = new core_2.EventEmitter();
        this.s_autoplayStop = new core_2.EventEmitter();
        this.s_lazyImageLoad = new core_2.EventEmitter();
        this.s_lazyImageReady = new core_2.EventEmitter();
        this.s_paginationRendered = new core_2.EventEmitter();
        this.s_scroll = new core_2.EventEmitter();
    }
    SwiperDirective.prototype.ngOnInit = function () {
        var _this = this;
        var element = this.elementRef.nativeElement;
        var options = new swiper_interfaces_1.SwiperConfig(this.defaults);
        options.assign(this.config); // Custom config
        if (this.runInsideAngular) {
            this.swiper = new Swiper(element, options);
        }
        else {
            this.zone.runOutsideAngular(function () {
                _this.swiper = new Swiper(element, options);
            });
        }
        // Add native swiper event handling
        swiper_interfaces_1.SwiperEvents.forEach(function (eventName) {
            var self = _this;
            _this.swiper.on(eventName, function (event) {
                self[("s_" + eventName)].emit(event);
            });
        });
        if (!this.configDiff) {
            this.configDiff = this.differs.find(this.config || {}).create(null);
        }
    };
    SwiperDirective.prototype.ngDoCheck = function () {
        var _this = this;
        var changes = this.configDiff.diff(this.config || {});
        if (changes) {
            this.ngOnDestroy();
            // This is needed for the styles to update properly
            setTimeout(function () {
                _this.ngOnInit();
                _this.update();
            }, 0);
        }
    };
    SwiperDirective.prototype.ngOnDestroy = function () {
        var _this = this;
        if (this.swiper) {
            if (this.runInsideAngular) {
                this.swiper.destroy(true, true);
            }
            else {
                this.zone.runOutsideAngular(function () {
                    _this.swiper.destroy(true, true);
                });
            }
            this.swiper = null;
        }
    };
    SwiperDirective.prototype.ngOnChanges = function (changes) {
        if (this.swiper && changes['disabled']) {
            if (changes['disabled'].currentValue != changes['disabled'].previousValue) {
                if (changes['disabled'].currentValue === true) {
                    this.swiper.lockSwipes();
                }
                else if (changes['disabled'].currentValue === false) {
                    this.swiper.unlockSwipes();
                }
            }
        }
    };
    SwiperDirective.prototype.update = function (updateTranslate) {
        var _this = this;
        setTimeout(function () {
            if (_this.swiper) {
                if (_this.runInsideAngular) {
                    _this.swiper.update(updateTranslate);
                }
                else {
                    _this.zone.runOutsideAngular(function () {
                        _this.swiper.update(updateTranslate);
                    });
                }
            }
        }, 0);
    };
    SwiperDirective.decorators = [
        { type: core_3.Directive, args: [{
                    selector: '[swiper]'
                },] },
    ];
    /** @nocollapse */
    SwiperDirective.ctorParameters = function () { return [
        { type: core_1.NgZone, },
        { type: core_2.ElementRef, },
        { type: core_1.KeyValueDiffers, },
        { type: swiper_interfaces_1.SwiperConfig, decorators: [{ type: core_3.Optional },] },
    ]; };
    SwiperDirective.propDecorators = {
        'disabled': [{ type: core_2.Input },],
        'runInsideAngular': [{ type: core_2.Input },],
        'config': [{ type: core_2.Input, args: ['swiper',] },],
        's_init': [{ type: core_2.Output, args: ['init',] },],
        's_slideChangeStart': [{ type: core_2.Output, args: ['slideChangeStart',] },],
        's_slideChangeEnd': [{ type: core_2.Output, args: ['slideChangeEnd',] },],
        's_slideNextStart': [{ type: core_2.Output, args: ['slideNextStart',] },],
        's_slideNextEnd': [{ type: core_2.Output, args: ['slideNextEnd',] },],
        's_slidePrevStart': [{ type: core_2.Output, args: ['slidePrevStart',] },],
        's_slidePrevEnd': [{ type: core_2.Output, args: ['slidePrevEnd',] },],
        's_transitionStart': [{ type: core_2.Output, args: ['transitionStart',] },],
        's_transitionEnd': [{ type: core_2.Output, args: ['transitionEnd',] },],
        's_touchStart': [{ type: core_2.Output, args: ['touchStart',] },],
        's_touchMove': [{ type: core_2.Output, args: ['touchMove',] },],
        's_touchMoveOpposite': [{ type: core_2.Output, args: ['touchMoveOpposite',] },],
        's_sliderMove': [{ type: core_2.Output, args: ['sliderMove',] },],
        's_touchEnd': [{ type: core_2.Output, args: ['touchEnd',] },],
        's_click': [{ type: core_2.Output, args: ['click',] },],
        's_tap': [{ type: core_2.Output, args: ['tap',] },],
        's_doubleTap': [{ type: core_2.Output, args: ['doubleTap',] },],
        's_imagesReady': [{ type: core_2.Output, args: ['imagesReady',] },],
        's_progress': [{ type: core_2.Output, args: ['progress',] },],
        's_reachBeginning': [{ type: core_2.Output, args: ['reachBeginning',] },],
        's_reachEnd': [{ type: core_2.Output, args: ['reachEnd',] },],
        's_destroy': [{ type: core_2.Output, args: ['destroy',] },],
        's_setTranslate': [{ type: core_2.Output, args: ['setTranslate',] },],
        's_setTransition': [{ type: core_2.Output, args: ['setTransition',] },],
        's_autoplay': [{ type: core_2.Output, args: ['autoplay',] },],
        's_autoplayStart': [{ type: core_2.Output, args: ['autoplayStart',] },],
        's_autoplayStop': [{ type: core_2.Output, args: ['autoplayStop',] },],
        's_lazyImageLoad': [{ type: core_2.Output, args: ['lazyImageLoad',] },],
        's_lazyImageReady': [{ type: core_2.Output, args: ['lazyImageReady',] },],
        's_paginationRendered': [{ type: core_2.Output, args: ['paginationRendered',] },],
        's_scroll': [{ type: core_2.Output, args: ['scroll',] },],
    };
    return SwiperDirective;
}());
exports.SwiperDirective = SwiperDirective;
//# sourceMappingURL=swiper.directive.js.map