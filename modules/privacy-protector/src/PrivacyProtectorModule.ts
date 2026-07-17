import { NativeModule, requireNativeModule } from 'expo';

declare class PrivacyProtectorModule extends NativeModule {
  enablePrivacyProtector(): Promise<void>;
  disablePrivacyProtector(): Promise<void>;
}

export default requireNativeModule<PrivacyProtectorModule>('PrivacyProtector');
