package com.example

import android.annotation.SuppressLint
import android.content.pm.ActivityInfo
import android.content.Context
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.View
import android.view.WindowManager
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
import android.webkit.RenderProcessGoneDetail
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {

    private var gameWebView: WebView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
        enableEdgeToEdge()

        // Keep screen awake during 3D action gameplay
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        // Immersive Sticky Full-screen for cinematic gaming experience
        val windowInsetsController = WindowCompat.getInsetsController(window, window.decorView)
        windowInsetsController.systemBarsBehavior =
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        windowInsetsController.hide(WindowInsetsCompat.Type.systemBars())

        setContent {
            MyApplicationTheme(darkTheme = true) {
                GameScreen(
                    onWebViewReady = { webView -> gameWebView = webView }
                )
            }
        }
    }

    override fun onResume() {
        super.onResume()
        gameWebView?.onResume()
        gameWebView?.evaluateJavascript("if (window.soundEngine) window.soundEngine.resume();", null)
    }

    override fun onPause() {
        super.onPause()
        gameWebView?.onPause()
    }

    override fun onDestroy() {
        gameWebView?.destroy()
        gameWebView = null
        super.onDestroy()
    }
}

class AndroidNinjaBridge(private val context: Context) {
    @JavascriptInterface
    fun vibrate(durationMs: Long) {
        val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator ?: return
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(
                VibrationEffect.createOneShot(
                    durationMs.coerceIn(10, 400),
                    VibrationEffect.DEFAULT_AMPLITUDE
                )
            )
        } else {
            @Suppress("DEPRECATION")
            vibrator.vibrate(durationMs.coerceIn(10, 400))
        }
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun GameScreen(
    onWebViewReady: (WebView) -> Unit
) {
    val context = LocalContext.current
    var webViewRef by remember { mutableStateOf<WebView?>(null) }

    // Hardware back press toggles pause in game
    BackHandler {
        webViewRef?.evaluateJavascript(
            "if (window.game) { window.game.togglePause(); }",
            null
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF08090D))
            .testTag("game_screen_container")
    ) {
        AndroidView(
            modifier = Modifier
                .fillMaxSize()
                .testTag("game_webview"),
            factory = { ctx ->
                WebView(ctx).apply {
                    layoutParams = android.view.ViewGroup.LayoutParams(
                        android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                        android.view.ViewGroup.LayoutParams.MATCH_PARENT
                    )

                    // Use default layer type so WebView draws directly into the window's hardware-accelerated surface
                    // without allocating an offscreen DRI RenderNode (which triggers Mesa "Failed to open rendernode" error)
                    setLayerType(View.LAYER_TYPE_NONE, null)
                    setBackgroundColor(android.graphics.Color.parseColor("#08090D"))

                    settings.apply {
                        javaScriptEnabled = true
                        domStorageEnabled = true
                        databaseEnabled = true
                        mediaPlaybackRequiresUserGesture = false
                        allowFileAccess = true
                        allowContentAccess = true
                        useWideViewPort = true
                        loadWithOverviewMode = true
                        cacheMode = WebSettings.LOAD_DEFAULT
                    }

                    addJavascriptInterface(AndroidNinjaBridge(ctx), "AndroidBridge")

                    webChromeClient = object : WebChromeClient() {
                        override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                            Log.d(
                                "KadayaGame",
                                "${consoleMessage?.message()} [${consoleMessage?.sourceId()}:${consoleMessage?.lineNumber()}]"
                            )
                            return true
                        }
                    }
                    webViewClient = object : WebViewClient() {
                        override fun onPageFinished(view: WebView?, url: String?) {
                            super.onPageFinished(view, url)
                            view?.evaluateJavascript(
                                "console.log('KADAYA: Game loaded successfully');",
                                null
                            )
                        }

                        override fun onRenderProcessGone(view: WebView?, detail: RenderProcessGoneDetail?): Boolean {
                            Log.w("KadayaGame", "WebView render process gone, didCrash=${detail?.didCrash()}")
                            return true
                        }
                    }

                    // Load local bundled 3D Three.js game
                    loadUrl("file:///android_asset/game/index.html")

                    webViewRef = this
                    onWebViewReady(this)
                }
            },
            update = {
                // View updates if necessary
            }
        )
    }

    DisposableEffect(Unit) {
        onDispose {
            webViewRef = null
        }
    }
}
