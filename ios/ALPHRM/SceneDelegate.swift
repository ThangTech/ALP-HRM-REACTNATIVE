import UIKit
import React

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
    guard let windowScene = (scene as? UIWindowScene) else { return }
    
    let window = UIWindow(windowScene: windowScene)
    self.window = window
    
    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate,
          let factory = appDelegate.reactNativeFactory else {
      fatalError("[SceneDelegate] reactNativeFactory is nil when scene connects. AppDelegate may not have finished setup.")
    }
    
    // Assign window back to AppDelegate for compatibility
    appDelegate.window = window
    
    factory.startReactNative(
      withModuleName: "ALP HRM",
      in: window,
      launchOptions: appDelegate.initialLaunchOptions
    )
  }

  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    if let url = URLContexts.first?.url {
      RCTLinkingManager.application(UIApplication.shared, open: url, options: [:])
    }
  }

  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    RCTLinkingManager.application(UIApplication.shared, continue: userActivity, restorationHandler: { _ in })
  }
}
