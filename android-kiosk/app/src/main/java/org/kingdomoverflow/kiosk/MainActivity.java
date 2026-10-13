package org.kingdomoverflow.kiosk;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Shader;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebStorage;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Space;
import android.widget.TextView;
import android.widget.Toast;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends Activity {
    private static final String CHECKIN_URL = "https://kingdomoverflow.churchsuite.com/checkin";
    private static final String JOIN_FORM_URL = "https://kingdomoverflow.churchsuite.com/-/forms/zqtiiald";
    private static final String PREFS = "ko-kiosk";
    private static final String SESSION_READY = "session-ready";
    private static final String SESSION_DATE = "session-date";
    private static final String GATHERING_ID = "gathering-id";
    private static final String GATHERING_NAME = "gathering-name";
    private static final String APP_VERSION = "2.0";

    private static final int NAVY = Color.rgb(20, 29, 38);
    private static final int NAVY_DEEP = Color.rgb(16, 24, 33);
    private static final int BLUE_GREY = Color.rgb(36, 52, 71);
    private static final int PANEL = Color.rgb(31, 42, 53);
    private static final int PANEL_2 = Color.rgb(36, 48, 60);
    private static final int CREAM = Color.rgb(226, 226, 210);
    private static final int PINK = Color.rgb(197, 31, 93);
    private static final int HOT_PINK = Color.rgb(243, 0, 197);
    private static final int ORANGE = Color.rgb(217, 130, 69);
    private static final int ELECTRIC_BLUE = Color.rgb(65, 98, 255);
    private static final int MUTED = Color.rgb(182, 187, 194);
    private static final int SUBTLE = Color.rgb(139, 148, 158);
    private static final int GREEN = Color.rgb(99, 214, 164);

    private static final String[][] GATHERINGS = new String[][]{
            {"hub", "Overflow Hub", "overflow-hub-wordmark.png"},
            {"am", "Overflow:AM", "overflow-am-wordmark.png"},
            {"dance", "Overflow Dance", "overflow-dance-wordmark.png"},
            {"football", "Overflow Football", "overflow-football-wordmark.png"},
            {"create", "Overflow Create", "overflow-create-wordmark.png"},
            {"wellbeing", "Overflow Wellbeing Centre", ""}
    };

    private final Handler handler = new Handler(Looper.getMainLooper());
    private final SimpleDateFormat clockFormat = new SimpleDateFormat("HH:mm", Locale.UK);
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("EEEE d MMMM", Locale.UK);
    private final SimpleDateFormat dayKeyFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.UK);

    private FrameLayout root;
    private WebView webView;
    private TextView floatingHomeButton;
    private FrameLayout loadingOverlay;
    private SharedPreferences prefs;
    private String currentPurpose = "";
    private boolean returnScheduled = false;
    private TextView clockView;
    private TextView dateView;
    private Runnable idleTimeout;

    private final Runnable clockTick = new Runnable() {
        @Override
        public void run() {
            updateClock();
            handler.postDelayed(this, 15_000);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        hideSystemUi();

        prefs = getSharedPreferences(PREFS, MODE_PRIVATE);
        enforceDailySessionReset();

        root = new FrameLayout(this);
        root.setBackground(createLinearGradient(new int[]{NAVY, NAVY_DEEP}, GradientDrawable.Orientation.TL_BR));
        setContentView(root);

        webView = new WebView(this);
        configureWebView(webView);
        webView.setVisibility(View.GONE);
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        createWebLoadingOverlay();
        createFloatingHomeButton();
        showHome();
        handler.post(clockTick);
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
        settings.setSaveFormData(false);
        settings.setUserAgentString(settings.getUserAgentString() + " KingdomOverflowKiosk/2.0");

        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);
        cookies.setAcceptThirdPartyCookies(view, true);

        view.setBackgroundColor(Color.WHITE);
        view.addJavascriptInterface(new KioskBridge(), "KOKiosk");
        view.setWebViewClient(new KioskWebViewClient());
    }

    private void createFloatingHomeButton() {
        floatingHomeButton = text("‹  KO home", 13f, Color.WHITE, true);
        floatingHomeButton.setGravity(Gravity.CENTER);
        floatingHomeButton.setBackground(roundRect(PINK, 999f));
        floatingHomeButton.setPadding(dp(16), 0, dp(16), 0);
        floatingHomeButton.setElevation(dp(10));
        floatingHomeButton.setVisibility(View.GONE);
        floatingHomeButton.setOnClickListener(v -> leaveChurchSuite());

        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(dp(124), dp(48));
        params.gravity = Gravity.TOP | Gravity.END;
        params.topMargin = dp(14);
        params.rightMargin = dp(14);
        root.addView(floatingHomeButton, params);
    }

    private void createWebLoadingOverlay() {
        loadingOverlay = new FrameLayout(this);
        loadingOverlay.setBackground(createLinearGradient(new int[]{NAVY, NAVY_DEEP}, GradientDrawable.Orientation.TL_BR));
        loadingOverlay.setVisibility(View.GONE);

        LinearLayout content = new LinearLayout(this);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setGravity(Gravity.CENTER);

        ImageView logo = assetImage("ko-logo-dark.png");
        content.addView(logo, new LinearLayout.LayoutParams(dp(92), dp(92)));

        TextView heading = text("Opening ChurchSuite…", 20f, CREAM, true);
        heading.setGravity(Gravity.CENTER);
        heading.setPadding(0, dp(22), 0, 0);
        content.addView(heading);

        TextView body = text("Secure KO check-in", 12f, SUBTLE, false);
        body.setGravity(Gravity.CENTER);
        body.setLetterSpacing(0.12f);
        body.setPadding(0, dp(8), 0, 0);
        content.addView(body);

        loadingOverlay.addView(content, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        root.addView(loadingOverlay, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
    }

    private void clearNativeScreens() {
        for (int i = root.getChildCount() - 1; i >= 0; i--) {
            View child = root.getChildAt(i);
            if (child != webView && child != floatingHomeButton && child != loadingOverlay) {
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
        t.setIncludeFontPadding(false);
        t.setTypeface(Typeface.create("sans-serif", bold ? Typeface.BOLD : Typeface.NORMAL));
        return t;
    }

    private ImageView assetImage(String name) {
        ImageView image = new ImageView(this);
        image.setScaleType(ImageView.ScaleType.CENTER_INSIDE);
        try (InputStream stream = getAssets().open(name)) {
            Bitmap bitmap = BitmapFactory.decodeStream(stream);
            image.setImageBitmap(bitmap);
        } catch (Exception ignored) {
            image.setBackground(roundRect(PINK, 999f));
        }
        return image;
    }

    private void applyBrandGradient(TextView view) {
        view.post(() -> {
            float width = Math.max(view.getWidth(), dp(260));
            LinearGradient shader = new LinearGradient(
                    0, 0, width, 0,
                    new int[]{HOT_PINK, PINK, CREAM},
                    null,
                    Shader.TileMode.CLAMP
            );
            view.getPaint().setShader(shader);
            view.invalidate();
        });
    }

    private GradientDrawable roundRect(int color, float radiusDp) {
        GradientDrawable d = new GradientDrawable();
        d.setColor(color);
        d.setCornerRadius(dpF(radiusDp));
        return d;
    }

    private GradientDrawable roundRectStroke(int color, float radiusDp, int strokeColor, int strokeDp) {
        GradientDrawable d = roundRect(color, radiusDp);
        d.setStroke(dp(strokeDp), strokeColor);
        return d;
    }

    private GradientDrawable createLinearGradient(int[] colors, GradientDrawable.Orientation orientation) {
        GradientDrawable d = new GradientDrawable(orientation, colors);
        d.setCornerRadius(0f);
        return d;
    }

    private GradientDrawable gradientCard(int[] colors, float radiusDp) {
        GradientDrawable d = new GradientDrawable(GradientDrawable.Orientation.TL_BR, colors);
        d.setCornerRadius(dpF(radiusDp));
        return d;
    }

    private GradientDrawable brandButtonGradient(float radiusDp) {
        GradientDrawable d = new GradientDrawable(
                GradientDrawable.Orientation.LEFT_RIGHT,
                new int[]{HOT_PINK, PINK, CREAM}
        );
        d.setCornerRadius(dpF(radiusDp));
        return d;
    }

    private void addDecor(FrameLayout frame) {
        View pinkGlow = new View(this);
        GradientDrawable pink = new GradientDrawable();
        pink.setShape(GradientDrawable.OVAL);
        pink.setGradientType(GradientDrawable.RADIAL_GRADIENT);
        pink.setGradientRadius(dpF(210));
        pink.setColors(new int[]{Color.argb(60, 243, 0, 197), Color.TRANSPARENT});
        pinkGlow.setBackground(pink);
        FrameLayout.LayoutParams p1 = new FrameLayout.LayoutParams(dp(420), dp(420));
        p1.gravity = Gravity.TOP | Gravity.START;
        p1.leftMargin = -dp(190);
        p1.topMargin = -dp(195);
        frame.addView(pinkGlow, p1);

        View deepPinkGlow = new View(this);
        GradientDrawable deepPink = new GradientDrawable();
        deepPink.setShape(GradientDrawable.OVAL);
        deepPink.setGradientType(GradientDrawable.RADIAL_GRADIENT);
        deepPink.setGradientRadius(dpF(180));
        deepPink.setColors(new int[]{Color.argb(42, 197, 31, 93), Color.TRANSPARENT});
        deepPinkGlow.setBackground(deepPink);
        FrameLayout.LayoutParams p2 = new FrameLayout.LayoutParams(dp(360), dp(360));
        p2.gravity = Gravity.CENTER_VERTICAL | Gravity.START;
        p2.leftMargin = -dp(220);
        frame.addView(deepPinkGlow, p2);

        View creamGlow = new View(this);
        GradientDrawable cream = new GradientDrawable();
        cream.setShape(GradientDrawable.OVAL);
        cream.setGradientType(GradientDrawable.RADIAL_GRADIENT);
        cream.setGradientRadius(dpF(175));
        cream.setColors(new int[]{Color.argb(27, 226, 226, 210), Color.TRANSPARENT});
        creamGlow.setBackground(cream);
        FrameLayout.LayoutParams p3 = new FrameLayout.LayoutParams(dp(350), dp(350));
        p3.gravity = Gravity.BOTTOM | Gravity.END;
        p3.rightMargin = -dp(155);
        p3.bottomMargin = -dp(160);
        frame.addView(creamGlow, p3);
    }

    private TextView pill(String value, int foreground, int background) {
        TextView p = text(value, 11f, foreground, true);
        p.setGravity(Gravity.CENTER);
        p.setLetterSpacing(0.14f);
        p.setBackground(roundRectStroke(background, 999f, Color.argb(30, 255, 255, 255), 1));
        p.setPadding(dp(15), dp(9), dp(15), dp(9));
        return p;
    }

    private void addPressAnimation(View view) {
        view.setOnTouchListener((v, event) -> {
            if (!v.isEnabled()) return false;
            if (event.getAction() == MotionEvent.ACTION_DOWN) {
                v.animate().scaleX(0.985f).scaleY(0.985f).setDuration(90).start();
            } else if (event.getAction() == MotionEvent.ACTION_UP || event.getAction() == MotionEvent.ACTION_CANCEL) {
                v.animate().scaleX(1f).scaleY(1f).setDuration(130).start();
            }
            return false;
        });
    }

    private View choiceCard(
            String icon,
            String eyebrow,
            String title,
            String subtitle,
            boolean light,
            boolean enabled,
            View.OnClickListener listener
    ) {
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setPadding(dp(24), dp(24), dp(24), dp(22));
        card.setGravity(Gravity.START);
        card.setEnabled(enabled);
        card.setClickable(enabled);
        card.setFocusable(enabled);
        card.setElevation(dp(10));

        if (light) {
            card.setBackground(roundRectStroke(CREAM, 28f, Color.argb(30, 255, 255, 255), 1));
        } else {
            card.setBackground(gradientCard(new int[]{PANEL_2, Color.rgb(29, 39, 50)}, 28f));
        }

        TextView iconBox = text(icon, 25f, light ? CREAM : Color.rgb(255, 218, 236), true);
        iconBox.setGravity(Gravity.CENTER);
        iconBox.setBackground(roundRectStroke(
                light ? NAVY : Color.argb(25, 255, 255, 255),
                17f,
                Color.argb(30, 255, 255, 255),
                1
        ));
        card.addView(iconBox, new LinearLayout.LayoutParams(dp(58), dp(58)));

        Space spacer = new Space(this);
        card.addView(spacer, new LinearLayout.LayoutParams(1, dp(30)));

        TextView e = text(eyebrow.toUpperCase(Locale.UK), 10f, light ? Color.rgb(73, 84, 94) : Color.rgb(191, 198, 206), true);
        e.setLetterSpacing(0.18f);
        card.addView(e);

        TextView h = text(title, 31f, light ? NAVY : Color.WHITE, true);
        h.setPadding(0, dp(7), 0, dp(10));
        card.addView(h);

        LinearLayout footer = new LinearLayout(this);
        footer.setGravity(Gravity.CENTER_VERTICAL);
        TextView s = text(subtitle, 14f, light ? Color.rgb(73, 84, 94) : MUTED, false);
        footer.addView(s, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        TextView arrow = text(enabled ? "→" : "", 26f, light ? NAVY : CREAM, true);
        footer.addView(arrow);
        card.addView(footer, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        if (!enabled) {
            card.setAlpha(0.46f);
        } else {
            card.setOnClickListener(listener);
            addPressAnimation(card);
        }
        return card;
    }

    private void showHome() {
        enforceDailySessionReset();
        currentPurpose = "";
        returnScheduled = false;
        cancelIdleTimeout();
        clearNativeScreens();
        webView.stopLoading();
        webView.loadUrl("about:blank");
        webView.clearHistory();
        webView.clearFormData();
        webView.setVisibility(View.GONE);
        loadingOverlay.setVisibility(View.GONE);
        floatingHomeButton.setVisibility(View.GONE);

        boolean sessionReady = isSessionReady();
        boolean tablet = isTablet();

        FrameLayout shell = new FrameLayout(this);
        shell.setBackground(createLinearGradient(new int[]{NAVY, NAVY_DEEP}, GradientDrawable.Orientation.TL_BR));
        addDecor(shell);

        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.setClipToPadding(false);
        shell.addView(scroll, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);
        page.setPadding(dp(tablet ? 50 : 24), dp(tablet ? 42 : 28), dp(tablet ? 50 : 24), dp(24));
        page.setGravity(Gravity.CENTER_HORIZONTAL);
        scroll.addView(page, new ScrollView.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        LinearLayout header = new LinearLayout(this);
        header.setGravity(Gravity.CENTER_VERTICAL);

        LinearLayout brand = new LinearLayout(this);
        brand.setGravity(Gravity.CENTER_VERTICAL);
        ImageView logo = assetImage("ko-logo-dark.png");
        logo.setBackground(roundRectStroke(Color.argb(10, 255, 255, 255), 999f, Color.argb(20, 255, 255, 255), 1));
        brand.addView(logo, new LinearLayout.LayoutParams(dp(62), dp(62)));

        LinearLayout brandCopy = new LinearLayout(this);
        brandCopy.setOrientation(LinearLayout.VERTICAL);
        brandCopy.setPadding(dp(14), 0, 0, 0);
        brandCopy.addView(text("Kingdom Overflow", tablet ? 22f : 19f, CREAM, true));
        TextView strap = text("BELONGING  •  OPPORTUNITY  •  WELLBEING", tablet ? 9.5f : 8.2f, Color.rgb(140, 148, 158), false);
        strap.setLetterSpacing(0.13f);
        brandCopy.addView(strap);
        brand.addView(brandCopy);
        header.addView(brand, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));

        LinearLayout timeBox = new LinearLayout(this);
        timeBox.setOrientation(LinearLayout.VERTICAL);
        timeBox.setGravity(Gravity.END);
        clockView = text("", tablet ? 28f : 23f, CREAM, true);
        clockView.setGravity(Gravity.END);
        dateView = text("", 11f, Color.rgb(135, 143, 153), false);
        dateView.setGravity(Gravity.END);
        timeBox.addView(clockView);
        if (tablet) timeBox.addView(dateView);
        header.addView(timeBox);
        page.addView(header, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        updateClock();

        Space topGap = new Space(this);
        page.addView(topGap, new LinearLayout.LayoutParams(1, dp(tablet ? 58 : 42)));

        page.addView(pill("✦  WELCOME", Color.rgb(213, 217, 221), Color.argb(15, 255, 255, 255)));

        TextView hello = text("Good to see you.", tablet ? 48f : 38f, Color.WHITE, true);
        hello.setGravity(Gravity.CENTER);
        hello.setPadding(0, dp(18), 0, 0);
        page.addView(hello, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        TextView intro = text("Let’s get you checked in.", tablet ? 43f : 30f, Color.WHITE, true);
        intro.setGravity(Gravity.CENTER);
        intro.setPadding(0, dp(4), 0, 0);
        page.addView(intro, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        applyBrandGradient(intro);

        TextView helper = text(
                "Been before? Check in for today. First time with us? Register once, then you’ll be ready to check in.",
                tablet ? 17f : 15f,
                MUTED,
                false
        );
        helper.setGravity(Gravity.CENTER);
        helper.setMaxWidth(dp(720));
        helper.setPadding(dp(10), dp(19), dp(10), dp(tablet ? 30 : 24));
        page.addView(helper, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        if (sessionReady) {
            page.addView(activeGatheringBanner());
        } else {
            LinearLayout notice = new LinearLayout(this);
            notice.setGravity(Gravity.CENTER_VERTICAL);
            notice.setPadding(dp(16), dp(12), dp(16), dp(12));
            notice.setBackground(roundRectStroke(Color.argb(16, 255, 255, 255), 18f, Color.argb(28, 255, 255, 255), 1));
            TextView dot = text("●", 12f, ORANGE, true);
            notice.addView(dot);
            TextView waiting = text("Waiting for a team member to start today’s session", 13f, Color.rgb(201, 206, 212), true);
            waiting.setPadding(dp(10), 0, 0, 0);
            notice.addView(waiting);
            page.addView(notice);
        }

        LinearLayout cards = new LinearLayout(this);
        cards.setOrientation(tablet ? LinearLayout.HORIZONTAL : LinearLayout.VERTICAL);
        cards.setPadding(0, dp(tablet ? 30 : 24), 0, 0);

        View checkIn = choiceCard(
                sessionReady ? "✓" : "◷",
                sessionReady ? "I’ve been before" : "Waiting for staff",
                "Check in",
                sessionReady ? "Find your name and check in for today" : "Today’s session needs to be started first",
                true,
                sessionReady,
                v -> openWeb(CHECKIN_URL, "checkin")
        );
        View newHere = choiceCard(
                "+",
                "First time with us",
                "New here",
                "Register once, then check in today",
                false,
                true,
                v -> openWeb(JOIN_FORM_URL, "join")
        );

        if (tablet) {
            cards.addView(checkIn, new LinearLayout.LayoutParams(0, dp(254), 1f));
            Space cardGap = new Space(this);
            cards.addView(cardGap, new LinearLayout.LayoutParams(dp(20), 1));
            cards.addView(newHere, new LinearLayout.LayoutParams(0, dp(254), 1f));
        } else {
            cards.addView(checkIn, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(220)));
            Space cardGap = new Space(this);
            cards.addView(cardGap, new LinearLayout.LayoutParams(1, dp(16)));
            cards.addView(newHere, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(220)));
        }
        page.addView(cards, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        LinearLayout footer = new LinearLayout(this);
        footer.setGravity(Gravity.CENTER_VERTICAL);
        footer.setPadding(0, dp(28), 0, 0);

        String network = isOnline() ? "●  Online" : "●  Offline";
        TextView status = text(network + "    •    KO Kiosk " + APP_VERSION, 11f, isOnline() ? Color.argb(150, 99, 214, 164) : Color.argb(180, 217, 130, 69), true);
        footer.addView(status, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));

        TextView staff = pill(sessionReady ? "SESSION LIVE  •  HOLD FOR STAFF" : "PRESS & HOLD FOR STAFF", Color.rgb(205, 210, 215), Color.argb(16, 255, 255, 255));
        staff.setOnClickListener(v -> Toast.makeText(this, "Press and hold for staff controls", Toast.LENGTH_SHORT).show());
        staff.setOnLongClickListener(v -> {
            showStaff();
            return true;
        });
        footer.addView(staff);
        page.addView(footer, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        root.addView(shell, 1, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        shell.setAlpha(0f);
        shell.setTranslationY(dp(8));
        shell.animate().alpha(1f).translationY(0).setDuration(330).start();
    }

    private View activeGatheringBanner() {
        LinearLayout banner = new LinearLayout(this);
        banner.setGravity(Gravity.CENTER_VERTICAL);
        banner.setPadding(dp(16), dp(10), dp(16), dp(10));
        banner.setBackground(roundRectStroke(Color.argb(18, 99, 214, 164), 20f, Color.argb(55, 99, 214, 164), 1));

        TextView dot = text("●", 12f, GREEN, true);
        banner.addView(dot);

        String asset = gatheringAsset(selectedGatheringId());
        if (!asset.isEmpty()) {
            ImageView mark = assetImage(asset);
            mark.setPadding(dp(12), 0, dp(10), 0);
            banner.addView(mark, new LinearLayout.LayoutParams(dp(150), dp(42)));
        } else {
            TextView name = text(selectedGatheringName(), 14f, CREAM, true);
            name.setPadding(dp(12), 0, dp(10), 0);
            banner.addView(name);
        }

        TextView live = text("SESSION LIVE", 10f, Color.argb(220, 99, 214, 164), true);
        live.setLetterSpacing(0.15f);
        banner.addView(live);
        return banner;
    }

    private void showStaff() {
        enforceDailySessionReset();
        cancelIdleTimeout();
        currentPurpose = "";
        clearNativeScreens();
        webView.setVisibility(View.GONE);
        loadingOverlay.setVisibility(View.GONE);
        floatingHomeButton.setVisibility(View.GONE);

        boolean sessionReady = isSessionReady();
        boolean tablet = isTablet();

        FrameLayout shell = new FrameLayout(this);
        shell.setBackground(createLinearGradient(new int[]{NAVY_DEEP, NAVY}, GradientDrawable.Orientation.TL_BR));
        addDecor(shell);

        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        shell.addView(scroll, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);
        page.setPadding(dp(tablet ? 52 : 24), dp(tablet ? 40 : 28), dp(tablet ? 52 : 24), dp(30));
        scroll.addView(page, new ScrollView.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        TextView back = pill("‹  CHECK-IN HOME", Color.rgb(220, 223, 226), Color.argb(16, 255, 255, 255));
        back.setGravity(Gravity.CENTER);
        back.setOnClickListener(v -> showHome());
        page.addView(back, new LinearLayout.LayoutParams(dp(154), dp(44)));

        TextView eyebrow = text("STAFF CONTROLS", 11f, HOT_PINK, true);
        eyebrow.setLetterSpacing(0.18f);
        eyebrow.setPadding(0, dp(48), 0, 0);
        page.addView(eyebrow);

        TextView heading = text(sessionReady ? "Today’s session is live" : "Start today’s session", tablet ? 44f : 34f, Color.WHITE, true);
        heading.setPadding(0, dp(10), 0, dp(14));
        page.addView(heading);

        TextView body = text(
                sessionReady
                        ? selectedGatheringName() + " is currently selected. Use ChurchSuite to manage or close the live session."
                        : "Choose the Kingdom Overflow gathering first, then open ChurchSuite and create the matching Check-In session.",
                tablet ? 17f : 15f,
                MUTED,
                false
        );
        body.setMaxWidth(dp(820));
        page.addView(body);

        if (!sessionReady) {
            TextView choose = text("CHOOSE GATHERING", 10f, Color.rgb(174, 181, 190), true);
            choose.setLetterSpacing(0.16f);
            choose.setPadding(0, dp(30), 0, dp(12));
            page.addView(choose);
            page.addView(gatheringSelector());
        } else {
            View active = activeGatheringBanner();
            LinearLayout.LayoutParams ap = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            ap.topMargin = dp(28);
            page.addView(active, ap);
        }

        TextView churchSuite = text(
                sessionReady ? "OPEN CHURCHSUITE SESSION     ↗" : "START IN CHURCHSUITE     ↗",
                16f,
                sessionReady ? Color.WHITE : NAVY,
                true
        );
        churchSuite.setGravity(Gravity.CENTER);
        churchSuite.setPadding(dp(18), 0, dp(18), 0);
        churchSuite.setElevation(dp(8));
        churchSuite.setBackground(sessionReady ? gradientCard(new int[]{HOT_PINK, PINK}, 22f) : brandButtonGradient(22f));
        churchSuite.setOnClickListener(v -> openWeb(CHECKIN_URL, sessionReady ? "staff-close" : "staff-start"));
        addPressAnimation(churchSuite);
        LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(72));
        cp.topMargin = dp(28);
        page.addView(churchSuite, cp);

        TextView guidance = text(
                sessionReady
                        ? "In ChurchSuite use Admin → Close, confirm the session is closed, then tap KO home."
                        : "In ChurchSuite choose Show More → Create from gathering → select the matching Gathering → confirm/save, then tap KO home.",
                13f,
                Color.rgb(143, 151, 160),
                false
        );
        guidance.setPadding(dp(4), dp(16), dp(4), 0);
        page.addView(guidance);

        LinearLayout utility = new LinearLayout(this);
        utility.setOrientation(tablet ? LinearLayout.HORIZONTAL : LinearLayout.VERTICAL);
        utility.setPadding(0, dp(34), 0, 0);

        TextView resetLogin = text("Reset ChurchSuite sign-in", 13f, Color.rgb(190, 196, 203), true);
        resetLogin.setGravity(Gravity.CENTER);
        resetLogin.setBackground(roundRectStroke(Color.argb(16, 255, 255, 255), 18f, Color.argb(28, 255, 255, 255), 1));
        resetLogin.setOnClickListener(v -> Toast.makeText(this, "Press and hold to reset the ChurchSuite login", Toast.LENGTH_SHORT).show());
        resetLogin.setOnLongClickListener(v -> {
            resetChurchSuiteLogin();
            return true;
        });

        TextView resetSession = text("Clear local session status", 13f, Color.rgb(190, 196, 203), true);
        resetSession.setGravity(Gravity.CENTER);
        resetSession.setBackground(roundRectStroke(Color.argb(16, 255, 255, 255), 18f, Color.argb(28, 255, 255, 255), 1));
        resetSession.setOnClickListener(v -> {
            markSessionReady(false);
            showHome();
        });

        if (tablet) {
            utility.addView(resetLogin, new LinearLayout.LayoutParams(0, dp(56), 1f));
            Space ug = new Space(this);
            utility.addView(ug, new LinearLayout.LayoutParams(dp(14), 1));
            utility.addView(resetSession, new LinearLayout.LayoutParams(0, dp(56), 1f));
        } else {
            utility.addView(resetLogin, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(56)));
            Space ug = new Space(this);
            utility.addView(ug, new LinearLayout.LayoutParams(1, dp(12)));
            utility.addView(resetSession, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(56)));
        }
        page.addView(utility, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        TextView note = text(
                "ChurchSuite login is kept securely inside this kiosk app. Personal form fields and browsing history are cleared between people; the sign-in cookie remains until staff reset it or ChurchSuite expires it.",
                11f,
                Color.rgb(116, 125, 136),
                false
        );
        note.setPadding(0, dp(24), 0, 0);
        page.addView(note);

        root.addView(shell, 1, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        shell.setAlpha(0f);
        shell.animate().alpha(1f).setDuration(260).start();
    }

    private View gatheringSelector() {
        HorizontalScrollView scroll = new HorizontalScrollView(this);
        scroll.setHorizontalScrollBarEnabled(false);
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setPadding(0, 0, dp(8), dp(4));
        scroll.addView(row);

        String selected = selectedGatheringId();
        for (String[] g : GATHERINGS) {
            boolean active = selected.equals(g[0]);
            LinearLayout card = new LinearLayout(this);
            card.setOrientation(LinearLayout.VERTICAL);
            card.setGravity(Gravity.CENTER);
            card.setPadding(dp(14), dp(12), dp(14), dp(12));
            card.setBackground(roundRectStroke(
                    active ? Color.argb(45, 197, 31, 93) : Color.argb(14, 255, 255, 255),
                    20f,
                    active ? PINK : Color.argb(30, 255, 255, 255),
                    active ? 2 : 1
            ));

            if (!g[2].isEmpty()) {
                ImageView wordmark = assetImage(g[2]);
                card.addView(wordmark, new LinearLayout.LayoutParams(dp(150), dp(46)));
            } else {
                TextView fallback = text("OVERFLOW", 15f, CREAM, true);
                fallback.setGravity(Gravity.CENTER);
                card.addView(fallback, new LinearLayout.LayoutParams(dp(150), dp(46)));
            }
            TextView label = text(g[1], 11f, active ? CREAM : Color.rgb(164, 172, 181), true);
            label.setGravity(Gravity.CENTER);
            label.setPadding(0, dp(6), 0, 0);
            card.addView(label);

            card.setOnClickListener(v -> {
                prefs.edit().putString(GATHERING_ID, g[0]).putString(GATHERING_NAME, g[1]).apply();
                showStaff();
            });
            addPressAnimation(card);

            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(dp(184), dp(94));
            lp.rightMargin = dp(12);
            row.addView(card, lp);
        }
        return scroll;
    }

    private void showStaffConfirmation(boolean starting) {
        cancelIdleTimeout();
        currentPurpose = "";
        clearNativeScreens();
        webView.stopLoading();
        webView.loadUrl("about:blank");
        webView.clearHistory();
        webView.setVisibility(View.GONE);
        loadingOverlay.setVisibility(View.GONE);
        floatingHomeButton.setVisibility(View.GONE);

        FrameLayout shell = new FrameLayout(this);
        shell.setBackground(createLinearGradient(new int[]{NAVY, NAVY_DEEP}, GradientDrawable.Orientation.TL_BR));
        addDecor(shell);

        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);
        page.setGravity(Gravity.CENTER);
        page.setPadding(dp(28), dp(30), dp(28), dp(30));
        shell.addView(page, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        ImageView logo = assetImage("ko-logo-dark.png");
        page.addView(logo, new LinearLayout.LayoutParams(dp(74), dp(74)));

        TextView eyebrow = text(starting ? "SESSION SETUP" : "SESSION CLOSE", 11f, HOT_PINK, true);
        eyebrow.setLetterSpacing(0.18f);
        eyebrow.setPadding(0, dp(26), 0, 0);
        page.addView(eyebrow);

        TextView heading = text(
                starting ? "Is " + selectedGatheringName() + " live?" : "Has the ChurchSuite session been closed?",
                isTablet() ? 38f : 30f,
                Color.WHITE,
                true
        );
        heading.setGravity(Gravity.CENTER);
        heading.setPadding(0, dp(10), 0, dp(14));
        page.addView(heading);

        TextView body = text(
                starting
                        ? "Only confirm once the matching Gathering has been created and is running in ChurchSuite."
                        : "Confirm once ChurchSuite has finished closing today’s session.",
                15f,
                MUTED,
                false
        );
        body.setGravity(Gravity.CENTER);
        body.setMaxWidth(dp(680));
        page.addView(body);

        TextView yes = text(starting ? "YES — SESSION IS LIVE     →" : "YES — SESSION IS CLOSED     →", 15f, NAVY, true);
        yes.setGravity(Gravity.CENTER);
        yes.setBackground(brandButtonGradient(22f));
        yes.setOnClickListener(v -> {
            markSessionReady(starting);
            showHome();
        });
        addPressAnimation(yes);
        LinearLayout.LayoutParams yp = new LinearLayout.LayoutParams(Math.min(dp(680), getResources().getDisplayMetrics().widthPixels - dp(56)), dp(72));
        yp.topMargin = dp(30);
        page.addView(yes, yp);

        TextView no = text("NOT YET — RETURN TO STAFF CONTROLS", 12f, Color.rgb(204, 210, 216), true);
        no.setGravity(Gravity.CENTER);
        no.setBackground(roundRectStroke(Color.argb(16, 255, 255, 255), 20f, Color.argb(30, 255, 255, 255), 1));
        no.setOnClickListener(v -> showStaff());
        LinearLayout.LayoutParams np = new LinearLayout.LayoutParams(Math.min(dp(680), getResources().getDisplayMetrics().widthPixels - dp(56)), dp(58));
        np.topMargin = dp(14);
        page.addView(no, np);

        root.addView(shell, 1, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
    }

    private void showCheckInSuccess() {
        cancelIdleTimeout();
        returnScheduled = false;
        clearNativeScreens();
        webView.stopLoading();
        webView.loadUrl("about:blank");
        webView.clearHistory();
        webView.clearFormData();
        webView.setVisibility(View.GONE);
        loadingOverlay.setVisibility(View.GONE);
        floatingHomeButton.setVisibility(View.GONE);

        FrameLayout shell = new FrameLayout(this);
        shell.setBackground(createLinearGradient(new int[]{NAVY, NAVY_DEEP}, GradientDrawable.Orientation.TL_BR));
        addDecor(shell);
        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);
        page.setGravity(Gravity.CENTER);
        page.setPadding(dp(30), dp(30), dp(30), dp(30));
        shell.addView(page, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        TextView tick = text("✓", 40f, NAVY, true);
        tick.setGravity(Gravity.CENTER);
        tick.setBackground(roundRect(CREAM, 999f));
        page.addView(tick, new LinearLayout.LayoutParams(dp(82), dp(82)));

        TextView title = text("You’re checked in.", isTablet() ? 48f : 38f, Color.WHITE, true);
        title.setGravity(Gravity.CENTER);
        title.setPadding(0, dp(24), 0, dp(10));
        page.addView(title);

        TextView subtitle = text("Have a great session.", 17f, MUTED, false);
        subtitle.setGravity(Gravity.CENTER);
        page.addView(subtitle);

        root.addView(shell, 1, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        shell.setAlpha(0f);
        shell.animate().alpha(1f).setDuration(180).start();
        handler.postDelayed(this::showHome, 1450);
    }

    private void showRegistrationSuccess() {
        cancelIdleTimeout();
        currentPurpose = "";
        clearNativeScreens();
        webView.stopLoading();
        webView.loadUrl("about:blank");
        webView.clearHistory();
        webView.clearFormData();
        webView.setVisibility(View.GONE);
        loadingOverlay.setVisibility(View.GONE);
        floatingHomeButton.setVisibility(View.GONE);

        FrameLayout shell = new FrameLayout(this);
        shell.setBackground(createLinearGradient(new int[]{NAVY, NAVY_DEEP}, GradientDrawable.Orientation.TL_BR));
        addDecor(shell);
        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);
        page.setGravity(Gravity.CENTER);
        page.setPadding(dp(30), dp(30), dp(30), dp(30));
        shell.addView(page, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        ImageView logo = assetImage("ko-logo-dark.png");
        page.addView(logo, new LinearLayout.LayoutParams(dp(78), dp(78)));

        TextView eyebrow = text("WELCOME TO KINGDOM OVERFLOW", 11f, HOT_PINK, true);
        eyebrow.setLetterSpacing(0.16f);
        eyebrow.setPadding(0, dp(24), 0, 0);
        page.addView(eyebrow);

        TextView title = text("You’re registered.", isTablet() ? 46f : 36f, Color.WHITE, true);
        title.setGravity(Gravity.CENTER);
        title.setPadding(0, dp(10), 0, dp(12));
        page.addView(title);

        TextView subtitle = text("Your Kingdom Overflow record is ready. You can now check in for today.", 16f, MUTED, false);
        subtitle.setGravity(Gravity.CENTER);
        subtitle.setMaxWidth(dp(650));
        page.addView(subtitle);

        if (isSessionReady()) {
            TextView check = text("CHECK IN FOR TODAY     →", 16f, NAVY, true);
            check.setGravity(Gravity.CENTER);
            check.setBackground(brandButtonGradient(22f));
            check.setOnClickListener(v -> openWeb(CHECKIN_URL, "checkin"));
            addPressAnimation(check);
            LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(Math.min(dp(650), getResources().getDisplayMetrics().widthPixels - dp(56)), dp(72));
            cp.topMargin = dp(30);
            page.addView(check, cp);
        }

        TextView home = text("RETURN TO CHECK-IN HOME", 12f, Color.rgb(206, 211, 216), true);
        home.setGravity(Gravity.CENTER);
        home.setBackground(roundRectStroke(Color.argb(16, 255, 255, 255), 20f, Color.argb(30, 255, 255, 255), 1));
        home.setOnClickListener(v -> showHome());
        LinearLayout.LayoutParams hp = new LinearLayout.LayoutParams(Math.min(dp(650), getResources().getDisplayMetrics().widthPixels - dp(56)), dp(58));
        hp.topMargin = dp(14);
        page.addView(home, hp);

        root.addView(shell, 1, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
    }

    private void showError(String detail) {
        cancelIdleTimeout();
        currentPurpose = "";
        clearNativeScreens();
        webView.setVisibility(View.GONE);
        loadingOverlay.setVisibility(View.GONE);
        floatingHomeButton.setVisibility(View.GONE);

        FrameLayout shell = new FrameLayout(this);
        shell.setBackground(createLinearGradient(new int[]{NAVY, NAVY_DEEP}, GradientDrawable.Orientation.TL_BR));
        addDecor(shell);
        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);
        page.setGravity(Gravity.CENTER);
        page.setPadding(dp(32), dp(32), dp(32), dp(32));
        shell.addView(page, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        ImageView logo = assetImage("ko-logo-dark.png");
        page.addView(logo, new LinearLayout.LayoutParams(dp(74), dp(74)));

        TextView heading = text("We couldn’t load ChurchSuite", 27f, Color.WHITE, true);
        heading.setGravity(Gravity.CENTER);
        heading.setPadding(0, dp(22), 0, dp(12));
        page.addView(heading);

        TextView body = text(detail + "\n\nCheck the internet connection and try again.", 15f, MUTED, false);
        body.setGravity(Gravity.CENTER);
        page.addView(body);

        TextView home = text("RETURN TO KO HOME", 14f, NAVY, true);
        home.setGravity(Gravity.CENTER);
        home.setBackground(brandButtonGradient(20f));
        home.setOnClickListener(v -> showHome());
        LinearLayout.LayoutParams hp = new LinearLayout.LayoutParams(Math.min(dp(620), getResources().getDisplayMetrics().widthPixels - dp(64)), dp(68));
        hp.topMargin = dp(28);
        page.addView(home, hp);

        root.addView(shell, 1, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
    }

    private void openWeb(String url, String purpose) {
        currentPurpose = purpose;
        returnScheduled = false;
        clearNativeScreens();
        webView.setVisibility(View.VISIBLE);
        webView.bringToFront();
        floatingHomeButton.setVisibility(View.VISIBLE);
        floatingHomeButton.bringToFront();
        loadingOverlay.setVisibility(View.VISIBLE);
        loadingOverlay.bringToFront();
        floatingHomeButton.bringToFront();
        webView.loadUrl(url);
        resetIdleTimeout();
    }

    private void leaveChurchSuite() {
        String purpose = currentPurpose;
        currentPurpose = "";
        if ("staff-start".equals(purpose)) {
            showStaffConfirmation(true);
        } else if ("staff-close".equals(purpose)) {
            showStaffConfirmation(false);
        } else {
            showHome();
        }
    }

    private void resetIdleTimeout() {
        cancelIdleTimeout();
        if (currentPurpose == null || currentPurpose.isEmpty() || currentPurpose.startsWith("staff")) return;
        long delay = "join".equals(currentPurpose) ? 5 * 60_000L : 90_000L;
        idleTimeout = () -> {
            Toast.makeText(this, "Kiosk reset for the next person", Toast.LENGTH_SHORT).show();
            showHome();
        };
        handler.postDelayed(idleTimeout, delay);
    }

    private void cancelIdleTimeout() {
        if (idleTimeout != null) {
            handler.removeCallbacks(idleTimeout);
            idleTimeout = null;
        }
    }

    private void injectActivityWatcher(WebView view) {
        String js = "(function(){if(window.__koActivityWatcher)return;window.__koActivityWatcher=true;let t=0;function ping(){let n=Date.now();if(n-t>5000){t=n;window.KOKiosk.activity();}}['touchstart','click','keydown','input'].forEach(e=>document.addEventListener(e,ping,true));})();";
        view.evaluateJavascript(js, null);
    }

    private void injectCheckInWatcher(WebView view) {
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
                "for(var i=0;i<phrases.length;i++){if(text.indexOf(phrases[i])!==-1){window.KOKiosk.checkInComplete();return;}}" +
                "}" +
                "new MutationObserver(check).observe(document.documentElement,{subtree:true,childList:true,characterData:true});" +
                "window.setInterval(check,350);check();" +
                "})();";
        view.evaluateJavascript(javascript, null);
    }

    private void injectJoinWatcher(WebView view) {
        String javascript =
                "(function(){" +
                "if(window.__koJoinWatcher){return;}window.__koJoinWatcher=true;" +
                "function check(){" +
                "var text=((document.body&&document.body.innerText)||'').toLowerCase();" +
                "var success=(text.indexOf('thank you')!==-1&&(text.indexOf('submitted')!==-1||text.indexOf('response')!==-1||text.indexOf('completed')!==-1))" +
                "||text.indexOf('form has been submitted')!==-1||text.indexOf('response has been submitted')!==-1;" +
                "if(success){window.KOKiosk.joinComplete();return;}" +
                "}" +
                "new MutationObserver(check).observe(document.documentElement,{subtree:true,childList:true,characterData:true});window.setInterval(check,500);" +
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
        host = host.toLowerCase(Locale.UK);
        return host.equals("churchsuite.com") || host.endsWith(".churchsuite.com");
    }

    private boolean isChurchSuite(String url) {
        if (url == null) return false;
        String host = Uri.parse(url).getHost();
        return host != null && (host.equalsIgnoreCase("churchsuite.com") || host.toLowerCase(Locale.UK).endsWith(".churchsuite.com"));
    }

    private boolean isCheckInUrl(String url) {
        return url != null && isChurchSuite(url) && url.toLowerCase(Locale.UK).contains("/checkin");
    }

    private boolean isJoinUrl(String url) {
        return url != null && isChurchSuite(url) && url.toLowerCase(Locale.UK).contains("/-/forms/");
    }

    private boolean isTablet() {
        float widthDp = getResources().getDisplayMetrics().widthPixels / getResources().getDisplayMetrics().density;
        return widthDp >= 700f;
    }

    private String todayKey() {
        return dayKeyFormat.format(new Date());
    }

    private void enforceDailySessionReset() {
        if (prefs == null) return;
        String stored = prefs.getString(SESSION_DATE, "");
        if (!stored.isEmpty() && !stored.equals(todayKey())) {
            prefs.edit().putBoolean(SESSION_READY, false).remove(SESSION_DATE).apply();
        }
    }

    private boolean isSessionReady() {
        enforceDailySessionReset();
        return prefs.getBoolean(SESSION_READY, false) && todayKey().equals(prefs.getString(SESSION_DATE, ""));
    }

    private void markSessionReady(boolean ready) {
        SharedPreferences.Editor editor = prefs.edit().putBoolean(SESSION_READY, ready);
        if (ready) editor.putString(SESSION_DATE, todayKey());
        else editor.remove(SESSION_DATE);
        editor.apply();
    }

    private String selectedGatheringId() {
        return prefs.getString(GATHERING_ID, "hub");
    }

    private String selectedGatheringName() {
        String stored = prefs.getString(GATHERING_NAME, "");
        if (!stored.isEmpty()) return stored;
        for (String[] g : GATHERINGS) if (g[0].equals(selectedGatheringId())) return g[1];
        return "Overflow Hub";
    }

    private String gatheringAsset(String id) {
        for (String[] g : GATHERINGS) if (g[0].equals(id)) return g[2];
        return "";
    }

    private boolean isOnline() {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            Network network = cm.getActiveNetwork();
            if (network == null) return false;
            NetworkCapabilities caps = cm.getNetworkCapabilities(network);
            return caps != null && caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
        } catch (Exception ignored) {
            return true;
        }
    }

    private void resetChurchSuiteLogin() {
        CookieManager.getInstance().removeAllCookies(value -> {
            CookieManager.getInstance().flush();
            WebStorage.getInstance().deleteAllData();
            webView.clearCache(true);
            webView.clearHistory();
            Toast.makeText(this, "ChurchSuite sign-in reset", Toast.LENGTH_SHORT).show();
        });
    }

    private void updateClock() {
        Date now = new Date();
        if (clockView != null) clockView.setText(clockFormat.format(now));
        if (dateView != null) dateView.setText(dateFormat.format(now));
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private float dpF(float value) {
        return value * getResources().getDisplayMetrics().density;
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
        enforceDailySessionReset();
    }

    @Override
    public void onBackPressed() {
        if (webView.getVisibility() == View.VISIBLE && !currentPurpose.isEmpty()) {
            leaveChurchSuite();
        } else {
            showHome();
        }
    }

    @Override
    protected void onDestroy() {
        handler.removeCallbacks(clockTick);
        cancelIdleTimeout();
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
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            if (isChurchSuite(url)) {
                floatingHomeButton.setVisibility(View.VISIBLE);
                floatingHomeButton.bringToFront();
            }
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            loadingOverlay.setVisibility(View.GONE);
            floatingHomeButton.bringToFront();
            injectActivityWatcher(view);
            if ("checkin".equals(currentPurpose) && isCheckInUrl(url)) injectCheckInWatcher(view);
            if ("join".equals(currentPurpose) && isJoinUrl(url)) injectJoinWatcher(view);
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            super.onReceivedError(view, request, error);
            if (request.isForMainFrame()) {
                showError(error.getDescription() == null ? "ChurchSuite did not respond." : error.getDescription().toString());
            }
        }
    }

    private final class KioskBridge {
        @JavascriptInterface
        public void checkInComplete() {
            handler.post(() -> {
                if (returnScheduled) return;
                returnScheduled = true;
                showCheckInSuccess();
            });
        }

        @JavascriptInterface
        public void joinComplete() {
            handler.post(() -> {
                if (returnScheduled) return;
                returnScheduled = true;
                showRegistrationSuccess();
            });
        }

        @JavascriptInterface
        public void activity() {
            handler.post(MainActivity.this::resetIdleTimeout);
        }
    }
}
