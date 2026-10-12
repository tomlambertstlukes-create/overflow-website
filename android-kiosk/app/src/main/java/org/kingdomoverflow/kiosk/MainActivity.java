package org.kingdomoverflow.kiosk;

import android.app.Activity;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Space;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {
    private static final String CHECKIN_URL = "https://kingdomoverflow.churchsuite.com/checkin";
    private static final String JOIN_FORM_URL = "https://kingdomoverflow.churchsuite.com/-/forms/zqtiiald";
    private static final String PREFS = "ko-kiosk";
    private static final String SESSION_READY = "session-ready";

    private final Handler handler = new Handler(Looper.getMainLooper());
    private FrameLayout root;
    private WebView webView;
    private Button floatingHomeButton;
    private SharedPreferences prefs;
    private boolean returnScheduled = false;
    private boolean showingHome = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        hideSystemUi();

        prefs = getSharedPreferences(PREFS, MODE_PRIVATE);
        root = new FrameLayout(this);
        root.setBackgroundColor(Color.parseColor("#141D26"));
        setContentView(root);

        webView = new WebView(this);
        configureWebView(webView);
        webView.setVisibility(View.GONE);
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        createFloatingHomeButton();
        showHome();
    }

    private void configureWebView(WebView view) {
        WebSettings settings = view.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setSupportMultipleWindows(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        settings.setUserAgentString(settings.getUserAgentString() + " KingdomOverflowKiosk/1.1");

        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(view, true);

        view.setBackgroundColor(Color.WHITE);
        view.addJavascriptInterface(new CheckInBridge(), "KOKiosk");
        view.setWebViewClient(new KioskWebViewClient());
    }

    private void createFloatingHomeButton() {
        floatingHomeButton = new Button(this);
        floatingHomeButton.setText("KO Home");
        floatingHomeButton.setTextColor(Color.WHITE);
        floatingHomeButton.setTextSize(13f);
        floatingHomeButton.setAllCaps(false);
        floatingHomeButton.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        floatingHomeButton.setBackgroundColor(Color.parseColor("#C51F5D"));
        floatingHomeButton.setVisibility(View.GONE);
        floatingHomeButton.setOnClickListener(v -> showHome());

        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(dp(108), dp(50));
        params.gravity = Gravity.TOP | Gravity.END;
        params.topMargin = dp(14);
        params.rightMargin = dp(14);
        root.addView(floatingHomeButton, params);
    }

    private void clearNativeScreens() {
        for (int i = root.getChildCount() - 1; i >= 0; i--) {
            View child = root.getChildAt(i);
            if (child != webView && child != floatingHomeButton) {
                root.removeViewAt(i);
            }
        }
    }

    private TextView text(String value, float size, int color, boolean bold) {
        TextView t = new TextView(this);
        t.setText(value);
        t.setTextSize(size);
        t.setTextColor(color);
        t.setLineSpacing(0f, 1.12f);
        if (bold) t.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        return t;
    }

    private Button actionButton(String label, int background, int foreground) {
        Button button = new Button(this);
        button.setText(label);
        button.setTextColor(foreground);
        button.setTextSize(18f);
        button.setAllCaps(false);
        button.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        button.setGravity(Gravity.CENTER_VERTICAL | Gravity.START);
        button.setPadding(dp(24), 0, dp(24), 0);
        button.setBackgroundColor(background);
        return button;
    }

    private void showHome() {
        showingHome = true;
        returnScheduled = false;
        clearNativeScreens();
        webView.setVisibility(View.GONE);
        floatingHomeButton.setVisibility(View.GONE);

        boolean sessionReady = prefs.getBoolean(SESSION_READY, false);

        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.setBackgroundColor(Color.parseColor("#141D26"));

        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);
        page.setPadding(dp(26), dp(34), dp(26), dp(28));
        page.setGravity(Gravity.CENTER_HORIZONTAL);
        scroll.addView(page, new ScrollView.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        LinearLayout brand = new LinearLayout(this);
        brand.setOrientation(LinearLayout.HORIZONTAL);
        brand.setGravity(Gravity.CENTER_VERTICAL);

        TextView mark = text("KO", 18f, Color.WHITE, true);
        mark.setGravity(Gravity.CENTER);
        mark.setBackgroundColor(Color.parseColor("#C51F5D"));
        brand.addView(mark, new LinearLayout.LayoutParams(dp(58), dp(58)));

        LinearLayout brandCopy = new LinearLayout(this);
        brandCopy.setOrientation(LinearLayout.VERTICAL);
        brandCopy.setPadding(dp(14), 0, 0, 0);
        brandCopy.addView(text("Kingdom Overflow", 22f, Color.parseColor("#E2E2D2"), true));
        brandCopy.addView(text("BELONGING  •  OPPORTUNITY  •  WELLBEING", 9f, Color.parseColor("#99A0AA"), false));
        brand.addView(brandCopy);
        page.addView(brand, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        Space s1 = new Space(this);
        page.addView(s1, new LinearLayout.LayoutParams(1, dp(56)));

        TextView hello = text("Good to see you.", 36f, Color.WHITE, true);
        hello.setGravity(Gravity.CENTER);
        page.addView(hello, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        TextView intro = text("Let’s get you checked in.", 27f, Color.parseColor("#F3A6C3"), true);
        intro.setGravity(Gravity.CENTER);
        intro.setPadding(0, dp(6), 0, 0);
        page.addView(intro, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        TextView helper = text(
                "Been before? Check in for today. First time with us? Register once, then you’ll be ready to check in.",
                16f,
                Color.parseColor("#B6BBC2"),
                false
        );
        helper.setGravity(Gravity.CENTER);
        helper.setPadding(dp(8), dp(18), dp(8), dp(28));
        page.addView(helper, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        Button checkIn = actionButton(
                sessionReady ? "✓  CHECK IN\n     I’ve been before" : "CHECK IN\nWaiting for staff to start today’s session",
                sessionReady ? Color.parseColor("#E2E2D2") : Color.parseColor("#2A3440"),
                sessionReady ? Color.parseColor("#141D26") : Color.parseColor("#8D949C")
        );
        checkIn.setEnabled(sessionReady);
        checkIn.setOnClickListener(v -> openWeb(CHECKIN_URL));
        page.addView(checkIn, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(126)
        ));

        Space s2 = new Space(this);
        page.addView(s2, new LinearLayout.LayoutParams(1, dp(18)));

        Button newHere = actionButton("＋  NEW HERE\n     First time with us", Color.parseColor("#24303C"), Color.WHITE);
        newHere.setOnClickListener(v -> openWeb(JOIN_FORM_URL));
        page.addView(newHere, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(126)
        ));

        Space flex = new Space(this);
        page.addView(flex, new LinearLayout.LayoutParams(1, dp(34)));

        Button staff = actionButton(
                sessionReady ? "Staff  •  Session live" : "Staff  •  Start session",
                Color.parseColor("#1C2630"),
                Color.parseColor("#B6BBC2")
        );
        staff.setTextSize(14f);
        staff.setGravity(Gravity.CENTER);
        staff.setOnClickListener(v -> showStaff());
        page.addView(staff, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(58)
        ));

        root.addView(scroll, 1, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
    }

    private void showStaff() {
        showingHome = false;
        clearNativeScreens();
        webView.setVisibility(View.GONE);
        floatingHomeButton.setVisibility(View.GONE);

        boolean sessionReady = prefs.getBoolean(SESSION_READY, false);

        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);
        page.setPadding(dp(26), dp(40), dp(26), dp(30));
        page.setBackgroundColor(Color.parseColor("#101821"));

        TextView eyebrow = text("STAFF CONTROLS", 12f, Color.parseColor("#F300C5"), true);
        page.addView(eyebrow);
        TextView heading = text(sessionReady ? "Today’s session is live" : "Start today’s session", 31f, Color.WHITE, true);
        heading.setPadding(0, dp(8), 0, dp(14));
        page.addView(heading);

        TextView body = text(
                sessionReady
                        ? "Use ChurchSuite to manage or close the current Check-In session."
                        : "Open ChurchSuite, choose Show More → Create from gathering → choose the Gathering → confirm/save the session.",
                16f,
                Color.parseColor("#B6BBC2"),
                false
        );
        body.setPadding(0, 0, 0, dp(26));
        page.addView(body);

        Button churchSuite = actionButton(
                sessionReady ? "Open ChurchSuite session" : "Open ChurchSuite session setup",
                Color.parseColor("#C51F5D"),
                Color.WHITE
        );
        churchSuite.setOnClickListener(v -> openWeb(CHECKIN_URL));
        page.addView(churchSuite, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(78)
        ));

        Space gap = new Space(this);
        page.addView(gap, new LinearLayout.LayoutParams(1, dp(16)));

        Button mark = actionButton(
                sessionReady ? "Session is closed — return home" : "Session is live — return home",
                Color.parseColor("#E2E2D2"),
                Color.parseColor("#141D26")
        );
        mark.setOnClickListener(v -> {
            prefs.edit().putBoolean(SESSION_READY, !sessionReady).apply();
            showHome();
        });
        page.addView(mark, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(78)
        ));

        Space flex = new Space(this);
        page.addView(flex, new LinearLayout.LayoutParams(1, 0, 1f));

        Button back = actionButton("←  Back to check-in home", Color.parseColor("#1C2630"), Color.WHITE);
        back.setGravity(Gravity.CENTER);
        back.setOnClickListener(v -> showHome());
        page.addView(back, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(64)
        ));

        root.addView(page, 1, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
    }

    private void showError(String detail) {
        showingHome = false;
        clearNativeScreens();
        webView.setVisibility(View.GONE);
        floatingHomeButton.setVisibility(View.GONE);

        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);
        page.setGravity(Gravity.CENTER);
        page.setPadding(dp(32), dp(32), dp(32), dp(32));
        page.setBackgroundColor(Color.parseColor("#141D26"));

        TextView heading = text("We couldn’t load ChurchSuite", 26f, Color.WHITE, true);
        heading.setGravity(Gravity.CENTER);
        page.addView(heading);

        TextView body = text(detail + "\n\nCheck the internet connection, then try again.", 15f, Color.parseColor("#B6BBC2"), false);
        body.setGravity(Gravity.CENTER);
        body.setPadding(0, dp(14), 0, dp(24));
        page.addView(body);

        Button home = actionButton("Return to KO home", Color.parseColor("#C51F5D"), Color.WHITE);
        home.setGravity(Gravity.CENTER);
        home.setOnClickListener(v -> showHome());
        page.addView(home, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(70)
        ));

        root.addView(page, 1, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
    }

    private void openWeb(String url) {
        showingHome = false;
        returnScheduled = false;
        clearNativeScreens();
        webView.setVisibility(View.VISIBLE);
        webView.bringToFront();
        floatingHomeButton.setVisibility(View.VISIBLE);
        floatingHomeButton.bringToFront();
        webView.loadUrl(url);
    }

    private void scheduleReturnAfterSuccess() {
        if (returnScheduled) return;
        returnScheduled = true;
        Toast.makeText(this, "Checked in", Toast.LENGTH_SHORT).show();
        handler.postDelayed(this::showHome, 1200);
    }

    private void injectSuccessWatcher(WebView view) {
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
                "window.setInterval(check,350);check();" +
                "})();";
        view.evaluateJavascript(javascript, null);
    }

    private boolean isAllowedUrl(String url) {
        if (url == null || url.isEmpty() || url.equals("about:blank")) return true;
        Uri uri = Uri.parse(url);
        String scheme = uri.getScheme();
        if (!"https".equalsIgnoreCase(scheme) && !"http".equalsIgnoreCase(scheme)) return false;
        String host = uri.getHost();
        if (host == null) return false;
        host = host.toLowerCase();
        return host.equals("churchsuite.com") || host.endsWith(".churchsuite.com");
    }

    private boolean isChurchSuite(String url) {
        if (url == null) return false;
        String host = Uri.parse(url).getHost();
        return host != null && (host.equalsIgnoreCase("churchsuite.com") || host.toLowerCase().endsWith(".churchsuite.com"));
    }

    private boolean isCheckInUrl(String url) {
        return url != null && isChurchSuite(url) && url.toLowerCase().contains("/checkin");
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private void hideSystemUi() {
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
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
        if (!webView.isShown()) {
            if (!showingHome) showHome();
            return;
        }
        showHome();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) webView.destroy();
        super.onDestroy();
    }

    private final class KioskWebViewClient extends WebViewClient {
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
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            if (isCheckInUrl(url)) injectSuccessWatcher(view);
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            super.onReceivedError(view, request, error);
            if (request.isForMainFrame()) {
                handler.post(() -> showError(error != null ? error.getDescription().toString() : "Unknown loading error"));
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
