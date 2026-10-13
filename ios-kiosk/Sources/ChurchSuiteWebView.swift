import SwiftUI
import WebKit

struct ChurchSuiteWebView: UIViewRepresentable {
    let url: URL
    let purpose: WebPurpose
    let onCheckInComplete: () -> Void
    let onJoinComplete: () -> Void
    let onSessionState: (_ active: Bool, _ gathering: String?) -> Void
    let onLoaded: () -> Void
    let onIdleTimeout: () -> Void

    func makeCoordinator() -> Coordinator { Coordinator(parent: self) }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        configuration.userContentController.add(context.coordinator, name: "koKiosk")

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.isOpaque = true
        webView.backgroundColor = .white
        webView.customUserAgent = "Mozilla/5.0 KingdomOverflowKiosk/2.1"
        webView.load(URLRequest(url: url, cachePolicy: .reloadRevalidatingCacheData))
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        if uiView.url == nil { uiView.load(URLRequest(url: url)) }
    }

    static func dismantleUIView(_ uiView: WKWebView, coordinator: Coordinator) {
        coordinator.cancelIdleTimer()
        uiView.configuration.userContentController.removeScriptMessageHandler(forName: "koKiosk")
        uiView.navigationDelegate = nil
        uiView.uiDelegate = nil
        uiView.stopLoading()
    }

    static func resetPersistentSession() {
        let store = WKWebsiteDataStore.default()
        store.removeData(ofTypes: WKWebsiteDataStore.allWebsiteDataTypes(), modifiedSince: Date(timeIntervalSince1970: 0)) {}
    }

    final class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler {
        let parent: ChurchSuiteWebView
        private var completionScheduled = false
        private var idleWorkItem: DispatchWorkItem?
        private var lastSessionMessage = ""

        init(parent: ChurchSuiteWebView) { self.parent = parent }

        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            guard message.name == "koKiosk", let value = message.body as? String else { return }

            if value == "checkInComplete" {
                guard !completionScheduled else { return }
                completionScheduled = true
                cancelIdleTimer()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) { [weak self] in self?.parent.onCheckInComplete() }
                return
            }

            if value == "joinComplete" {
                guard !completionScheduled else { return }
                completionScheduled = true
                cancelIdleTimer()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) { [weak self] in self?.parent.onJoinComplete() }
                return
            }

            if value == "activity" {
                resetIdleTimer()
                return
            }

            if value.hasPrefix("session|") {
                guard value != lastSessionMessage else { return }
                lastSessionMessage = value
                let bits = value.split(separator: "|", omittingEmptySubsequences: false).map(String.init)
                guard bits.count >= 2 else { return }
                let active = bits[1] == "active"
                let gathering = bits.count >= 3 && !bits[2].isEmpty ? bits[2] : nil
                DispatchQueue.main.async { [weak self] in self?.parent.onSessionState(active, gathering) }
            }
        }

        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) { resetIdleTimer() }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            parent.onLoaded()
            injectActivityWatcher(in: webView)
            resetIdleTimer()

            guard let current = webView.url?.absoluteString.lowercased(), current.contains("churchsuite.com") else { return }

            if parent.purpose == .join && current.contains("/-/forms/") {
                injectJoinWatcher(in: webView)
            }

            if current.contains("/checkin") {
                injectSessionWatcher(in: webView)
                if parent.purpose == .checkIn { injectCheckInWatcher(in: webView) }
            }
        }

        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) { parent.onLoaded() }
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) { parent.onLoaded() }

        private func injectActivityWatcher(in webView: WKWebView) {
            webView.evaluateJavaScript("""
            (function(){
              if(window.__koActivityWatcher)return; window.__koActivityWatcher=true; let last=0;
              function ping(){const now=Date.now();if(now-last>5000){last=now;window.webkit.messageHandlers.koKiosk.postMessage('activity');}}
              ['touchstart','click','keydown','input'].forEach(e=>document.addEventListener(e,ping,true));
            })();
            """)
        }

        private func injectCheckInWatcher(in webView: WKWebView) {
            webView.evaluateJavaScript("""
            (function(){
              if(window.__koCheckinWatcher)return; window.__koCheckinWatcher=true;
              const phrases=["you're checked in","you’re checked in","you have been checked in","checked in successfully","successfully checked in","check-in successful","check in successful","check-in complete","check in complete"];
              function check(){const text=((document.body&&document.body.innerText)||'').toLowerCase();for(const p of phrases){if(text.includes(p)){window.webkit.messageHandlers.koKiosk.postMessage('checkInComplete');return;}}}
              new MutationObserver(check).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true});
              setInterval(check,300);check();
            })();
            """)
        }

        private func injectJoinWatcher(in webView: WKWebView) {
            webView.evaluateJavaScript("""
            (function(){
              if(window.__koJoinWatcher)return; window.__koJoinWatcher=true;
              function check(){
                const text=((document.body&&document.body.innerText)||'').toLowerCase();
                const success=(text.includes('thank you')&&(text.includes('submitted')||text.includes('response')||text.includes('completed')||text.includes('received')))||text.includes('form has been submitted')||text.includes('response has been submitted')||text.includes('submission received');
                if(success){window.webkit.messageHandlers.koKiosk.postMessage('joinComplete');}
              }
              new MutationObserver(check).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true});setInterval(check,350);check();
            })();
            """)
        }

        private func injectSessionWatcher(in webView: WKWebView) {
            webView.evaluateJavaScript("""
            (function(){
              if(window.__koSessionWatcher)return; window.__koSessionWatcher=true; let previous='';
              const gatherings=['Overflow Hub','Overflow:AM','Overflow Dance','Overflow Football','Overflow Create','Overflow Wellbeing Centre'];
              function score(text,terms){let n=0;for(const t of terms){if(text.includes(t))n++;}return n;}
              function inspect(){
                const raw=(document.body&&document.body.innerText)||''; const text=raw.toLowerCase();
                const activeTerms=['close session','end session','session admin','session details','check out all','checkout all','session is open','session open'];
                const inactiveTerms=['create from gathering','create session','start a session','start session','new session','no active session','join a session','select a gathering'];
                const activeScore=score(text,activeTerms); const inactiveScore=score(text,inactiveTerms);
                let state='';
                if(activeScore>=2 || (activeScore>=1 && text.includes('check in'))) state='active';
                else if(inactiveScore>=2 || (inactiveScore>=1 && !text.includes('close session') && !text.includes('end session'))) state='inactive';
                if(!state)return;
                let gathering=''; for(const g of gatherings){if(text.includes(g.toLowerCase())){gathering=g;break;}}
                const message='session|'+state+'|'+gathering;
                if(message!==previous){previous=message;window.webkit.messageHandlers.koKiosk.postMessage(message);}
              }
              new MutationObserver(inspect).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true});setInterval(inspect,500);inspect();
            })();
            """)
        }

        func resetIdleTimer() {
            cancelIdleTimer()
            let delay: TimeInterval
            switch parent.purpose {
            case .checkIn: delay = 90
            case .join: delay = 300
            case .staffStart, .staffClose: return
            }
            let work = DispatchWorkItem { [weak self] in DispatchQueue.main.async { self?.parent.onIdleTimeout() } }
            idleWorkItem = work
            DispatchQueue.main.asyncAfter(deadline: .now() + delay, execute: work)
        }

        func cancelIdleTimer() { idleWorkItem?.cancel(); idleWorkItem = nil }

        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            guard let host = navigationAction.request.url?.host?.lowercased() else { decisionHandler(.cancel); return }
            decisionHandler(host == "churchsuite.com" || host.hasSuffix(".churchsuite.com") ? .allow : .cancel)
        }

        func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
            if let url = navigationAction.request.url, let host = url.host?.lowercased(), host == "churchsuite.com" || host.hasSuffix(".churchsuite.com") { webView.load(URLRequest(url: url)) }
            return nil
        }
    }
}
