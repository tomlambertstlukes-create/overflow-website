package org.kingdomoverflow.kiosk;

import android.app.Activity;
import android.app.AlertDialog;
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
import android.text.InputType;
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
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Space;
import android.widget.TextView;
import android.widget.Toast;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class KioskActivity extends Activity {
    private static final String CHECKIN_URL = "https://kingdomoverflow.churchsuite.com/checkin";
    private static final String JOIN_URL = "https://kingdomoverflow.churchsuite.com/-/forms/zqtiiald";
    private static final String PREFS = "ko-kiosk";
    private static final String SESSION_READY = "session-ready";
    private static final String SESSION_DATE = "session-date";
    private static final String GATHERING_ID = "gathering-id";
    private static final String GATHERING_NAME = "gathering-name";
    private static final String STAFF_PIN_HASH = "staff-pin-hash";

    private static final int NAVY = Color.rgb(20,29,38);
    private static final int NAVY_DEEP = Color.rgb(16,24,33);
    private static final int PANEL = Color.rgb(34,46,58);
    private static final int CREAM = Color.rgb(226,226,210);
    private static final int PINK = Color.rgb(197,31,93);
    private static final int HOT_PINK = Color.rgb(243,0,197);
    private static final int MUTED = Color.rgb(180,186,194);
    private static final int GREEN = Color.rgb(99,214,164);
    private static final int ORANGE = Color.rgb(217,130,69);

    private static final String[][] GATHERINGS = new String[][]{
            {"hub","Overflow Hub","overflow-hub-wordmark.png"},
            {"am","Overflow:AM","overflow-am-wordmark.png"},
            {"dance","Overflow Dance","overflow-dance-wordmark.png"},
            {"football","Overflow Football","overflow-football-wordmark.png"},
            {"create","Overflow Create","overflow-create-wordmark.png"},
            {"wellbeing","Overflow Wellbeing Centre",""}
    };

    private final Handler handler = new Handler(Looper.getMainLooper());
    private final SimpleDateFormat dayKeyFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.UK);
    private final SimpleDateFormat clockFormat = new SimpleDateFormat("HH:mm", Locale.UK);

    private FrameLayout root;
    private WebView webView;
    private FrameLayout loadingOverlay;
    private TextView floatingHome;
    private SharedPreferences prefs;
    private String purpose = "";
    private boolean completionTriggered = false;
    private Runnable idleTimeout;

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        hideSystemUi();
        prefs = getSharedPreferences(PREFS, MODE_PRIVATE);
        normalizeSession();

        root = new FrameLayout(this);
        root.setBackground(gradient(new int[]{NAVY,NAVY_DEEP}, GradientDrawable.Orientation.TL_BR));
        setContentView(root);

        webView = new WebView(this);
        configureWebView();
        webView.setVisibility(View.GONE);
        root.addView(webView, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        createLoadingOverlay();
        createFloatingHome();
        showHome();
    }

    private void configureWebView() {
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setLoadsImagesAutomatically(true);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setSaveFormData(false);
        s.setSupportMultipleWindows(false);
        s.setUserAgentString(s.getUserAgentString()+" KingdomOverflowKiosk/2.1");
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView,true);
        webView.addJavascriptInterface(new Bridge(),"KOKiosk");
        webView.setWebViewClient(new Client());
        webView.setBackgroundColor(Color.WHITE);
    }

    private void createLoadingOverlay() {
        loadingOverlay = new FrameLayout(this);
        loadingOverlay.setBackground(gradient(new int[]{NAVY,NAVY_DEEP}, GradientDrawable.Orientation.TL_BR));
        loadingOverlay.setVisibility(View.GONE);
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL); box.setGravity(Gravity.CENTER);
        ImageView logo = image("ko-logo-dark.png");
        box.addView(logo,new LinearLayout.LayoutParams(dp(92),dp(92)));
        TextView t = text("Opening ChurchSuite…",20,CREAM,true); t.setGravity(Gravity.CENTER); t.setPadding(0,dp(22),0,0); box.addView(t);
        TextView sub = text("SECURE KO CHECK-IN",11,MUTED,true); sub.setLetterSpacing(.16f); sub.setGravity(Gravity.CENTER); sub.setPadding(0,dp(8),0,0); box.addView(sub);
        loadingOverlay.addView(box,new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.MATCH_PARENT));
        root.addView(loadingOverlay,new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.MATCH_PARENT));
    }

    private void createFloatingHome() {
        floatingHome = text("‹  KO home",13,Color.WHITE,true);
        floatingHome.setGravity(Gravity.CENTER); floatingHome.setBackground(round(PINK,999)); floatingHome.setVisibility(View.GONE);
        floatingHome.setOnClickListener(v -> { if (purpose.startsWith("staff")) showStaff(); else showHome(); });
        FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(dp(126),dp(48)); lp.gravity=Gravity.TOP|Gravity.END; lp.topMargin=dp(14); lp.rightMargin=dp(14);
        root.addView(floatingHome,lp);
    }

    private void clearNative() {
        for(int i=root.getChildCount()-1;i>=0;i--){ View child=root.getChildAt(i); if(child!=webView && child!=loadingOverlay && child!=floatingHome) root.removeViewAt(i); }
    }

    private void showHome() {
        normalizeSession(); cancelIdle(); purpose=""; completionTriggered=false;
        clearNative(); webView.stopLoading(); webView.loadUrl("about:blank"); webView.clearHistory(); webView.clearFormData(); webView.setVisibility(View.GONE); loadingOverlay.setVisibility(View.GONE); floatingHome.setVisibility(View.GONE);

        boolean tablet = isTablet();
        FrameLayout shell = shell();
        ScrollView scroll = new ScrollView(this); scroll.setFillViewport(true); shell.addView(scroll,new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.MATCH_PARENT));
        LinearLayout page = new LinearLayout(this); page.setOrientation(LinearLayout.VERTICAL); page.setGravity(Gravity.CENTER_HORIZONTAL); page.setPadding(dp(tablet?52:24),dp(tablet?40:26),dp(tablet?52:24),dp(26));
        scroll.addView(page,new ScrollView.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.WRAP_CONTENT));

        LinearLayout header = new LinearLayout(this); header.setGravity(Gravity.CENTER_VERTICAL);
        ImageView logo = image("ko-logo-dark.png"); header.addView(logo,new LinearLayout.LayoutParams(dp(64),dp(64)));
        LinearLayout brand = new LinearLayout(this); brand.setOrientation(LinearLayout.VERTICAL); brand.setPadding(dp(14),0,0,0);
        brand.addView(text("Kingdom Overflow",tablet?23:20,CREAM,true));
        TextView strap=text("BELONGING  •  OPPORTUNITY  •  WELLBEING",tablet?10:8,MUTED,false); strap.setLetterSpacing(.12f); brand.addView(strap);
        header.addView(brand,new LinearLayout.LayoutParams(0,ViewGroup.LayoutParams.WRAP_CONTENT,1));
        TextView time=text(clockFormat.format(new Date()),tablet?29:23,CREAM,true); time.setGravity(Gravity.END); header.addView(time);
        page.addView(header,new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.WRAP_CONTENT));

        page.addView(space(tablet?54:38));
        TextView welcome=pill("✦  WELCOME"); page.addView(welcome);
        TextView h1=text("Good to see you.",tablet?50:39,Color.WHITE,true); h1.setGravity(Gravity.CENTER); h1.setPadding(0,dp(18),0,0); page.addView(h1,new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.WRAP_CONTENT));
        TextView h2=text("Let’s get you checked in.",tablet?44:30,Color.WHITE,true); h2.setGravity(Gravity.CENTER); h2.setPadding(0,dp(5),0,0); page.addView(h2,new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.WRAP_CONTENT)); applyGradientText(h2);
        TextView helper=text("Been before? Check in for today. First time with us? Register once, then you’ll be ready to check in.",tablet?17:15,MUTED,false); helper.setGravity(Gravity.CENTER); helper.setPadding(dp(8),dp(18),dp(8),dp(26)); page.addView(helper,new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.WRAP_CONTENT));

        if(isSessionReady()) page.addView(activeBanner()); else page.addView(statusNotice("●   Waiting for a team member to start today’s session",ORANGE));

        LinearLayout cards=new LinearLayout(this); cards.setOrientation(tablet?LinearLayout.HORIZONTAL:LinearLayout.VERTICAL); cards.setPadding(0,dp(28),0,0);
        View c1=choiceCard(isSessionReady()?"✓":"◷",isSessionReady()?"I’VE BEEN BEFORE":"WAITING FOR STAFF","Check in",isSessionReady()?"Find your name and check in for today":"Today’s ChurchSuite session needs to be started first",true,isSessionReady(),v->openWeb(CHECKIN_URL,"checkin"));
        View c2=choiceCard("+","FIRST TIME WITH US","New here","Register once, then check in today",false,true,v->openWeb(JOIN_URL,"join"));
        if(tablet){ cards.addView(c1,new LinearLayout.LayoutParams(0,dp(248),1)); cards.addView(spaceH(20)); cards.addView(c2,new LinearLayout.LayoutParams(0,dp(248),1)); }
        else { cards.addView(c1,new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,dp(220))); cards.addView(space(16)); cards.addView(c2,new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,dp(220))); }
        page.addView(cards,new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.WRAP_CONTENT));

        LinearLayout footer=new LinearLayout(this); footer.setGravity(Gravity.CENTER_VERTICAL); footer.setPadding(0,dp(28),0,0);
        TextView online=text((isOnline()?"●  Online":"●  Offline")+"    •    KO Kiosk 2.1",11,isOnline()?GREEN:ORANGE,true); footer.addView(online,new LinearLayout.LayoutParams(0,ViewGroup.LayoutParams.WRAP_CONTENT,1));
        TextView staff=pill(isSessionReady()?"SESSION LIVE  •  HOLD FOR STAFF":"PRESS & HOLD FOR STAFF");
        staff.setOnLongClickListener(v->{ requestStaffAccess(); return true; });
        footer.addView(staff); page.addView(footer,new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.WRAP_CONTENT));

        root.addView(shell,1,new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.MATCH_PARENT));
    }

    private void requestStaffAccess() {
        String saved=prefs.getString(STAFF_PIN_HASH,"");
        if(saved.isEmpty()) setupPin(false); else verifyPin(saved);
    }

    private void setupPin(boolean changing) {
        promptPin(changing?"Create a new staff PIN":"Create staff PIN","Choose a 4-digit PIN for this kiosk.",first->{
            if(first.length()!=4){ Toast.makeText(this,"PIN must be 4 digits",Toast.LENGTH_SHORT).show(); setupPin(changing); return; }
            promptPin("Confirm staff PIN","Enter the same 4 digits again.",second->{
                if(first.equals(second)){ prefs.edit().putString(STAFF_PIN_HASH,hashPin(first)).apply(); showStaff(); }
                else { Toast.makeText(this,"PINs did not match",Toast.LENGTH_SHORT).show(); setupPin(changing); }
            });
        });
    }

    private void verifyPin(String savedHash) {
        promptPin("Staff access","Enter the 4-digit staff PIN.",pin->{
            if(hashPin(pin).equals(savedHash)) showStaff(); else { Toast.makeText(this,"Incorrect staff PIN",Toast.LENGTH_SHORT).show(); }
        });
    }

    private interface PinCallback { void run(String pin); }
    private void promptPin(String title,String message,PinCallback callback) {
        EditText input=new EditText(this); input.setInputType(InputType.TYPE_CLASS_NUMBER|InputType.TYPE_NUMBER_VARIATION_PASSWORD); input.setGravity(Gravity.CENTER); input.setTextSize(26); input.setSingleLine(true); input.setHint("••••");
        FrameLayout holder=new FrameLayout(this); holder.setPadding(dp(28),0,dp(28),0); holder.addView(input,new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,dp(64)));
        AlertDialog dialog=new AlertDialog.Builder(this).setTitle(title).setMessage(message).setView(holder).setNegativeButton("Cancel",null).setPositiveButton("Continue",null).create();
        dialog.setOnShowListener(d-> dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(v->{ String pin=input.getText().toString().trim(); if(pin.matches("\\d{4}")){ dialog.dismiss(); callback.run(pin);} else input.setError("Enter 4 digits"); }));
        dialog.getWindow(); dialog.show();
    }

    private String hashPin(String pin) {
        try { MessageDigest md=MessageDigest.getInstance("SHA-256"); byte[] b=md.digest(pin.getBytes(StandardCharsets.UTF_8)); StringBuilder out=new StringBuilder(); for(byte x:b) out.append(String.format(Locale.US,"%02x",x)); return out.toString(); }
        catch(Exception e){ return pin; }
    }

    private void showStaff() {
        normalizeSession(); cancelIdle(); purpose=""; clearNative(); webView.setVisibility(View.GONE); loadingOverlay.setVisibility(View.GONE); floatingHome.setVisibility(View.GONE);
        boolean tablet=isTablet(); FrameLayout shell=shell(); ScrollView scroll=new ScrollView(this); scroll.setFillViewport(true); shell.addView(scroll,new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.MATCH_PARENT));
        LinearLayout page=new LinearLayout(this); page.setOrientation(LinearLayout.VERTICAL); page.setPadding(dp(tablet?52:24),dp(tablet?40:26),dp(tablet?52:24),dp(28)); scroll.addView(page,new ScrollView.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.WRAP_CONTENT));
        TextView back=pill("‹  CHECK-IN HOME"); back.setOnClickListener(v->showHome()); page.addView(back,new LinearLayout.LayoutParams(dp(158),dp(46)));
        TextView eyebrow=text("STAFF CONTROLS",11,HOT_PINK,true); eyebrow.setLetterSpacing(.18f); eyebrow.setPadding(0,dp(42),0,0); page.addView(eyebrow);
        TextView title=text(isSessionReady()?"Today’s session is live":"Start today’s session",tablet?45:35,Color.WHITE,true); title.setPadding(0,dp(10),0,dp(12)); page.addView(title);
        TextView info=text(isSessionReady()?selectedGatheringName()+" is live. KO will automatically recognise when ChurchSuite closes it.":"Choose the KO gathering, then open ChurchSuite. KO will automatically recognise when that session becomes live.",tablet?17:15,MUTED,false); info.setPadding(0,0,0,dp(26)); page.addView(info);

        if(!isSessionReady()){ TextView choose=text("CHOOSE GATHERING",10,MUTED,true); choose.setLetterSpacing(.16f); page.addView(choose); page.addView(gatheringSelector()); }
        else page.addView(activeBanner());

        TextView open=text(isSessionReady()?"OPEN CHURCHSUITE TO CLOSE SESSION   →":"START IN CHURCHSUITE   →",15,NAVY,true); open.setGravity(Gravity.CENTER); open.setBackground(brandGradient(22)); open.setOnClickListener(v->openWeb(CHECKIN_URL,isSessionReady()?"staff-close":"staff-start"));
        LinearLayout.LayoutParams op=new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,dp(72)); op.topMargin=dp(28); page.addView(open,op);

        LinearLayout tools=new LinearLayout(this); tools.setOrientation(tablet?LinearLayout.HORIZONTAL:LinearLayout.VERTICAL); tools.setPadding(0,dp(16),0,0);
        TextView manual=pill(isSessionReady()?"MARK CLOSED MANUALLY":"MARK LIVE MANUALLY"); manual.setOnClickListener(v->{ markSession(!isSessionReady()); showHome(); }); tools.addView(manual,new LinearLayout.LayoutParams(tablet?0:ViewGroup.LayoutParams.MATCH_PARENT,dp(52),tablet?1:0));
        TextView change=pill("CHANGE STAFF PIN"); change.setOnClickListener(v->{ prefs.edit().remove(STAFF_PIN_HASH).apply(); setupPin(true); }); LinearLayout.LayoutParams cp=new LinearLayout.LayoutParams(tablet?0:ViewGroup.LayoutParams.MATCH_PARENT,dp(52),tablet?1:0); if(tablet) cp.leftMargin=dp(10); else cp.topMargin=dp(10); tools.addView(change,cp);
        TextView reset=pill("RESET CHURCHSUITE LOGIN"); reset.setOnClickListener(v->resetChurchSuite()); LinearLayout.LayoutParams rp=new LinearLayout.LayoutParams(tablet?0:ViewGroup.LayoutParams.MATCH_PARENT,dp(52),tablet?1:0); if(tablet) rp.leftMargin=dp(10); else rp.topMargin=dp(10); tools.addView(reset,rp);
        page.addView(tools,new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.WRAP_CONTENT));
        root.addView(shell,1,new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.MATCH_PARENT));
    }

    private View gatheringSelector() {
        HorizontalScrollView scroll=new HorizontalScrollView(this); scroll.setHorizontalScrollBarEnabled(false); LinearLayout row=new LinearLayout(this); row.setPadding(0,dp(12),0,dp(12)); scroll.addView(row);
        for(String[] g:GATHERINGS){ boolean active=g[0].equals(selectedGatheringId()); LinearLayout card=new LinearLayout(this); card.setOrientation(LinearLayout.VERTICAL); card.setGravity(Gravity.CENTER); card.setPadding(dp(14),dp(10),dp(14),dp(10)); card.setBackground(roundStroke(active?Color.argb(55,197,31,93):Color.argb(12,255,255,255),20,active?HOT_PINK:Color.argb(28,255,255,255)));
            if(!g[2].isEmpty()) card.addView(image(g[2]),new LinearLayout.LayoutParams(dp(145),dp(44))); else { TextView w=text("OVERFLOW",14,CREAM,true); w.setGravity(Gravity.CENTER); card.addView(w,new LinearLayout.LayoutParams(dp(145),dp(44))); }
            TextView label=text(g[1],11,active?CREAM:MUTED,true); label.setGravity(Gravity.CENTER); label.setPadding(0,dp(5),0,0); card.addView(label);
            card.setOnClickListener(v->{ prefs.edit().putString(GATHERING_ID,g[0]).putString(GATHERING_NAME,g[1]).apply(); showStaff(); });
            LinearLayout.LayoutParams lp=new LinearLayout.LayoutParams(dp(182),dp(94)); lp.rightMargin=dp(12); row.addView(card,lp);
        }
        return scroll;
    }

    private void openWeb(String url,String newPurpose) {
        purpose=newPurpose; completionTriggered=false; clearNative(); webView.setVisibility(View.VISIBLE); webView.bringToFront(); floatingHome.setVisibility(View.VISIBLE); floatingHome.bringToFront(); loadingOverlay.setVisibility(View.VISIBLE); loadingOverlay.bringToFront(); floatingHome.bringToFront(); webView.loadUrl(url); resetIdle();
    }

    private void showCheckInSuccess() {
        cancelIdle(); purpose=""; clearNative(); webView.stopLoading(); webView.loadUrl("about:blank"); webView.clearHistory(); webView.clearFormData(); webView.setVisibility(View.GONE); loadingOverlay.setVisibility(View.GONE); floatingHome.setVisibility(View.GONE);
        FrameLayout shell=shell(); LinearLayout page=new LinearLayout(this); page.setOrientation(LinearLayout.VERTICAL); page.setGravity(Gravity.CENTER); page.setPadding(dp(28),dp(28),dp(28),dp(28)); shell.addView(page,new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.MATCH_PARENT));
        TextView tick=text("✓",40,NAVY,true); tick.setGravity(Gravity.CENTER); tick.setBackground(round(CREAM,999)); page.addView(tick,new LinearLayout.LayoutParams(dp(84),dp(84)));
        TextView title=text("You’re checked in.",isTablet()?48:38,Color.WHITE,true); title.setGravity(Gravity.CENTER); title.setPadding(0,dp(24),0,dp(10)); page.addView(title);
        TextView sub=text("Have a great session.",17,MUTED,false); sub.setGravity(Gravity.CENTER); page.addView(sub);
        root.addView(shell,1,new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.MATCH_PARENT)); handler.postDelayed(this::showHome,1400);
    }

    private void showRegistrationSuccess() {
        cancelIdle(); purpose=""; clearNative(); webView.stopLoading(); webView.loadUrl("about:blank"); webView.clearHistory(); webView.clearFormData(); webView.setVisibility(View.GONE); loadingOverlay.setVisibility(View.GONE); floatingHome.setVisibility(View.GONE);
        FrameLayout shell=shell(); LinearLayout page=new LinearLayout(this); page.setOrientation(LinearLayout.VERTICAL); page.setGravity(Gravity.CENTER); page.setPadding(dp(30),dp(30),dp(30),dp(30)); shell.addView(page,new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.MATCH_PARENT));
        page.addView(image("ko-logo-dark.png"),new LinearLayout.LayoutParams(dp(82),dp(82)));
        TextView eye=text("WELCOME TO KINGDOM OVERFLOW",11,HOT_PINK,true); eye.setLetterSpacing(.16f); eye.setPadding(0,dp(22),0,0); page.addView(eye);
        TextView title=text("You’re registered.",isTablet()?46:36,Color.WHITE,true); title.setGravity(Gravity.CENTER); title.setPadding(0,dp(10),0,dp(12)); page.addView(title);
        TextView sub=text("Your KO record is ready. You can now check in for today.",16,MUTED,false); sub.setGravity(Gravity.CENTER); page.addView(sub);
        if(isSessionReady()){ TextView check=text("CHECK IN FOR TODAY   →",16,NAVY,true); check.setGravity(Gravity.CENTER); check.setBackground(brandGradient(22)); check.setOnClickListener(v->openWeb(CHECKIN_URL,"checkin")); LinearLayout.LayoutParams lp=new LinearLayout.LayoutParams(Math.min(dp(650),getResources().getDisplayMetrics().widthPixels-dp(56)),dp(72)); lp.topMargin=dp(28); page.addView(check,lp); }
        TextView home=pill("RETURN HOME"); home.setGravity(Gravity.CENTER); home.setOnClickListener(v->showHome()); LinearLayout.LayoutParams hp=new LinearLayout.LayoutParams(dp(180),dp(52)); hp.topMargin=dp(14); page.addView(home,hp);
        root.addView(shell,1,new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.MATCH_PARENT));
    }

    private void injectActivity() {
        webView.evaluateJavascript("(function(){if(window.__koActivity)return;window.__koActivity=true;let last=0;function p(){let n=Date.now();if(n-last>5000){last=n;KOKiosk.activity();}}['touchstart','click','keydown','input'].forEach(e=>document.addEventListener(e,p,true));})();",null);
    }

    private void injectCheckInWatcher() {
        webView.evaluateJavascript("(function(){if(window.__koCI)return;window.__koCI=true;const p=[\"you're checked in\",\"you’re checked in\",\"checked in successfully\",\"successfully checked in\",\"check-in complete\",\"check in complete\"];function c(){let t=((document.body&&document.body.innerText)||'').toLowerCase();for(const x of p){if(t.includes(x)){KOKiosk.checkInComplete();return;}}}new MutationObserver(c).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true});setInterval(c,300);c();})();",null);
    }

    private void injectJoinWatcher() {
        webView.evaluateJavascript("(function(){if(window.__koJoin)return;window.__koJoin=true;function c(){let t=((document.body&&document.body.innerText)||'').toLowerCase();let ok=(t.includes('thank you')&&(t.includes('submitted')||t.includes('response')||t.includes('completed')||t.includes('received')))||t.includes('form has been submitted')||t.includes('response has been submitted')||t.includes('submission received');if(ok)KOKiosk.joinComplete();}new MutationObserver(c).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true});setInterval(c,350);c();})();",null);
    }

    private void injectSessionWatcher() {
        String js="(function(){if(window.__koSession)return;window.__koSession=true;let prev='';const gs=['Overflow Hub','Overflow:AM','Overflow Dance','Overflow Football','Overflow Create','Overflow Wellbeing Centre'];function score(t,a){let n=0;for(const x of a)if(t.includes(x))n++;return n;}function c(){let raw=(document.body&&document.body.innerText)||'';let t=raw.toLowerCase();let a=score(t,['close session','end session','session admin','session details','check out all','checkout all','session is open','session open']);let i=score(t,['create from gathering','create session','start a session','start session','new session','no active session','join a session','select a gathering']);let state='';if(a>=2||(a>=1&&t.includes('check in')))state='active';else if(i>=2||(i>=1&&!t.includes('close session')&&!t.includes('end session')))state='inactive';if(!state)return;let g='';for(const x of gs){if(t.includes(x.toLowerCase())){g=x;break;}}let m=state+'|'+g;if(m!==prev){prev=m;KOKiosk.sessionState(state,g);}}new MutationObserver(c).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true});setInterval(c,500);c();})();";
        webView.evaluateJavascript(js,null);
    }

    private class Client extends WebViewClient {
        @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request){ return !allowed(request.getUrl().toString()); }
        @Override public boolean shouldOverrideUrlLoading(WebView view,String url){ return !allowed(url); }
        @Override public void onPageStarted(WebView view,String url,Bitmap favicon){ if(isChurchSuite(url)){ floatingHome.setVisibility(View.VISIBLE); floatingHome.bringToFront(); } }
        @Override public void onPageFinished(WebView view,String url){ loadingOverlay.setVisibility(View.GONE); floatingHome.bringToFront(); injectActivity(); if(isCheckIn(url)){ injectSessionWatcher(); if("checkin".equals(purpose)) injectCheckInWatcher(); } if("join".equals(purpose)&&url.contains("/-/forms/")) injectJoinWatcher(); }
        @Override public void onReceivedError(WebView view, WebResourceRequest req, WebResourceError err){ if(req.isForMainFrame()){ Toast.makeText(KioskActivity.this,"ChurchSuite could not be loaded",Toast.LENGTH_SHORT).show(); showHome(); } }
    }

    private class Bridge {
        @JavascriptInterface public void checkInComplete(){ handler.post(()->{ if(completionTriggered)return; completionTriggered=true; showCheckInSuccess(); }); }
        @JavascriptInterface public void joinComplete(){ handler.post(()->{ if(completionTriggered)return; completionTriggered=true; showRegistrationSuccess(); }); }
        @JavascriptInterface public void activity(){ handler.post(KioskActivity.this::resetIdle); }
        @JavascriptInterface public void sessionState(String state,String gathering){ handler.post(()->handleSessionState("active".equals(state),gathering)); }
    }

    private void handleSessionState(boolean active,String gathering) {
        if(gathering!=null&&!gathering.isEmpty()){ for(String[] g:GATHERINGS){ if(g[1].equalsIgnoreCase(gathering)){ prefs.edit().putString(GATHERING_ID,g[0]).putString(GATHERING_NAME,g[1]).apply(); break; } } }
        if(active){ markSession(true); if("staff-start".equals(purpose)) showHome(); }
        else if("staff-close".equals(purpose)||"checkin".equals(purpose)){ markSession(false); showHome(); }
    }

    private void resetIdle(){ cancelIdle(); if(purpose.isEmpty()||purpose.startsWith("staff"))return; long delay="join".equals(purpose)?300000:90000; idleTimeout=this::showHome; handler.postDelayed(idleTimeout,delay); }
    private void cancelIdle(){ if(idleTimeout!=null){ handler.removeCallbacks(idleTimeout); idleTimeout=null; } }

    private boolean allowed(String url){ if(url==null||url.equals("about:blank"))return true; Uri u=Uri.parse(url); String h=u.getHost(); return h!=null&&(h.equalsIgnoreCase("churchsuite.com")||h.toLowerCase(Locale.UK).endsWith(".churchsuite.com")); }
    private boolean isChurchSuite(String url){ try{ String h=Uri.parse(url).getHost(); return h!=null&&(h.equalsIgnoreCase("churchsuite.com")||h.toLowerCase(Locale.UK).endsWith(".churchsuite.com")); }catch(Exception e){return false;} }
    private boolean isCheckIn(String url){ return url!=null&&isChurchSuite(url)&&url.toLowerCase(Locale.UK).contains("/checkin"); }

    private void normalizeSession(){ if(prefs==null)return; String d=prefs.getString(SESSION_DATE,""); if(!d.isEmpty()&&!d.equals(today())) prefs.edit().putBoolean(SESSION_READY,false).remove(SESSION_DATE).apply(); }
    private boolean isSessionReady(){ normalizeSession(); return prefs.getBoolean(SESSION_READY,false)&&today().equals(prefs.getString(SESSION_DATE,"")); }
    private void markSession(boolean ready){ SharedPreferences.Editor e=prefs.edit().putBoolean(SESSION_READY,ready); if(ready)e.putString(SESSION_DATE,today()); else e.remove(SESSION_DATE); e.apply(); }
    private String today(){ return dayKeyFormat.format(new Date()); }
    private String selectedGatheringId(){ return prefs.getString(GATHERING_ID,"hub"); }
    private String selectedGatheringName(){ return prefs.getString(GATHERING_NAME,"Overflow Hub"); }
    private String gatheringAsset(){ for(String[] g:GATHERINGS)if(g[0].equals(selectedGatheringId()))return g[2]; return ""; }

    private void resetChurchSuite(){ CookieManager.getInstance().removeAllCookies(v->{ CookieManager.getInstance().flush(); WebStorage.getInstance().deleteAllData(); webView.clearCache(true); webView.clearHistory(); Toast.makeText(this,"ChurchSuite sign-in reset",Toast.LENGTH_SHORT).show(); }); }

    private FrameLayout shell(){ FrameLayout f=new FrameLayout(this); f.setBackground(gradient(new int[]{NAVY,NAVY_DEEP},GradientDrawable.Orientation.TL_BR)); addDecor(f); return f; }
    private void addDecor(FrameLayout f){ View a=new View(this); GradientDrawable gd=new GradientDrawable(); gd.setShape(GradientDrawable.OVAL); gd.setGradientType(GradientDrawable.RADIAL_GRADIENT); gd.setGradientRadius(dp(220)); gd.setColors(new int[]{Color.argb(58,243,0,197),Color.TRANSPARENT}); a.setBackground(gd); FrameLayout.LayoutParams lp=new FrameLayout.LayoutParams(dp(440),dp(440)); lp.leftMargin=-dp(210); lp.topMargin=-dp(210); f.addView(a,lp); }
    private TextView text(String s,float size,int color,boolean bold){ TextView t=new TextView(this); t.setText(s); t.setTextSize(size); t.setTextColor(color); t.setIncludeFontPadding(false); t.setTypeface(Typeface.create("sans-serif",bold?Typeface.BOLD:Typeface.NORMAL)); return t; }
    private TextView pill(String s){ TextView p=text(s,11,Color.rgb(210,215,220),true); p.setGravity(Gravity.CENTER); p.setLetterSpacing(.12f); p.setPadding(dp(15),dp(9),dp(15),dp(9)); p.setBackground(roundStroke(Color.argb(15,255,255,255),999,Color.argb(30,255,255,255))); return p; }
    private TextView statusNotice(String s,int dotColor){ TextView t=text(s,13,Color.rgb(205,210,215),true); t.setGravity(Gravity.CENTER); t.setPadding(dp(16),dp(12),dp(16),dp(12)); t.setBackground(roundStroke(Color.argb(15,255,255,255),18,Color.argb(28,255,255,255))); return t; }
    private View activeBanner(){ LinearLayout b=new LinearLayout(this); b.setGravity(Gravity.CENTER_VERTICAL); b.setPadding(dp(16),dp(10),dp(16),dp(10)); b.setBackground(roundStroke(Color.argb(18,99,214,164),20,Color.argb(55,99,214,164))); TextView d=text("●",12,GREEN,true); b.addView(d); String asset=gatheringAsset(); if(!asset.isEmpty()){ ImageView im=image(asset); im.setPadding(dp(12),0,dp(10),0); b.addView(im,new LinearLayout.LayoutParams(dp(150),dp(42))); } else { TextView n=text(selectedGatheringName(),14,CREAM,true); n.setPadding(dp(12),0,dp(10),0); b.addView(n); } TextView live=text("SESSION LIVE",10,GREEN,true); live.setLetterSpacing(.15f); b.addView(live); return b; }
    private View choiceCard(String icon,String eyebrow,String title,String subtitle,boolean light,boolean enabled,View.OnClickListener listener){ LinearLayout c=new LinearLayout(this); c.setOrientation(LinearLayout.VERTICAL); c.setPadding(dp(24),dp(24),dp(24),dp(22)); c.setBackground(light?round(CREAM,28):gradient(new int[]{PANEL,Color.rgb(29,39,50)},GradientDrawable.Orientation.TL_BR)); c.setAlpha(enabled?1:.45f); TextView i=text(icon,25,light?CREAM:Color.rgb(255,215,235),true); i.setGravity(Gravity.CENTER); i.setBackground(round(light?NAVY:Color.argb(22,255,255,255),17)); c.addView(i,new LinearLayout.LayoutParams(dp(58),dp(58))); c.addView(space(28)); TextView e=text(eyebrow,10,light?Color.rgb(75,85,95):Color.rgb(190,198,205),true); e.setLetterSpacing(.17f); c.addView(e); TextView h=text(title,32,light?NAVY:Color.WHITE,true); h.setPadding(0,dp(7),0,dp(9)); c.addView(h); LinearLayout foot=new LinearLayout(this); TextView s=text(subtitle,14,light?Color.rgb(75,85,95):MUTED,false); foot.addView(s,new LinearLayout.LayoutParams(0,ViewGroup.LayoutParams.WRAP_CONTENT,1)); foot.addView(text(enabled?"→":"",26,light?NAVY:CREAM,true)); c.addView(foot); if(enabled){ c.setOnClickListener(listener); press(c); } return c; }
    private ImageView image(String name){ ImageView im=new ImageView(this); im.setScaleType(ImageView.ScaleType.CENTER_INSIDE); try(InputStream st=getAssets().open(name)){ im.setImageBitmap(BitmapFactory.decodeStream(st)); }catch(Exception e){ im.setBackground(round(PINK,999)); } return im; }
    private View space(int h){ Space s=new Space(this); s.setLayoutParams(new LinearLayout.LayoutParams(1,dp(h))); return s; }
    private View spaceH(int w){ Space s=new Space(this); s.setLayoutParams(new LinearLayout.LayoutParams(dp(w),1)); return s; }
    private GradientDrawable round(int color,float r){ GradientDrawable d=new GradientDrawable(); d.setColor(color); d.setCornerRadius(dp(r)); return d; }
    private GradientDrawable roundStroke(int color,float r,int stroke){ GradientDrawable d=round(color,r); d.setStroke(dp(1),stroke); return d; }
    private GradientDrawable gradient(int[] colors,GradientDrawable.Orientation o){ return new GradientDrawable(o,colors); }
    private GradientDrawable brandGradient(float r){ GradientDrawable d=new GradientDrawable(GradientDrawable.Orientation.LEFT_RIGHT,new int[]{HOT_PINK,PINK,CREAM}); d.setCornerRadius(dp(r)); return d; }
    private void applyGradientText(TextView v){ v.post(()->{ LinearGradient g=new LinearGradient(0,0,Math.max(v.getWidth(),dp(300)),0,new int[]{HOT_PINK,PINK,CREAM},null, Shader.TileMode.CLAMP); v.getPaint().setShader(g); v.invalidate(); }); }
    private void press(View v){ v.setOnTouchListener((x,e)->{ if(e.getAction()==MotionEvent.ACTION_DOWN)x.animate().scaleX(.985f).scaleY(.985f).setDuration(80).start(); else if(e.getAction()==MotionEvent.ACTION_UP||e.getAction()==MotionEvent.ACTION_CANCEL)x.animate().scaleX(1).scaleY(1).setDuration(120).start(); return false; }); }
    private boolean isTablet(){ return getResources().getDisplayMetrics().widthPixels/getResources().getDisplayMetrics().density>=700; }
    private boolean isOnline(){ try{ ConnectivityManager cm=(ConnectivityManager)getSystemService(Context.CONNECTIVITY_SERVICE); Network n=cm.getActiveNetwork(); if(n==null)return false; NetworkCapabilities c=cm.getNetworkCapabilities(n); return c!=null&&c.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET); }catch(Exception e){return true;} }
    private int dp(float v){ return Math.round(v*getResources().getDisplayMetrics().density); }
    private void hideSystemUi(){ getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN); getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY|View.SYSTEM_UI_FLAG_FULLSCREEN|View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN|View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_LAYOUT_STABLE); }

    @Override protected void onResume(){ super.onResume(); hideSystemUi(); normalizeSession(); }
    @Override public void onBackPressed(){ if(webView.getVisibility()==View.VISIBLE&&!purpose.isEmpty()){ if(purpose.startsWith("staff"))showStaff(); else showHome(); } else showHome(); }
    @Override protected void onDestroy(){ cancelIdle(); if(webView!=null)webView.destroy(); super.onDestroy(); }
}
