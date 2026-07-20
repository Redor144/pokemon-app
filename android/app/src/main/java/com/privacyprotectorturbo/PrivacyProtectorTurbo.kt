package com.privacyprotectorturbo

import android.view.WindowManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil

class PrivacyProtectorTurboModule(
  reactContext: ReactApplicationContext,
) : NativePrivacyProtectorTurboSpec(reactContext) {

  override fun enablePrivacyProtector(promise: Promise) {
    UiThreadUtil.runOnUiThread {
      reactApplicationContext.currentActivity?.window?.setFlags(
        WindowManager.LayoutParams.FLAG_SECURE,
        WindowManager.LayoutParams.FLAG_SECURE,
      )
      promise.resolve(null)
    }
  }

  override fun disablePrivacyProtector(promise: Promise) {
    UiThreadUtil.runOnUiThread {
      reactApplicationContext.currentActivity?.window?.clearFlags(
        WindowManager.LayoutParams.FLAG_SECURE,
      )
      promise.resolve(null)
    }
  }
}