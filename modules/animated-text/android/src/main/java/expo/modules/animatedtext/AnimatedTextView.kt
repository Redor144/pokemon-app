package expo.modules.animatedtext

import android.content.Context
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.platform.ViewCompositionStrategy
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class AnimatedTextView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private var value by mutableStateOf(0.0)
  private var textColor by mutableStateOf(Color.Black)

  private val composeView = ComposeView(context).apply {
    layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)
    setContent {
      AnimatedText(value = value, color = textColor)
    }
  }

  init {
    addView(composeView)
  }

  override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
    if (!isAttachedToWindow) {
      setMeasuredDimension(
        MeasureSpec.getSize(widthMeasureSpec),
        MeasureSpec.getSize(heightMeasureSpec),
      )
      return
    }
    super.onMeasure(widthMeasureSpec, heightMeasureSpec)
  }

  fun updateValue(value: Double) {
    this.value = value
  }

  fun updateColor(color: Int) {
    textColor = Color(color)
  }
}