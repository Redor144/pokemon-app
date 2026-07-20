import SwiftUI

final class AnimatedTextModel: ObservableObject {
  @Published var value: Int = 0
  @Published var color: Color = .primary
}

struct AnimatedSwiftUIView: View {
  @ObservedObject var model: AnimatedTextModel

  var body: some View {
    Text(verbatim: String(model.value))
      .contentTransition(.numericText())
      .foregroundColor(model.color)
      .font(.largeTitle)
      .bold()
      .monospacedDigit()
      .lineLimit(1)
      .fixedSize(horizontal: true, vertical: false)
  }
}
