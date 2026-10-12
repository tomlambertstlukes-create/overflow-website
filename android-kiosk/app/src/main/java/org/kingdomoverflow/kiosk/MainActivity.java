package org.kingdomoverflow.kiosk;

import android.app.Activity;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
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
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Space;
import android.widget.TextView;
import android.widget.Toast;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends Activity {
    private static final String CHECKIN_URL = "https://kingdomoverflow.churchsuite.com/checkin";
    private static final String JOIN_FORM_URL = "https://kingdomoverflow.churchsuite.com/-/forms/zqtiiald";
    private static final String PREFS = "ko-kiosk";
    private static final String SESSION_READY = "session-ready";

    private static final int NAVY = Color.rgb(20, 29, 38);
    private static final int NAVY_DEEP = Color.rgb(16, 24, 33);
    private static final int PANEL = Color.rgb(31, 42, 53);
    private static final int PANEL_2 = Color.rgb(36, 48, 60);
    private static final int CREAM = Color.rgb(226, 226, 210);
    private static final int PINK = Color.rgb(197, 31, 93);
    private static final int HOT_PINK = Color.rgb(243, 0, 197);
    private static final int MUTED = Color.rgb(182, 187, 194);
    private static final int SUBTLE = Color.rgb(139, 148, 158);
    private static final int BLUE = Color.rgb(65, 98, 255);
    private static final int GREEN = Color.rgb(99, 214, 164);

    private final Handler handler = new Handler(Looper.getMainLooper());
    private final SimpleDateFormat clockFormat = new SimpleDateFormat("HH:mm", Locale.UK);
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("EEEE d MMMM", Locale.UK);

    private FrameLayout root;
    private WebView webView;
    private TextView floatingHomeButton;
    private SharedPreferences prefs;
    private boolean returnScheduled = false;
    private boolean showingHome = true;
    private TextView clockView;
    private TextView dateView;

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
        settings.setUserAgentString(settings.getUserAgentString() + " KingdomOverflowKiosk/1.0");

        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);
        cookies.setAcceptThirdPartyCookies(view, true);

        view.setBackgroundColor(Color.WHITE);
        view.addJavascriptInterface(new CheckInBridge(), "KOKiosk");
        view.setWebViewClient(new KioskWebViewClient());
    }

    private void createFloatingHomeButton() {
        floatingHomeButton = text("‹  KO home", 13f, Color.WHITE, true);
        floatingHomeButton.setGravity(Gravity.CENTER);
        floatingHomeButton.setBackground(roundRect(PINK, 999f));
        floatingHomeButton.setPadding(dp(16), 0, dp(16), 0);
        floatingHomeButton.setElevation(dp(8));
        floatingHomeButton.setVisibility(View.GONE);
        floatingHomeButton.setOnClickListener(v -> showHome());

        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(dp(122), dp(48));
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
        t.setIncludeFontPadding(false);
        t.setTypeface(Typeface.create("sans-serif", bold ? Typeface.BOLD : Typeface.NORMAL));
        return t;
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

    private void addDecor(FrameLayout frame) {
        View pinkGlow = new View(this);
        GradientDrawable pink = new GradientDrawable();
        pink.setShape(GradientDrawable.OVAL);
        pink.setGradientType(GradientDrawable.RADIAL_GRADIENT);
        pink.setGradientRadius(dpF(180));
        pink.setColors(new int[]{Color.argb(58, 243, 0, 197), Color.TRANSPARENT});
        pinkGlow.setBackground(pink);
        FrameLayout.LayoutParams p1 = new FrameLayout.LayoutParams(dp(360), dp(360));
        p1.gravity = Gravity.TOP | Gravity.START;
        p1.leftMargin = -dp(160);
        p1.topMargin = -dp(170);
        frame.addView(pinkGlow, p1);

        View blueGlow = new View(this);
        GradientDrawable blue = new GradientDrawable();
        blue.setShape(GradientDrawable.OVAL);
        blue.setGradientType(GradientDrawable.RADIAL_GRADIENT);
        blue.setGradientRadius(dpF(170));
        blue.setColors(new int[]{Color.argb(42, 65, 98, 255), Color.TRANSPARENT});
        blueGlow.setBackground(blue);
        FrameLayout.LayoutParams p2 = new FrameLayout.LayoutParams(dp(340), dp(340));
        p2.gravity = Gravity.BOTTOM | Gravity.END;
        p2.rightMargin = -dp(150);
        p2.bottomMargin = -dp(155);
        frame.addView(blueGlow, p2);
    }

    private TextView pill(String value, int foreground, int background, boolean bold) {
        TextView p = text(value, 11f, foreground, bold);
        p.setGravity(Gravity.CENTER);
        p.setLetterSpacing(0.12f);
        p.setBackground(roundRectStroke(background, 999f, Color.argb(28, 255, 255, 255), 1));
        p.setPadding(dp(15), dp(8), dp(15), dp(8));
        return p;
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
            card.setBackground(roundRectStroke(CREAM, 28f, Color.argb(34, 255, 255, 255), 1));
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
        card.addView(spacer, new LinearLayout.LayoutParams(1, dp(34)));

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
        }
        return card;
    }

    private void showHome() {
        showingHome = true;
        returnScheduled = false;
        clearNativeScreens();
        webView.setVisibility(View.GONE);
        floatingHomeButton.setVisibility(View.GONE);

        boolean sessionReady = prefs.getBoolean(SESSION_READY, false);
        boolean tablet = getResources().getDisplayMetrics().widthPixels / getResources().getDisplayMetrics().density >= 700f;

        FrameLayout shell = new FrameLayout(this);
        shell.setBackground(createLinearGradient(new int[]{NAVY, NAVY_DEEP}, GradientDrawable.Orientation.TL_BR));
        addDecor(shell);

        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.setClipToPadding(false);
        shell.addView(scroll, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);
        page.setPadding(dp(tablet ? 50 : 24), dp(tablet ? 44 : 28), dp(tablet ? 50 : 24), dp(24));
        page.setGravity(Gravity.CENTER_HORIZONTAL);
        scroll.addView(page, new ScrollView.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        LinearLayout header = new LinearLayout(this);
        header.setGravity(Gravity.CENTER_VERTICAL);

        LinearLayout brand = new LinearLayout(this);
        brand.setGravity(Gravity.CENTER_VERTICAL);
        TextView mark = text("KO", 17f, CREAM, true);
        mark.setGravity(Gravity.CENTER);
        mark.setBackground(gradientCard(new int[]{PINK, Color.rgb(139, 18, 72)}, 18f));
        mark.setElevation(dp(6));
        brand.addView(mark, new LinearLayout.LayoutParams(dp(58), dp(58)));

        LinearLayout brandCopy = new LinearLayout(this);
        brandCopy.setOrientation(LinearLayout.VERTICAL);
        brandCopy.setPadding(dp(14), 0, 0, 0);
        brandCopy.addView(text("Kingdom Overflow", tablet ? 22f : 19f, CREAM, true));
        TextView strap = text("BELONGING  •  OPPORTUNITY  •  WELLBEING", tablet ? 9.5f : 8.3f, Color.rgb(140, 148, 158), false);
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
        page.addView(topGap, new LinearLayout.LayoutParams(1, dp(tablet ? 68 : 48)));

        TextView welcome = pill("✦  WELCOME", Color.rgb(213, 217, 221), Color.argb(15, 255, 255, 255), true);
        page.addView(welcome);

        TextView hello = text("Good to see you.", tablet ? 48f : 38f, Color.WHITE, true);
        hello.setGravity(Gravity.CENTER);
        hello.setPadding(0, dp(18), 0, 0);
        page.addView(hello, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        TextView intro = text("Let’s get you checked in.", tablet ? 43f : 30f, Color.rgb(244, 122, 173), true);
        intro.setGravity(Gravity.CENTER);
        intro.setPadding(0, dp(4), 0, 0);
        page.addView(intro, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        TextView helper = text(
                "Been before? Check in for today. First time with us? Register once, then you’ll be ready to check in.",
                tablet ? 17f : 15f,
                MUTED,
                false
        );
        helper.setGravity(Gravity.CENTER);
        helper.setMaxWidth(dp(720));
        helper.setPadding(dp(10), dp(20), dp(10), dp(tablet ? 38 : 30));
        page.addView(helper, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        if (!sessionReady) {
            LinearLayout notice = new LinearLayout(this);
            notice.setGravity(Gravity.CENTER_VERTICAL);
            notice.setPadding(dp(16), dp(12), dp(16), dp(12));
            notice.setBackground(roundRectStroke(Color.argb(16, 255, 255, 255), 18f, Color.argb(28, 255, 255, 255), 1));
            TextView dot = text("●", 12f, Color.rgb(245, 191, 104), true);
            notice.addView(dot);
            TextView n = text("  Waiting for a team member to start today’s session", 12.5f, Color.rgb(202, 207, 212), true);
            notice.addView(n);
            LinearLayout.LayoutParams np = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            np.bottomMargin = dp(18);
            page.addView(notice, np);
        }

        LinearLayout choices = new LinearLayout(this);
        choices.setOrientation(tablet ? LinearLayout.HORIZONTAL : LinearLayout.VERTICAL);
        choices.setGravity(Gravity.CENTER);

        View checkIn = choiceCard(
                sessionReady ? "✓" : "○",
                sessionReady ? "I’ve been before" : "Waiting for staff",
                "Check in",
                sessionReady ? "Find your name and check in for today" : "Today’s ChurchSuite session needs to be started first",
                true,
                sessionReady,
                v -> openWeb(CHECKIN_URL)
        );
        View newHere = choiceCard(
                "+",
                "First time with us",
                "New here",
                "Register once, then check in today",
                false,
                true,
                v -> openWeb(JOIN_FORM_URL)
        );

        if (tablet) {
            LinearLayout.LayoutParams lp1 = new LinearLayout.LayoutParams(0, dp(270), 1f);
            lp1.rightMargin = dp(10);
            choices.addView(checkIn, lp1);
            LinearLayout.LayoutParams lp2 = new LinearLayout.LayoutParams(0, dp(270), 1f);
            lp2.leftMargin = dp(10);
            choices.addView(newHere, lp2);
        } else {
            choices.addView(checkIn, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(235)));
            Space cGap = new Space(this);
            choices.addView(cGap, new LinearLayout.LayoutParams(1, dp(16)));
            choices.addView(newHere, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(235)));
        }
        page.addView(choices, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        Space lower = new Space(this);
        page.addView(lower, new LinearLayout.LayoutParams(1, dp(tablet ? 36 : 28)));

        LinearLayout footer = new LinearLayout(this);
        footer.setGravity(Gravity.CENTER_VERTICAL);
        TextView secure = text("ChurchSuite-powered • secure check-in", 11.5f, Color.rgb(113, 123, 133), false);
        footer.addView(secure, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        TextView staff = text(sessionReady ? "Staff  •  Session live" : "Staff controls", 12.5f, Color.rgb(206, 210, 214), true);
        staff.setGravity(Gravity.CENTER);
        staff.setBackground(roundRectStroke(Color.argb(15, 255, 255, 255), 999f, Color.argb(30, 255, 255, 255), 1));
        staff.setPadding(dp(17), dp(11), dp(17), dp(11));
        staff.setOnClickListener(v -> showStaff());
        footer.addView(staff);
        page.addView(footer, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        root.addView(shell, 1, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
    }

    private void showStaff() {
        showingHome = false;
        clearNativeScreens();
        webView.setVisibility(View.GONE);
        floatingHomeButton.setVisibility(View.GONE);
        boolean sessionReady = prefs.getBoolean(SESSION_READY, false);

        FrameLayout shell = new FrameLayout(this);
        shell.setBackground(createLinearGradient(new int[]{NAVY_DEEP, NAVY}, GradientDrawable.Orientation.TL_BR));
        addDecor(shell);

        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        shell.addView(scroll, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);
        page.setPadding(dp(28), dp(38), dp(28), dp(30));
        scroll.addView(page, new ScrollView.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        TextView back = pill("‹  CHECK-IN HOME", Color.rgb(219, 222, 225), Color.argb(17, 255, 255, 255), true);
        back.setGravity(Gravity.CENTER);
        back.setOnClickListener(v -> showHome());
        page.addView(back, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        Space top = new Space(this);
        page.addView(top, new LinearLayout.LayoutParams(1, dp(46)));

        TextView eyebrow = text("STAFF CONTROLS", 11f, Color.rgb(255, 96, 201), true);
        eyebrow.setLetterSpacing(0.18f);
        page.addView(eyebrow);
        TextView heading = text(sessionReady ? "Today’s session is live" : "Start today’s session", 37f, Color.WHITE, true);
        heading.setPadding(0, dp(10), 0, dp(14));
        page.addView(heading);

        TextView body = text(
                sessionReady
                        ? "Open ChurchSuite to manage or close the current session. When you have closed it there, confirm below so the kiosk returns to standby."
                        : "Open ChurchSuite, choose Show More → Create from gathering → choose the Gathering → confirm/save. Then come back here and mark the session live.",
                16f,
                MUTED,
                false
        );
        body.setPadding(0, 0, 0, dp(28));
        page.addView(body);

        TextView churchSuite = text(sessionReady ? "Open ChurchSuite session   →" : "Open ChurchSuite session setup   →", 16f, Color.WHITE, true);
        churchSuite.setGravity(Gravity.CENTER_VERTICAL);
        churchSuite.setPadding(dp(22), 0, dp(22), 0);
        churchSuite.setBackground(gradientCard(new int[]{HOT_PINK, PINK}, 20f));
        churchSuite.setElevation(dp(8));
        churchSuite.setOnClickListener(v -> openWeb(CHECKIN_URL));
        page.addView(churchSuite, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(74)));

        Space gap = new Space(this);
        page.addView(gap, new LinearLayout.LayoutParams(1, dp(14)));

        TextView confirm = text(sessionReady ? "Session is closed — return home   →" : "Session is live — return home   →", 16f, NAVY, true);
        confirm.setGravity(Gravity.CENTER_VERTICAL);
        confirm.setPadding(dp(22), 0, dp(22), 0);
        confirm.setBackground(roundRect(CREAM, 20f));
        confirm.setOnClickListener(v -> {
            prefs.edit().putBoolean(SESSION_READY, !sessionReady).apply();
            showHome();
        });
        page.addView(confirm, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(74)));

        TextView note = text("ChurchSuite sign-in is remembered inside this kiosk app, so staff should normally only need to sign in once on this device.", 12.5f, Color.rgb(126, 136, 146), false);
        note.setPadding(0, dp(24), 0, 0);
        page.addView(note);

        root.addView(shell, 1, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
    }

    private void showError(String detail) {
        showingHome = false;
        clearNativeScreens();
        webView.setVisibility(View.GONE);
        floatingHomeButton.setVisibility(View.GONE);

        FrameLayout shell = new FrameLayout(this);
        shell.setBackground(createLinearGradient(new int[]{NAVY, NAVY_DEEP}, GradientDrawable.Orientation.TL_BR));
        addDecor(shell);

        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);
        page.setGravity(Gravity.CENTER);
        page.setPadding(dp(34), dp(34), dp(34), dp(34));
        shell.addView(page, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        TextView icon = text("!", 26f, CREAM, true);
        icon.setGravity(Gravity.CENTER);
        icon.setBackground(roundRect(PINK, 18f));
        page.addView(icon, new LinearLayout.LayoutParams(dp(58), dp(58)));

        TextView heading = text("We couldn’t load ChurchSuite", 28f, Color.WHITE, true);
        heading.setGravity(Gravity.CENTER);
        heading.setPadding(0, dp(20), 0, 0);
        page.addView(heading);

        TextView body = text(detail + "\n\nCheck the internet connection, then try again.", 15f, MUTED, false);
        body.setGravity(Gravity.CENTER);
        body.setPadding(0, dp(14), 0, dp(26));
        page.addView(body);

        TextView home = text("Return to KO home   →", 15f, NAVY, true);
        home.setGravity(Gravity.CENTER);
        home.setBackground(roundRect(CREAM, 18f));
        home.setOnClickListener(v -> showHome());
        page.addView(home, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(66)));

        root.addView(shell, 1, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
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
        host = host.toLowerCase(Locale.UK);
        return host.equals("churchsuite.com") || host.endsWith(".churchsuite.com");
    }

    private boolean isCheckInUrl(String url) {
        return url != null && url.toLowerCase(Locale.UK).contains("churchsuite.com") && url.toLowerCase(Locale.UK).contains("/checkin");
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
    }

    @Override
    public void onBackPressed() {
        if (webView.getVisibility() == View.VISIBLE) {
            showHome();
            return;
        }
        if (!showingHome) {
            showHome();
            return;
        }
        showHome();
    }

    @Override
    protected void onDestroy() {
        handler.removeCallbacksAndMessages(null);
        CookieManager.getInstance().flush();
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
            CookieManager.getInstance().flush();
            if (isCheckInUrl(url)) injectSuccessWatcher(view);
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            super.onReceivedError(view, request, error);
            if (request.isForMainFrame()) {
                showError("ChurchSuite returned a loading error.");
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
