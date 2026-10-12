package org.kingdomoverflow.kiosk;

import android.app.Activity;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {
    private static final String HOME_URL =
            "https://overflow-website-git-5880cd-tomlambertstlukes-creates-projects.vercel.app/check-in?kiosk=android";

    private final Handler handler = new Handler(Looper.getMainLooper());
    private FrameLayout root;
    private WebView mainWebView;
    private FrameLayout popupLayer;
    private WebView popupWebView;
    private Button homeButton;
    private boolean returnScheduled = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        hideSystemUi();

        root = new FrameLayout(this);
        root.setBackgroundColor(Color.parseColor("#141D26"));
        setContentView(root);

        mainWebView = new WebView(this);
        configureWebView(mainWebView, true);
        root.addView(mainWebView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        createFallbackHomeButton();
        createPopupLayer();

        mainWebView.loadUrl(HOME_URL);
    }

    private void configureWebView(WebView webView, boolean primary) {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setSupportMultipleWindows(primary);
        settings.setUserAgentString(settings.getUserAgentString() + " KingdomOverflowKiosk/1.0");

        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);

        webView.setBackgroundColor(Color.WHITE);
        webView.setWebViewClient(new KioskWebViewClient(primary));

        if (primary) {
            webView.addJavascriptInterface(new CheckInBridge(), "KOKiosk");
            webView.setWebChromeClient(new WebChromeClient() {
                @Override
                public boolean onCreateWindow(
                        WebView view,
                        boolean isDialog,
                        boolean isUserGesture,
                        Message resultMsg
                ) {
                    showPopup();
                    WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
                    transport.setWebView(popupWebView);
                    resultMsg.sendToTarget();
                    return true;
                }
            });
        } else {
            webView.setWebChromeClient(new WebChromeClient());
        }
    }

    private void createFallbackHomeButton() {
        homeButton = new Button(this);
        homeButton.setText("KO Home");
        homeButton.setTextColor(Color.WHITE);
        homeButton.setTextSize(13f);
        homeButton.setAllCaps(false);
        homeButton.setBackgroundColor(Color.parseColor("#C51F5D"));
        homeButton.setVisibility(View.GONE);
        homeButton.setOnClickListener(v -> returnToHome());

        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(dp(104), dp(48));
        params.gravity = Gravity.TOP | Gravity.END;
        params.topMargin = dp(14);
        params.rightMargin = dp(14);
        root.addView(homeButton, params);
    }

    private void createPopupLayer() {
        popupLayer = new FrameLayout(this);
        popupLayer.setBackgroundColor(Color.parseColor("#101821"));
        popupLayer.setVisibility(View.GONE);

        LinearLayout column = new LinearLayout(this);
        column.setOrientation(LinearLayout.VERTICAL);
        popupLayer.addView(column, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        LinearLayout toolbar = new LinearLayout(this);
        toolbar.setGravity(Gravity.CENTER_VERTICAL);
        toolbar.setPadding(dp(16), dp(10), dp(12), dp(10));
        toolbar.setBackgroundColor(Color.parseColor("#141D26"));

        TextView title = new TextView(this);
        title.setText("ChurchSuite");
        title.setTextColor(Color.WHITE);
        title.setTextSize(16f);
        title.setTypeface(null, android.graphics.Typeface.BOLD);
        toolbar.addView(title, new LinearLayout.LayoutParams(0, dp(52), 1f));

        Button close = new Button(this);
        close.setText("Back to KO");
        close.setTextColor(Color.WHITE);
        close.setTextSize(13f);
        close.setAllCaps(false);
        close.setBackgroundColor(Color.parseColor("#C51F5D"));
        close.setOnClickListener(v -> closePopup());
        toolbar.addView(close, new LinearLayout.LayoutParams(dp(118), dp(46)));

        column.addView(toolbar, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(72)
        ));

        popupWebView = new WebView(this);
        configureWebView(popupWebView, false);
        column.addView(popupWebView, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                0,
                1f
        ));

        root.addView(popupLayer, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
    }

    private void showPopup() {
        popupWebView.loadUrl("about:blank");
        popupLayer.setVisibility(View.VISIBLE);
        popupLayer.bringToFront();
    }

    private void closePopup() {
        popupWebView.loadUrl("about:blank");
        popupLayer.setVisibility(View.GONE);
        mainWebView.requestFocus();
    }

    private void returnToHome() {
        returnScheduled = false;
        homeButton.setVisibility(View.GONE);
        mainWebView.loadUrl(HOME_URL);
    }

    private void scheduleReturnAfterSuccess() {
        if (returnScheduled) return;
        returnScheduled = true;
        Toast.makeText(this, "Checked in", Toast.LENGTH_SHORT).show();
        handler.postDelayed(this::returnToHome, 1100);
    }

    private void injectSuccessWatcher(WebView webView) {
        String javascript =
                "(function(){" +
                "if(window.__koCheckinWatcher){return;}" +
                "window.__koCheckinWatcher=true;" +
                "var phrases=[" +
                "\"you're checked in\",\"you’re checked in\",\"you have been checked in\"," +
                "\"checked in successfully\",\"successfully checked in\"," +
                "\"check-in successful\",\"check in successful\"," +
                "\"check-in complete\",\"check in complete\"" +
                "];" +
                "function check(){" +
                "var text=((document.body&&document.body.innerText)||'').toLowerCase();" +
                "for(var i=0;i<phrases.length;i++){" +
                "if(text.indexOf(phrases[i])!==-1){window.KOKiosk.checkInComplete();return;}" +
                "}" +
                "}" +
                "new MutationObserver(check).observe(document.documentElement,{subtree:true,childList:true,characterData:true});" +
                "window.setInterval(check,500);check();" +
                "})();";
        webView.evaluateJavascript(javascript, null);
    }

    private boolean isAllowedUrl(String url) {
        if (url == null || url.isEmpty() || url.equals("about:blank")) return true;
        Uri uri = Uri.parse(url);
        String scheme = uri.getScheme();
        if (!"https".equalsIgnoreCase(scheme) && !"http".equalsIgnoreCase(scheme)) return false;
        String host = uri.getHost();
        if (host == null) return false;
        host = host.toLowerCase();
        return host.equals("kingdomoverflow.org")
                || host.endsWith(".kingdomoverflow.org")
                || host.endsWith(".vercel.app")
                || host.equals("churchsuite.com")
                || host.endsWith(".churchsuite.com");
    }

    private boolean isChurchSuite(String url) {
        if (url == null) return false;
        String host = Uri.parse(url).getHost();
        return host != null && (host.equalsIgnoreCase("churchsuite.com")
                || host.toLowerCase().endsWith(".churchsuite.com"));
    }

    private boolean isCheckInUrl(String url) {
        return url != null
                && isChurchSuite(url)
                && url.toLowerCase().contains("/checkin");
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private void hideSystemUi() {
        getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN
        );
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
    }

    @Override
    protected void onResume() {
        super.onResume();
        hideSystemUi();
    }

    @Override
    public void onBackPressed() {
        if (popupLayer.getVisibility() == View.VISIBLE) {
            closePopup();
            return;
        }

        String currentUrl = mainWebView.getUrl();
        if (isChurchSuite(currentUrl)) {
            returnToHome();
            return;
        }

        if (mainWebView.canGoBack()) {
            mainWebView.goBack();
        } else {
            returnToHome();
        }
    }

    @Override
    protected void onDestroy() {
        if (popupWebView != null) popupWebView.destroy();
        if (mainWebView != null) mainWebView.destroy();
        super.onDestroy();
    }

    private final class KioskWebViewClient extends WebViewClient {
        private final boolean primary;

        private KioskWebViewClient(boolean primary) {
            this.primary = primary;
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            String url = request.getUrl().toString();
            return !isAllowedUrl(url);
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return !isAllowedUrl(url);
        }

        @Override
        public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            if (primary) {
                homeButton.setVisibility(isChurchSuite(url) ? View.VISIBLE : View.GONE);
            }
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            if (primary) {
                homeButton.setVisibility(isChurchSuite(url) ? View.VISIBLE : View.GONE);
                if (isCheckInUrl(url)) {
                    injectSuccessWatcher(view);
                }
            }
        }
    }

    private final class CheckInBridge {
        @JavascriptInterface
        public void checkInComplete() {
            handler.post(MainActivity.this::scheduleReturnAfterSuccess);
        }
    }
}
