package expo.modules.animatedtext

import android.graphics.Color
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AnimatedTextModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AnimatedText")

    View(AnimatedTextView::class) {
      Prop("value") { view: AnimatedTextView, value: Double ->
        view.updateValue(value)
      }
      Prop("color") { view: AnimatedTextView, color: Color ->
        view.updateColor(color.toArgb())
      }
    }
  }
}
