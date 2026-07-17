import { registerWebModule, NativeModule } from 'expo';

// PrivacyProtectorModule is not available on the web platform.
class PrivacyProtectorModule extends NativeModule {
  enablePrivacyProtector(): void {}
  disablePrivacyProtector(): void {}
}

export default registerWebModule(PrivacyProtectorModule, 'PrivacyProtectorModule');
