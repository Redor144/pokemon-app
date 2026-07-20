import ExpoModulesCore
import UIKit

public class AnimatedTextModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AnimatedText")

    View(AnimatedTextView.self) {
      Prop("value") { (view: AnimatedTextView, prop: Double) in
        view.updateValue(value: prop)
      }
      Prop("color") { (view: AnimatedTextView, color: UIColor) in
        view.updateColor(color)
      }
    }
  }
}
