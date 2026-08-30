import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          'ios-src'?: string;
          alt?: string;
          ar?: boolean | string;
          'ar-modes'?: string;
          'ar-scale'?: string;
          'ar-placement'?: string;
          'camera-controls'?: boolean | string;
          'touch-action'?: string;
          'auto-rotate'?: boolean | string;
          'auto-rotate-delay'?: string | number;
          'rotation-per-second'?: string;
          'shadow-intensity'?: string | number;
          'shadow-softness'?: string | number;
          exposure?: string | number;
          'environment-image'?: string;
          'skybox-image'?: string;
          poster?: string;
          loading?: 'auto' | 'lazy' | 'eager';
          reveal?: 'auto' | 'interaction' | 'manual';
          crossorigin?: 'anonymous' | 'use-credentials';
          'interaction-prompt'?: 'auto' | 'when-focused' | 'none';
          'interaction-prompt-style'?: 'wiggle' | 'basic';
          'camera-orbit'?: string;
          'field-of-view'?: string;
          'min-camera-orbit'?: string;
          'max-camera-orbit'?: string;
          'min-field-of-view'?: string;
          'max-field-of-view'?: string;
          bounds?: string;
          seamless?: boolean | string;
          slot?: string;
        },
        HTMLElement
      >;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}
