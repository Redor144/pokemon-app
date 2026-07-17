import ExpoModulesCore
import UIKit

public class PrivacyProtectorModule: Module {

  private var secureTextField: UITextField?
  private var originalParent: CALayer?

  private static var keyWindow: UIWindow? {
    UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap(\.windows)
      .first(where: \.isKeyWindow)
  }

  public func definition() -> ModuleDefinition {
    Name("PrivacyProtector")

    AsyncFunction("enablePrivacyProtector") {
      guard let window = Self.keyWindow else { return }
      guard self.secureTextField == nil else { return }

      let textField = UITextField()
      textField.isSecureTextEntry = true
      textField.frame = window.bounds
      textField.isUserInteractionEnabled = false

      self.originalParent = window.layer.superlayer
      window.layer.superlayer?.addSublayer(textField.layer)
      if let secureLayer = textField.layer.sublayers?.first {
        window.layer.removeFromSuperlayer()
        secureLayer.addSublayer(window.layer)
      }

      self.secureTextField = textField
    }.runOnQueue(.main)

    AsyncFunction("disablePrivacyProtector") {
      guard let textField = self.secureTextField,
            let window = Self.keyWindow,
            let originalParent = self.originalParent else { return }
      window.layer.removeFromSuperlayer()
      originalParent.addSublayer(window.layer)
      textField.layer.removeFromSuperlayer()
      self.secureTextField = nil
      self.originalParent = nil
    }.runOnQueue(.main)
  }
}
