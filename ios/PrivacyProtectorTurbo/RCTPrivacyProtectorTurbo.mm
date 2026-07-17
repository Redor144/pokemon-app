//
//  RCTPrivacyProtectorTurbo.mm
//  pokemonapp
//
//  Created by Kacper Bieniasz on 14/07/2026.
//

#import "RCTPrivacyProtectorTurbo.h"
#import <React/RCTUtils.h>

@interface NSObject (PrivacyProtectorTurboMethods)
- (void)enablePrivacyProtector;
- (void)disablePrivacyProtector;
@end

@implementation RCTPrivacyProtectorTurbo {
  id privacyProtector;
}

+ (NSString *)moduleName {
  return @"PrivacyProtectorTurbo";
}

- (id)init {
  if (self = [super init]) {
    Class cls = NSClassFromString(@"PrivacyProtectorTurbo");
    privacyProtector = cls ? [cls new] : nil;
  }
  return self;
}
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativePrivacyProtectorTurboSpecJSI>(params);
}
- (void)enablePrivacyProtector:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self->privacyProtector enablePrivacyProtector];
    resolve(nil);
  });
}
- (void)disablePrivacyProtector:(RCTPromiseResolveBlock)resolve
                         reject:(RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self->privacyProtector disablePrivacyProtector];
    resolve(nil);
  });
}
@end
