#import "AppDelegate.h"
#import <Firebase.h>

#import <React/RCTBundleURLProvider.h>
#import <RCTDefaultReactNativeFactoryDelegate.h>
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>

/**
 * Separate delegate class for RCTReactNativeFactory.
 * We intentionally do NOT use AppDelegate itself as the factory delegate,
 * because Firebase swizzles AppDelegate (replacing self with GUL_AppDelegate-...)
 * which causes a crash when setDependencyProvider: is called on the swizzled instance.
 */
@interface RNFactoryDelegate : RCTDefaultReactNativeFactoryDelegate
@end

@implementation RNFactoryDelegate

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
  return [self bundleURL];
}

- (NSURL *)bundleURL {
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end

@implementation AppDelegate {
  // Keep a strong reference to prevent ARC from releasing the delegate
  RNFactoryDelegate *_rnDelegate;
}

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  // Must configure Firebase before React Native initializes
  [FIRApp configure];

  // Create the separate delegate (isolated from Firebase swizzling of AppDelegate)
  _rnDelegate = [RNFactoryDelegate new];
  _rnDelegate.dependencyProvider = [RCTAppDependencyProvider new];

  self.reactNativeFactory = [[RCTReactNativeFactory alloc] initWithDelegate:_rnDelegate];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];

  [self.reactNativeFactory startReactNativeWithModuleName:@"ALP HRM"
                                                 inWindow:self.window
                                            launchOptions:launchOptions];

  return YES;
}

@end
