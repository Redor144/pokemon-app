package expo.modules.animatedtext

import android.content.Context
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.platform.ViewCompositionStrategy

class AnimatedTextView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private var valueState by mutableStateOf(0.0)
  private var textColor by mutableStateOf(Color.Black)

  init {
    val composeView = ComposeView(context).apply {
      layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
      setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)
      setContent {
        AnimatedText(value = valueState, color = textColor)
      }
    }
    addView(composeView)
  }
  

  fun updateValue(value: Double) {
    valueState = value
  }

  fun updateColor(color: Int) {
    textColor = Color(color)
  }
}
