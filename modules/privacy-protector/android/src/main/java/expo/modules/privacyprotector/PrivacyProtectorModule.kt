package expo.modules.privacyprotector

import android.view.WindowManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.functions.Queues

class PrivacyProtectorModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("PrivacyProtector")

    AsyncFunction("enablePrivacyProtector") {
      appContext.currentActivity?.window?.setFlags(
        WindowManager.LayoutParams.FLAG_SECURE,
        WindowManager.LayoutParams.FLAG_SECURE,
      )
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("disablePrivacyProtector") {
      appContext.currentActivity?.window?.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
    }.runOnQueue(Queues.MAIN)
  }
}
