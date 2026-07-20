import ExpoModulesCore
import SwiftUI
import UIKit

class AnimatedTextView: ExpoView {
  private let model = AnimatedTextModel()
  private let hostingController: UIHostingController<AnimatedSwiftUIView>

  required init(appContext: AppContext? = nil) {
    hostingController = UIHostingController(rootView: AnimatedSwiftUIView(model: model))
    hostingController.view.backgroundColor = .clear
    super.init(appContext: appContext)
    addSubview(hostingController.view)
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    hostingController.view.frame = bounds
  }

  func updateValue(value: Double) {
    withAnimation { model.value = Int(value.rounded()) }
  }

  func updateColor(_ color: UIColor) {
    model.color = Color(uiColor: color)
  }
}
