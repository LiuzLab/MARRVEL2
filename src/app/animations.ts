import { trigger, state, style, transition, animate, group } from '@angular/animations';

export const Animations = {
  slideIn: trigger('slideIn', [
    transition(':enter', [
      style({ transform: 'translateX(-100%)', 'max-width': '0%' }),
      animate('200ms ease-in', style({ transform: 'translateX(0%)', 'max-width': '100%' }))
    ])
  ]),
  slideInOut: trigger('slideInOut', [
    transition(':enter', [
      style({ transform: 'translateX(-100%)' }),
      animate('200ms ease-in', style({ transform: 'translateX(0%)' }))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ transform: 'translateX(-100%)' }))
    ])
  ]),
  slideVInOut: trigger('slideVInOut', [
    transition(':enter', [
      style({ transform: 'translateY(-100%)' }),
      animate('200ms ease-in', style({ transform: 'translateY(0%)' }))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ transform: 'translateY(-100%)' }))
    ])
  ]),
  toggle: [
    trigger('toggle', [
      state('true', style({ opacity: 1 })),
      state('false', style({ opacity: 0, height: '0px' })),
      transition('true <=> false', animate(300)),
    ])
  ],
  fadeInOut: [
    trigger('fadeInOut', [
      state('true', style({ opacity: 1 })),
      state('false', style({ opacity: 0 })),
      transition('true <=> false', animate(300)),
    ])
  ]
};
