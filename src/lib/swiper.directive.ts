import * as Swiper from 'swiper';

import { NgZone, SimpleChanges, KeyValueDiffers } from '@angular/core';
import { Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Directive, Optional, OnInit, DoCheck, OnDestroy, OnChanges } from '@angular/core';

import { SwiperConfig, SwiperConfigInterface, SwiperEvents } from './swiper.interfaces';

@Directive({
  selector: '[swiper]'
})
export class SwiperDirective implements OnInit, DoCheck, OnDestroy, OnChanges {
  public swiper: any;

  public configDiff: any;

  @Input() disabled: boolean = false;

  @Input() runInsideAngular: boolean = false;

  @Input('swiper') config: SwiperConfigInterface;

  @Output('init'              ) s_init                = new EventEmitter<any>();
  @Output('slideChangeStart'  ) s_slideChangeStart    = new EventEmitter<any>();
  @Output('slideChangeEnd'    ) s_slideChangeEnd      = new EventEmitter<any>();
  @Output('slideNextStart'    ) s_slideNextStart      = new EventEmitter<any>();
  @Output('slideNextEnd'      ) s_slideNextEnd        = new EventEmitter<any>();
  @Output('slidePrevStart'    ) s_slidePrevStart      = new EventEmitter<any>();
  @Output('slidePrevEnd'      ) s_slidePrevEnd        = new EventEmitter<any>();
  @Output('transitionStart'   ) s_transitionStart     = new EventEmitter<any>();
  @Output('transitionEnd'     ) s_transitionEnd       = new EventEmitter<any>();
  @Output('touchStart'        ) s_touchStart          = new EventEmitter<any>();
  @Output('touchMove'         ) s_touchMove           = new EventEmitter<any>();
  @Output('touchMoveOpposite' ) s_touchMoveOpposite   = new EventEmitter<any>();
  @Output('sliderMove'        ) s_sliderMove          = new EventEmitter<any>();
  @Output('touchEnd'          ) s_touchEnd            = new EventEmitter<any>();
  @Output('click'             ) s_click               = new EventEmitter<any>();
  @Output('tap'               ) s_tap                 = new EventEmitter<any>();
  @Output('doubleTap'         ) s_doubleTap           = new EventEmitter<any>();
  @Output('imagesReady'       ) s_imagesReady         = new EventEmitter<any>();
  @Output('progress'          ) s_progress            = new EventEmitter<any>();
  @Output('reachBeginning'    ) s_reachBeginning      = new EventEmitter<any>();
  @Output('reachEnd'          ) s_reachEnd            = new EventEmitter<any>();
  @Output('destroy'           ) s_destroy             = new EventEmitter<any>();
  @Output('setTranslate'      ) s_setTranslate        = new EventEmitter<any>();
  @Output('setTransition'     ) s_setTransition       = new EventEmitter<any>();
  @Output('autoplay'          ) s_autoplay            = new EventEmitter<any>();
  @Output('autoplayStart'     ) s_autoplayStart       = new EventEmitter<any>();
  @Output('autoplayStop'      ) s_autoplayStop        = new EventEmitter<any>();
  @Output('lazyImageLoad'     ) s_lazyImageLoad       = new EventEmitter<any>();
  @Output('lazyImageReady'    ) s_lazyImageReady      = new EventEmitter<any>();
  @Output('paginationRendered') s_paginationRendered  = new EventEmitter<any>();
  @Output('scroll'            ) s_scroll              = new EventEmitter<any>();

  constructor(private zone: NgZone, private elementRef: ElementRef, private differs : KeyValueDiffers,
    @Optional() private defaults: SwiperConfig) {}

  ngOnInit() {
    let element = this.elementRef.nativeElement;
    let options = new SwiperConfig(this.defaults);

    options.assign(this.config); // Custom config

    if (this.runInsideAngular) {
      this.swiper = new Swiper(element, options);
    } else {
      this.zone.runOutsideAngular(() => {
        this.swiper = new Swiper(element, options);
      });
    }

    // Add native swiper event handling
    SwiperEvents.forEach((eventName) => {
      let self = this;

      this.swiper.on(eventName, function(event) {
        self[`s_${eventName}`].emit(event);
      });
    });

    if (!this.configDiff) {
      this.configDiff = this.differs.find(this.config || {}).create(null);
    }
  }

  ngDoCheck() {
    let changes = this.configDiff.diff(this.config || {});

    if (changes) {
      this.ngOnDestroy();

      // This is needed for the styles to update properly
      setTimeout(() => {
        this.ngOnInit();

        this.update();
      }, 0);
    }
  }

  ngOnDestroy() {
    if (this.swiper) {
      if (this.runInsideAngular) {
        this.swiper.destroy(true, true);
      } else {
        this.zone.runOutsideAngular(() => {
          this.swiper.destroy(true, true);
        });
      }

      this.swiper = null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.swiper && changes['disabled']) {
      if (changes['disabled'].currentValue != changes['disabled'].previousValue) {
        if (changes['disabled'].currentValue === true) {
          this.swiper.lockSwipes();
        } else if (changes['disabled'].currentValue === false) {
          this.swiper.unlockSwipes();
        }
      }
    }
  }

  update(updateTranslate?: boolean) {
    setTimeout(() => {
      if (this.swiper) {
        if (this.runInsideAngular) {
          this.swiper.update(updateTranslate);
        } else {
          this.zone.runOutsideAngular(() => {
            this.swiper.update(updateTranslate);
          });
        }
      }
    }, 0);
  }
}
