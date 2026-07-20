package expo.modules.animatedtext

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.SizeTransform
import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.tween
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private data class Digit(
  val digitChar: Char,
  val fullNumber: Int,
  val place: Int,
) {
  override fun equals(other: Any?): Boolean {
    return when (other) {
      is Digit -> digitChar == other.digitChar
      else -> super.equals(other)
    }
  }

  override fun hashCode(): Int = digitChar.hashCode()
}

private operator fun Digit.compareTo(other: Digit): Int {
  return fullNumber.compareTo(other.fullNumber)
}

@Composable
fun AnimatedText(
  value: Double,
  color: Color,
  modifier: Modifier = Modifier,
) {
  val intValue = value.toInt()
  val textStyle = TextStyle(
    fontSize = 34.sp,
    fontWeight = FontWeight.Bold,
    color = color,
    fontFeatureSettings = "tnum",
    textAlign = TextAlign.Center,
  )

  Box(
    modifier = modifier.fillMaxSize(),
    contentAlignment = Alignment.CenterEnd,
  ) {
    Row(
      modifier = Modifier.animateContentSize(animationSpec = tween(400)),
      horizontalArrangement = Arrangement.Center,
      verticalAlignment = Alignment.CenterVertically,
    ) {
      intValue
        .toString()
        .mapIndexed { index, char -> Digit(char, intValue, index) }
        .forEach { digit ->
          AnimatedContent(
            targetState = digit,
            transitionSpec = {
              if (targetState > initialState) {
                slideInVertically(animationSpec = tween(400)) { -it } togetherWith
                  slideOutVertically(animationSpec = tween(400)) { it }
              } else {
                slideInVertically(animationSpec = tween(400)) { it } togetherWith
                  slideOutVertically(animationSpec = tween(400)) { -it }
              }.using(SizeTransform(clip = false))
            },
            label = "digit_${digit.place}",
          ) { animatedDigit ->
            val blurRadius by transition.animateFloat(
              transitionSpec = { tween(400) },
              label = "blur_${animatedDigit.place}",
            ) { state ->
              if (state == transition.targetState) 0f else 8f
            }

            Text(
              text = animatedDigit.digitChar.toString(),
              style = textStyle,
              softWrap = false,
              modifier = Modifier.blur(blurRadius.dp),
            )
          }
        }
    }
  }
}
