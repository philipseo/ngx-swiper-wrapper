"use strict";
var Swiper = require('swiper');
var core_1 = require('@angular/core');
var core_2 = require('@angular/core');
var core_3 = require('@angular/core');
var swiper_interfaces_1 = require('./swiper.interfaces');
var SwiperComponent = (function () {
    function SwiperComponent(zone, elementRef, differs, defaults) {
        this.zone = zone;
        this.elementRef = elementRef;
        this.differs = differs;
        this.defaults = defaults;
        this.hidden = false;
        this.disabled = false;
        this.runInsideAngular = false;
        this.indexChange = new core_3.EventEmitter();
        this.s_init = new core_3.EventEmitter();
        this.s_slideChangeStart = new core_3.EventEmitter();
        this.s_slideChangeEnd = new core_3.EventEmitter();
        this.s_slideNextStart = new core_3.EventEmitter();
        this.s_slideNextEnd = new core_3.EventEmitter();
        this.s_slidePrevStart = new core_3.EventEmitter();
        this.s_slidePrevEnd = new core_3.EventEmitter();
        this.s_transitionStart = new core_3.EventEmitter();
        this.s_transitionEnd = new core_3.EventEmitter();
        this.s_touchStart = new core_3.EventEmitter();
        this.s_touchMove = new core_3.EventEmitter();
        this.s_touchMoveOpposite = new core_3.EventEmitter();
        this.s_sliderMove = new core_3.EventEmitter();
        this.s_touchEnd = new core_3.EventEmitter();
        this.s_click = new core_3.EventEmitter();
        this.s_tap = new core_3.EventEmitter();
        this.s_doubleTap = new core_3.EventEmitter();
        this.s_imagesReady = new core_3.EventEmitter();
        this.s_progress = new core_3.EventEmitter();
        this.s_reachBeginning = new core_3.EventEmitter();
        this.s_reachEnd = new core_3.EventEmitter();
        this.s_destroy = new core_3.EventEmitter();
        this.s_setTranslate = new core_3.EventEmitter();
        this.s_setTransition = new core_3.EventEmitter();
        this.s_autoplay = new core_3.EventEmitter();
        this.s_autoplayStart = new core_3.EventEmitter();
        this.s_autoplayStop = new core_3.EventEmitter();
        this.s_lazyImageLoad = new core_3.EventEmitter();
        this.s_lazyImageReady = new core_3.EventEmitter();
        this.s_paginationRendered = new core_3.EventEmitter();
        this.s_scroll = new core_3.EventEmitter();
        this.swiperWrapper = null;
        this.useSwiperClass = true;
    }
    SwiperComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.showButtons = false;
        this.showScrollbar = false;
        this.showPagination = false;
        var element = this.elementRef.nativeElement;
        var options = new swiper_interfaces_1.SwiperConfig(this.defaults);
        options.assign(this.config); // Custom config
        if (this.initialIndex != null) {
            options.initialSlide = this.initialIndex;
        }
        if (options.scrollbar === true || options.scrollbar === '.swiper-scrollbar') {
            this.showScrollbar = true;
            options.scrollbar = element.querySelector('.swiper-scrollbar');
        }
        if (options.pagination === true || options.pagination === '.swiper-pagination') {
            this.showPagination = true;
            options.pagination = element.querySelector('.swiper-pagination');
        }
        if (options.prevButton === true || options.prevButton === '.swiper-button-prev') {
            this.showButtons = true;
            options.prevButton = element.querySelector('.swiper-button-prev');
        }
        if (options.nextButton === true || options.nextButton === '.swiper-button-next') {
            this.showButtons = true;
            options.nextButton = element.querySelector('.swiper-button-next');
        }
        if (!options['onSlideChangeStart']) {
            options['onSlideChangeStart'] = function (swiper) {
                _this.zone.run(function () {
                    _this.isAtLast = swiper.isEnd;
                    _this.isAtFirst = swiper.isBeginning;
                    _this.indexChange.emit(swiper.snapIndex);
                });
            };
        }
        if (!options['onScrollbarDragEnd']) {
            options['onScrollbarDragEnd'] = function (swiper) {
                _this.zone.run(function () {
                    _this.isAtLast = swiper.isEnd;
                    _this.isAtFirst = swiper.isBeginning;
                    _this.indexChange.emit(swiper.snapIndex);
                });
            };
        }
        if (!options['paginationBulletRender']) {
            options['paginationBulletRender'] = function (swiper, index, className) {
                if (_this.swiper) {
                    if (index === 0) {
                        return '<span class="swiper-pagination-handle" index=' + index + '>' +
                            '<span class="' + className + ' ' + className + '-first"></span></span>';
                    }
                    else if (index === (_this.swiper.slides.length - 1)) {
                        return '<span class="swiper-pagination-handle" index=' + index + '>' +
                            '<span class="' + className + ' ' + className + '-last"></span></span>';
                    }
                    else {
                        return '<span class="swiper-pagination-handle" index=' + index + '>' +
                            '<span class="' + className + ' ' + className + '-middle"></span></span>';
                    }
                }
            };
        }
        if (this.runInsideAngular) {
            this.swiper = new Swiper(element.children[0], options);
        }
        else {
            this.zone.runOutsideAngular(function () {
                _this.swiper = new Swiper(element.children[0], options);
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
    SwiperComponent.prototype.ngDoCheck = function () {
        var _this = this;
        var changes = this.configDiff.diff(this.config || {});
        var children = this.swiperWrapper.nativeElement.children.length;
        if (changes) {
            this.initialIndex = this.getIndex();
            changes.forEachAddedItem(function (changed) {
                if (changed.key === 'initialSlide') {
                    _this.initialIndex = _this.config.initialSlide;
                }
            });
            this.ngOnDestroy();
            // Timeout is needed for the styles to update properly
            setTimeout(function () {
                _this.ngOnInit();
                _this.update();
            }, 0);
        }
        else if (children !== this.childsDiff) {
            this.childsDiff = children;
            this.update();
        }
    };
    SwiperComponent.prototype.ngOnDestroy = function () {
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
    SwiperComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (this.swiper && changes['hidden'] && this.hidden) {
            // For some reason resize causes Swiper to change index when hidden
            this.initialIndex = this.swiper.activeIndex || 0;
        }
        if (this.swiper && changes['hidden'] && !this.hidden) {
            // For some reason resize causes Swiper to change index when hidden
            this.swiper.activeIndex = this.initialIndex || 0;
            this.update(true);
        }
        if (this.swiper && changes['disabled'] && !this.hidden) {
            if (changes['disabled'].currentValue != changes['disabled'].previousValue) {
                if (changes['disabled'].currentValue === true) {
                    if (this.runInsideAngular) {
                        this.swiper.lockSwipes();
                    }
                    else {
                        this.zone.runOutsideAngular(function () {
                            _this.swiper.lockSwipes();
                        });
                    }
                }
                else if (changes['disabled'].currentValue === false) {
                    if (this.runInsideAngular) {
                        this.swiper.unlockSwipes();
                    }
                    else {
                        this.zone.runOutsideAngular(function () {
                            _this.swiper.unlockSwipes();
                        });
                    }
                }
            }
            this.update(false);
        }
    };
    SwiperComponent.prototype.update = function (updateTranslate) {
        var _this = this;
        if (this.swiperWrapper) {
            for (var i = 0; i < this.swiperWrapper.nativeElement.children.length; i++) {
                this.swiperWrapper.nativeElement.children[i].classList.add('swiper-slide');
            }
        }
        setTimeout(function () {
            if (_this.swiper) {
                if (_this.runInsideAngular) {
                    _this.swiper.update();
                    if (updateTranslate) {
                        setTimeout(function () {
                            _this.swiper.update(true);
                        }, 0);
                    }
                }
                else {
                    _this.zone.runOutsideAngular(function () {
                        _this.swiper.update();
                        if (updateTranslate) {
                            setTimeout(function () {
                                _this.swiper.update(true);
                            }, 0);
                        }
                    });
                }
                _this.isAtFirst = _this.swiper.isBeginning;
                _this.isAtLast = _this.swiper.isEnd;
            }
        }, 0);
    };
    SwiperComponent.prototype.getIndex = function () {
        if (!this.swiper) {
            return this.initialIndex;
        }
        else {
            return this.swiper.activeIndex;
        }
    };
    SwiperComponent.prototype.setIndex = function (index, speed, callbacks) {
        var _this = this;
        if (!this.swiper) {
            this.initialIndex = index;
        }
        else {
            if (this.runInsideAngular) {
                this.swiper.slideTo(index, speed, callbacks);
            }
            else {
                this.zone.runOutsideAngular(function () {
                    _this.swiper.slideTo(index, speed, callbacks);
                });
            }
        }
    };
    SwiperComponent.prototype.prevSlide = function (callbacks, speed) {
        var _this = this;
        if (this.swiper) {
            if (this.runInsideAngular) {
                this.swiper.slidePrev(callbacks, speed);
            }
            else {
                this.zone.runOutsideAngular(function () {
                    _this.swiper.slidePrev(callbacks, speed);
                });
            }
        }
    };
    SwiperComponent.prototype.nextSlide = function (callbacks, speed) {
        var _this = this;
        if (this.swiper) {
            if (this.runInsideAngular) {
                this.swiper.slideNext(callbacks, speed);
            }
            else {
                this.zone.runOutsideAngular(function () {
                    _this.swiper.slideNext(callbacks, speed);
                });
            }
        }
    };
    SwiperComponent.prototype.stopPlay = function () {
        var _this = this;
        if (this.swiper) {
            if (this.runInsideAngular) {
                this.swiper.stopAutoplay();
            }
            else {
                this.zone.runOutsideAngular(function () {
                    _this.swiper.stopAutoplay();
                });
            }
        }
    };
    SwiperComponent.prototype.startPlay = function () {
        var _this = this;
        if (this.swiper) {
            if (this.runInsideAngular) {
                this.swiper.startAutoplay();
            }
            else {
                this.zone.runOutsideAngular(function () {
                    _this.swiper.startAutoplay();
                });
            }
        }
    };
    SwiperComponent.prototype.onIndexSelect = function (event) {
        this.setIndex(event.target.attributes.index.value);
    };
    SwiperComponent.decorators = [
        { type: core_2.Component, args: [{
                    selector: 'swiper',
                    template: '<div class="swiper-container"><div #swiperWrapper class="swiper-wrapper"><ng-content></ng-content></div><div [hidden]="!showScrollbar" class="swiper-scrollbar"></div><div [hidden]="!showButtons" class="swiper-button-prev" [ngClass]="{\'disabled\': isAtFirst }"></div><div [hidden]="!showButtons" class="swiper-button-next" [ngClass]="{\'disabled\': isAtLast }"></div><div [hidden]="!showPagination" class="swiper-pagination" (click)="onIndexSelect($event)"></div></div>',
                    styles: ['.swiper-slide,.swiper-wrapper{width:100%;height:100%;position:relative}.swiper-container{margin-left:auto;margin-right:auto;position:relative;overflow:hidden;z-index:1}.swiper-container-no-flexbox .swiper-slide{float:left}.swiper-container-vertical>.swiper-wrapper{-webkit-box-orient:vertical;-moz-box-orient:vertical;-ms-flex-direction:column;-webkit-flex-direction:column;flex-direction:column}.swiper-wrapper{z-index:1;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-transition-property:-webkit-transform;-moz-transition-property:-moz-transform;-o-transition-property:-o-transform;-ms-transition-property:-ms-transform;transition-property:transform;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}.swiper-container-android .swiper-slide,.swiper-wrapper{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);-o-transform:translate(0,0);-ms-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.swiper-container-multirow>.swiper-wrapper{-webkit-box-lines:multiple;-moz-box-lines:multiple;-ms-flex-wrap:wrap;-webkit-flex-wrap:wrap;flex-wrap:wrap}.swiper-container-free-mode>.swiper-wrapper{-webkit-transition-timing-function:ease-out;-moz-transition-timing-function:ease-out;-ms-transition-timing-function:ease-out;-o-transition-timing-function:ease-out;transition-timing-function:ease-out;margin:0 auto}.swiper-slide{-webkit-flex-shrink:0;-ms-flex:0 0 auto;flex-shrink:0}.swiper-container-autoheight,.swiper-container-autoheight .swiper-slide{height:auto}.swiper-container-autoheight .swiper-wrapper{-webkit-box-align:start;-ms-flex-align:start;-webkit-align-items:flex-start;align-items:flex-start;-webkit-transition-property:-webkit-transform,height;-moz-transition-property:-moz-transform;-o-transition-property:-o-transform;-ms-transition-property:-ms-transform;transition-property:transform,height}.swiper-container .swiper-notification{position:absolute;left:0;top:0;pointer-events:none;opacity:0;z-index:-1000}.swiper-wp8-horizontal{-ms-touch-action:pan-y;touch-action:pan-y}.swiper-wp8-vertical{-ms-touch-action:pan-x;touch-action:pan-x}.swiper-button-next,.swiper-button-prev{position:absolute;top:50%;width:27px;height:44px;margin-top:-22px;z-index:10;cursor:pointer;-moz-background-size:27px 44px;-webkit-background-size:27px 44px;background-size:27px 44px;background-position:center;background-repeat:no-repeat}.swiper-button-next.swiper-button-disabled,.swiper-button-prev.swiper-button-disabled{opacity:.35;cursor:auto;pointer-events:none}.swiper-button-prev,.swiper-container-rtl .swiper-button-next{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D\'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg\'%20viewBox%3D\'0%200%2027%2044\'%3E%3Cpath%20d%3D\'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z\'%20fill%3D\'%23007aff\'%2F%3E%3C%2Fsvg%3E");left:10px;right:auto}.swiper-button-prev.swiper-button-black,.swiper-container-rtl .swiper-button-next.swiper-button-black{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D\'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg\'%20viewBox%3D\'0%200%2027%2044\'%3E%3Cpath%20d%3D\'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z\'%20fill%3D\'%23000000\'%2F%3E%3C%2Fsvg%3E")}.swiper-button-prev.swiper-button-white,.swiper-container-rtl .swiper-button-next.swiper-button-white{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D\'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg\'%20viewBox%3D\'0%200%2027%2044\'%3E%3Cpath%20d%3D\'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z\'%20fill%3D\'%23ffffff\'%2F%3E%3C%2Fsvg%3E")}.swiper-button-next,.swiper-container-rtl .swiper-button-prev{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D\'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg\'%20viewBox%3D\'0%200%2027%2044\'%3E%3Cpath%20d%3D\'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z\'%20fill%3D\'%23007aff\'%2F%3E%3C%2Fsvg%3E");right:10px;left:auto}.swiper-button-next.swiper-button-black,.swiper-container-rtl .swiper-button-prev.swiper-button-black{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D\'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg\'%20viewBox%3D\'0%200%2027%2044\'%3E%3Cpath%20d%3D\'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z\'%20fill%3D\'%23000000\'%2F%3E%3C%2Fsvg%3E")}.swiper-button-next.swiper-button-white,.swiper-container-rtl .swiper-button-prev.swiper-button-white{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D\'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg\'%20viewBox%3D\'0%200%2027%2044\'%3E%3Cpath%20d%3D\'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z\'%20fill%3D\'%23ffffff\'%2F%3E%3C%2Fsvg%3E")}.swiper-pagination{position:absolute;text-align:center;-webkit-transition:.3s;-moz-transition:.3s;-o-transition:.3s;transition:.3s;-webkit-transform:translate3d(0,0,0);-ms-transform:translate3d(0,0,0);-o-transform:translate3d(0,0,0);transform:translate3d(0,0,0);z-index:10}.swiper-pagination.swiper-pagination-hidden{opacity:0}.swiper-container-horizontal>.swiper-pagination-bullets,.swiper-pagination-custom,.swiper-pagination-fraction{bottom:10px;left:0;width:100%}.swiper-pagination-bullet{width:8px;height:8px;display:inline-block;border-radius:100%;background:#000;opacity:.2}button.swiper-pagination-bullet{border:none;margin:0;padding:0;box-shadow:none;-moz-appearance:none;-ms-appearance:none;-webkit-appearance:none;appearance:none}.swiper-pagination-clickable .swiper-pagination-bullet{cursor:pointer}.swiper-pagination-white .swiper-pagination-bullet{background:#fff}.swiper-pagination-bullet-active{opacity:1;background:#007aff}.swiper-pagination-white .swiper-pagination-bullet-active{background:#fff}.swiper-pagination-black .swiper-pagination-bullet-active{background:#000}.swiper-container-vertical>.swiper-pagination-bullets{right:10px;top:50%;-webkit-transform:translate3d(0,-50%,0);-moz-transform:translate3d(0,-50%,0);-o-transform:translate(0,-50%);-ms-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0)}.swiper-container-vertical>.swiper-pagination-bullets .swiper-pagination-bullet{margin:5px 0;display:block}.swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet{margin:0 5px}.swiper-pagination-progress{background:rgba(0,0,0,.25);position:absolute}.swiper-pagination-progress .swiper-pagination-progressbar{background:#007aff;position:absolute;left:0;top:0;width:100%;height:100%;-webkit-transform:scale(0);-ms-transform:scale(0);-o-transform:scale(0);transform:scale(0);-webkit-transform-origin:left top;-moz-transform-origin:left top;-ms-transform-origin:left top;-o-transform-origin:left top;transform-origin:left top}.swiper-container-rtl .swiper-pagination-progress .swiper-pagination-progressbar{-webkit-transform-origin:right top;-moz-transform-origin:right top;-ms-transform-origin:right top;-o-transform-origin:right top;transform-origin:right top}.swiper-container-horizontal>.swiper-pagination-progress{width:100%;height:4px;left:0;top:0}.swiper-container-vertical>.swiper-pagination-progress{width:4px;height:100%;left:0;top:0}.swiper-pagination-progress.swiper-pagination-white{background:rgba(255,255,255,.5)}.swiper-pagination-progress.swiper-pagination-white .swiper-pagination-progressbar{background:#fff}.swiper-pagination-progress.swiper-pagination-black .swiper-pagination-progressbar{background:#000}.swiper-container-3d{-webkit-perspective:1200px;-moz-perspective:1200px;-o-perspective:1200px;perspective:1200px}.swiper-container-3d .swiper-cube-shadow,.swiper-container-3d .swiper-slide,.swiper-container-3d .swiper-slide-shadow-bottom,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-top,.swiper-container-3d .swiper-wrapper{-webkit-transform-style:preserve-3d;-moz-transform-style:preserve-3d;-ms-transform-style:preserve-3d;transform-style:preserve-3d}.swiper-container-3d .swiper-slide-shadow-bottom,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-top{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:10}.swiper-container-3d .swiper-slide-shadow-left{background-image:-webkit-gradient(linear,left top,right top,from(rgba(0,0,0,.5)),to(transparent));background-image:-webkit-linear-gradient(right,rgba(0,0,0,.5),transparent);background-image:-moz-linear-gradient(right,rgba(0,0,0,.5),transparent);background-image:-o-linear-gradient(right,rgba(0,0,0,.5),transparent);background-image:linear-gradient(to left,rgba(0,0,0,.5),transparent)}.swiper-container-3d .swiper-slide-shadow-right{background-image:-webkit-gradient(linear,right top,left top,from(rgba(0,0,0,.5)),to(transparent));background-image:-webkit-linear-gradient(left,rgba(0,0,0,.5),transparent);background-image:-moz-linear-gradient(left,rgba(0,0,0,.5),transparent);background-image:-o-linear-gradient(left,rgba(0,0,0,.5),transparent);background-image:linear-gradient(to right,rgba(0,0,0,.5),transparent)}.swiper-container-3d .swiper-slide-shadow-top{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(0,0,0,.5)),to(transparent));background-image:-webkit-linear-gradient(bottom,rgba(0,0,0,.5),transparent);background-image:-moz-linear-gradient(bottom,rgba(0,0,0,.5),transparent);background-image:-o-linear-gradient(bottom,rgba(0,0,0,.5),transparent);background-image:linear-gradient(to top,rgba(0,0,0,.5),transparent)}.swiper-container-3d .swiper-slide-shadow-bottom{background-image:-webkit-gradient(linear,left bottom,left top,from(rgba(0,0,0,.5)),to(transparent));background-image:-webkit-linear-gradient(top,rgba(0,0,0,.5),transparent);background-image:-moz-linear-gradient(top,rgba(0,0,0,.5),transparent);background-image:-o-linear-gradient(top,rgba(0,0,0,.5),transparent);background-image:linear-gradient(to bottom,rgba(0,0,0,.5),transparent)}.swiper-container-coverflow .swiper-wrapper,.swiper-container-flip .swiper-wrapper{-ms-perspective:1200px}.swiper-container-cube,.swiper-container-flip{overflow:visible}.swiper-container-cube .swiper-slide,.swiper-container-flip .swiper-slide{pointer-events:none;-webkit-backface-visibility:hidden;-moz-backface-visibility:hidden;-ms-backface-visibility:hidden;backface-visibility:hidden;z-index:1}.swiper-container-cube .swiper-slide .swiper-slide,.swiper-container-flip .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-cube .swiper-slide-active,.swiper-container-cube .swiper-slide-active .swiper-slide-active,.swiper-container-flip .swiper-slide-active,.swiper-container-flip .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-container-cube .swiper-slide-shadow-bottom,.swiper-container-cube .swiper-slide-shadow-left,.swiper-container-cube .swiper-slide-shadow-right,.swiper-container-cube .swiper-slide-shadow-top,.swiper-container-flip .swiper-slide-shadow-bottom,.swiper-container-flip .swiper-slide-shadow-left,.swiper-container-flip .swiper-slide-shadow-right,.swiper-container-flip .swiper-slide-shadow-top{z-index:0;-webkit-backface-visibility:hidden;-moz-backface-visibility:hidden;-ms-backface-visibility:hidden;backface-visibility:hidden}.swiper-container-cube .swiper-slide{visibility:hidden;-webkit-transform-origin:0 0;-moz-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0;width:100%;height:100%}.swiper-container-cube.swiper-container-rtl .swiper-slide{-webkit-transform-origin:100% 0;-moz-transform-origin:100% 0;-ms-transform-origin:100% 0;transform-origin:100% 0}.swiper-container-cube .swiper-slide-active,.swiper-container-cube .swiper-slide-next,.swiper-container-cube .swiper-slide-next+.swiper-slide,.swiper-container-cube .swiper-slide-prev{pointer-events:auto;visibility:visible}.swiper-container-cube .swiper-cube-shadow{position:absolute;left:0;bottom:0;width:100%;height:100%;background:#000;opacity:.6;-webkit-filter:blur(50px);filter:blur(50px);z-index:0}.swiper-container-fade.swiper-container-free-mode .swiper-slide{-webkit-transition-timing-function:ease-out;-moz-transition-timing-function:ease-out;-ms-transition-timing-function:ease-out;-o-transition-timing-function:ease-out;transition-timing-function:ease-out}.swiper-container-fade .swiper-slide{pointer-events:none;-webkit-transition-property:opacity;-moz-transition-property:opacity;-o-transition-property:opacity;transition-property:opacity}.swiper-container-fade .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-fade .swiper-slide-active,.swiper-container-fade .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-zoom-container{width:100%;height:100%;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-box-pack:center;-moz-box-pack:center;-ms-flex-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-moz-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;text-align:center}.swiper-zoom-container>canvas,.swiper-zoom-container>img,.swiper-zoom-container>svg{max-width:100%;max-height:100%;object-fit:contain}.swiper-scrollbar{border-radius:10px;position:relative;-ms-touch-action:none;background:rgba(0,0,0,.1)}.swiper-container-horizontal>.swiper-scrollbar{position:absolute;left:1%;bottom:3px;z-index:50;height:5px;width:98%}.swiper-container-vertical>.swiper-scrollbar{position:absolute;right:3px;top:1%;z-index:50;width:5px;height:98%}.swiper-scrollbar-drag{height:100%;width:100%;position:relative;background:rgba(0,0,0,.5);border-radius:10px;left:0;top:0}.swiper-scrollbar-cursor-drag{cursor:move}.swiper-lazy-preloader{width:42px;height:42px;position:absolute;left:50%;top:50%;margin-left:-21px;margin-top:-21px;z-index:10;-webkit-transform-origin:50%;-moz-transform-origin:50%;transform-origin:50%;-webkit-animation:swiper-preloader-spin 1s steps(12,end) infinite;-moz-animation:swiper-preloader-spin 1s steps(12,end) infinite;animation:swiper-preloader-spin 1s steps(12,end) infinite}.swiper-lazy-preloader:after{display:block;content:"";width:100%;height:100%;background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D\'0%200%20120%20120\'%20xmlns%3D\'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg\'%20xmlns%3Axlink%3D\'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink\'%3E%3Cdefs%3E%3Cline%20id%3D\'l\'%20x1%3D\'60\'%20x2%3D\'60\'%20y1%3D\'7\'%20y2%3D\'27\'%20stroke%3D\'%236c6c6c\'%20stroke-width%3D\'11\'%20stroke-linecap%3D\'round\'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.27\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.27\'%20transform%3D\'rotate(30%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.27\'%20transform%3D\'rotate(60%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.27\'%20transform%3D\'rotate(90%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.27\'%20transform%3D\'rotate(120%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.27\'%20transform%3D\'rotate(150%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.37\'%20transform%3D\'rotate(180%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.46\'%20transform%3D\'rotate(210%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.56\'%20transform%3D\'rotate(240%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.66\'%20transform%3D\'rotate(270%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.75\'%20transform%3D\'rotate(300%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.85\'%20transform%3D\'rotate(330%2060%2C60)\'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");background-position:50%;-webkit-background-size:100%;background-size:100%;background-repeat:no-repeat}.swiper-lazy-preloader-white:after{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D\'0%200%20120%20120\'%20xmlns%3D\'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg\'%20xmlns%3Axlink%3D\'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink\'%3E%3Cdefs%3E%3Cline%20id%3D\'l\'%20x1%3D\'60\'%20x2%3D\'60\'%20y1%3D\'7\'%20y2%3D\'27\'%20stroke%3D\'%23fff\'%20stroke-width%3D\'11\'%20stroke-linecap%3D\'round\'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.27\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.27\'%20transform%3D\'rotate(30%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.27\'%20transform%3D\'rotate(60%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.27\'%20transform%3D\'rotate(90%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.27\'%20transform%3D\'rotate(120%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.27\'%20transform%3D\'rotate(150%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.37\'%20transform%3D\'rotate(180%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.46\'%20transform%3D\'rotate(210%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.56\'%20transform%3D\'rotate(240%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.66\'%20transform%3D\'rotate(270%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.75\'%20transform%3D\'rotate(300%2060%2C60)\'%2F%3E%3Cuse%20xlink%3Ahref%3D\'%23l\'%20opacity%3D\'.85\'%20transform%3D\'rotate(330%2060%2C60)\'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")}@-webkit-keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg)}}@keyframes swiper-preloader-spin{100%{transform:rotate(360deg)}}.swiper[hidden]{display:none!important}.swiper[fxlayout]>.swiper-container>.swiper-wrapper>.swiper-slide{display:flex}.swiper .swiper-container{width:100%;height:100%}.swiper .swiper-container .swiper-wrapper .swiper-slide{width:100%;height:100%;max-width:100%;max-height:100%}.swiper .swiper-container .swiper-scrollbar{cursor:pointer}.swiper .swiper-container .swiper-pagination{pointer-events:none}.swiper .swiper-container .swiper-pagination .swiper-pagination-handle{margin:2px;cursor:pointer;pointer-events:all}.swiper .swiper-container .swiper-pagination .swiper-pagination-handle .swiper-pagination-bullet{pointer-events:none}.swiper .swiper-container .swiper-pagination .swiper-pagination-handle .swiper-pagination-bullet-first,.swiper .swiper-container .swiper-pagination .swiper-pagination-handle .swiper-pagination-bullet-last{border:1px solid rgba(0,0,0,.5)}.swiper .swiper-container.swiper-container-vertical>.swiper-button-prev{top:10px;left:50%;margin-top:0;margin-left:-13px;transform:rotate(90deg)}.swiper .swiper-container.swiper-container-vertical>.swiper-button-next{top:auto;bottom:10px;left:50%;margin-top:0;margin-left:-13px;transform:rotate(90deg)}.swiper .swiper-container.swiper-container-vertical>.swiper-scrollbar{width:8px;transition:width 250ms ease-in-out}.swiper .swiper-container.swiper-container-vertical>.swiper-scrollbar:hover{width:16px}.swiper .swiper-container.swiper-container-vertical>.swiper-pagination .swiper-pagination-handle{display:block}.swiper .swiper-container.swiper-container-vertical>.swiper-pagination .swiper-pagination-handle .swiper-pagination-bullet{display:inline-block}.swiper .swiper-container.swiper-container-vertical>.swiper-pagination .swiper-pagination-handle .swiper-pagination-bullet.swiper-pagination-bullet-first,.swiper .swiper-container.swiper-container-vertical>.swiper-pagination .swiper-pagination-handle .swiper-pagination-bullet.swiper-pagination-bullet-last{margin:5px -1px}.swiper .swiper-container.swiper-container-horizontal>.swiper-scrollbar{height:8px;transition:height 250ms ease-in-out}.swiper .swiper-container.swiper-container-horizontal>.swiper-scrollbar:hover{height:16px}.swiper .swiper-container.swiper-container-horizontal>.swiper-pagination .swiper-pagination-handle .swiper-pagination-bullet.swiper-pagination-bullet-first,.swiper .swiper-container.swiper-container-horizontal>.swiper-pagination .swiper-pagination-handle .swiper-pagination-bullet.swiper-pagination-bullet-last{margin:-1px 5px}'],
                    encapsulation: core_3.ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    SwiperComponent.ctorParameters = function () { return [
        { type: core_1.NgZone, },
        { type: core_3.ElementRef, },
        { type: core_1.KeyValueDiffers, },
        { type: swiper_interfaces_1.SwiperConfig, decorators: [{ type: core_2.Optional },] },
    ]; };
    SwiperComponent.propDecorators = {
        'hidden': [{ type: core_3.HostBinding, args: ['hidden',] }, { type: core_3.Input },],
        'disabled': [{ type: core_3.Input },],
        'config': [{ type: core_3.Input },],
        'runInsideAngular': [{ type: core_3.Input },],
        'indexChange': [{ type: core_3.Output },],
        's_init': [{ type: core_3.Output, args: ['init',] },],
        's_slideChangeStart': [{ type: core_3.Output, args: ['slideChangeStart',] },],
        's_slideChangeEnd': [{ type: core_3.Output, args: ['slideChangeEnd',] },],
        's_slideNextStart': [{ type: core_3.Output, args: ['slideNextStart',] },],
        's_slideNextEnd': [{ type: core_3.Output, args: ['slideNextEnd',] },],
        's_slidePrevStart': [{ type: core_3.Output, args: ['slidePrevStart',] },],
        's_slidePrevEnd': [{ type: core_3.Output, args: ['slidePrevEnd',] },],
        's_transitionStart': [{ type: core_3.Output, args: ['transitionStart',] },],
        's_transitionEnd': [{ type: core_3.Output, args: ['transitionEnd',] },],
        's_touchStart': [{ type: core_3.Output, args: ['touchStart',] },],
        's_touchMove': [{ type: core_3.Output, args: ['touchMove',] },],
        's_touchMoveOpposite': [{ type: core_3.Output, args: ['touchMoveOpposite',] },],
        's_sliderMove': [{ type: core_3.Output, args: ['sliderMove',] },],
        's_touchEnd': [{ type: core_3.Output, args: ['touchEnd',] },],
        's_click': [{ type: core_3.Output, args: ['click',] },],
        's_tap': [{ type: core_3.Output, args: ['tap',] },],
        's_doubleTap': [{ type: core_3.Output, args: ['doubleTap',] },],
        's_imagesReady': [{ type: core_3.Output, args: ['imagesReady',] },],
        's_progress': [{ type: core_3.Output, args: ['progress',] },],
        's_reachBeginning': [{ type: core_3.Output, args: ['reachBeginning',] },],
        's_reachEnd': [{ type: core_3.Output, args: ['reachEnd',] },],
        's_destroy': [{ type: core_3.Output, args: ['destroy',] },],
        's_setTranslate': [{ type: core_3.Output, args: ['setTranslate',] },],
        's_setTransition': [{ type: core_3.Output, args: ['setTransition',] },],
        's_autoplay': [{ type: core_3.Output, args: ['autoplay',] },],
        's_autoplayStart': [{ type: core_3.Output, args: ['autoplayStart',] },],
        's_autoplayStop': [{ type: core_3.Output, args: ['autoplayStop',] },],
        's_lazyImageLoad': [{ type: core_3.Output, args: ['lazyImageLoad',] },],
        's_lazyImageReady': [{ type: core_3.Output, args: ['lazyImageReady',] },],
        's_paginationRendered': [{ type: core_3.Output, args: ['paginationRendered',] },],
        's_scroll': [{ type: core_3.Output, args: ['scroll',] },],
        'swiperWrapper': [{ type: core_3.ViewChild, args: ['swiperWrapper',] },],
        'useSwiperClass': [{ type: core_3.HostBinding, args: ['class.swiper',] }, { type: core_3.Input },],
    };
    return SwiperComponent;
}());
exports.SwiperComponent = SwiperComponent;
//# sourceMappingURL=swiper.component.js.map