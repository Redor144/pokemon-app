import { NativeModule, requireNativeModule } from 'expo';

declare class AnimatedTextModule extends NativeModule<{}> {}

export default requireNativeModule<AnimatedTextModule>('AnimatedText');
