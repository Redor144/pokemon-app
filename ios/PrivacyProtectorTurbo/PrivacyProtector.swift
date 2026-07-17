//
//  PrivacyProtector.swift
//  pokemonapp
//
//  Created by Kacper Bieniasz on 14/07/2026.
//

import Foundation
import UIKit

@objc(PrivacyProtectorTurbo)
@objcMembers
public class PrivacyProtectorTurbo: NSObject {

  private var secureTextField: UITextField?
  private var originalParent: CALayer?

  private static var keyWindow: UIWindow? {
    UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap(\.windows)
      .first(where: \.isKeyWindow)
  }


  public func enablePrivacyProtector() {
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
  }

  public func disablePrivacyProtector() {
    guard let textField = self.secureTextField,
          let window = Self.keyWindow,
          let originalParent = self.originalParent else { return }
    window.layer.removeFromSuperlayer()
    originalParent.addSublayer(window.layer)
    textField.layer.removeFromSuperlayer()
    self.secureTextField = nil
    self.originalParent = nil
  }
}
