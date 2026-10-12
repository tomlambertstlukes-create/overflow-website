import SwiftUI
import WebKit

struct ChurchSuiteWebView: UIViewRepresentable {
    let url: URL
    let purpose: WebPurpose
    let onCheckInComplete: () -> Void
    let onJoinComplete: () -> Void
    let onLoaded: () -> Void
    let onIdleTimeout: () -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }

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
        webView.customUserAgent = "Mozilla/5.0 KingdomOverflowKiosk/2.0"
        webView.load(URLRequest(url: url, cachePolicy: .reloadRevalidatingCacheData))
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        if uiView.url == nil {
            uiView.load(URLRequest(url: url))
        }
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
        let allTypes = WKWebsiteDataStore.allWebsiteDataTypes()
        store.removeData(ofTypes: allTypes, modifiedSince: Date(timeIntervalSince1970: 0)) {}
    }

    final class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler {
        let parent: ChurchSuiteWebView
        private var completionScheduled = false
        private var idleWorkItem: DispatchWorkItem?

        init(parent: ChurchSuiteWebView) {
            self.parent = parent
        }

        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            guard message.name == "koKiosk", let value = message.body as? String else { return }

            switch value {
            case "checkInComplete":
                guard !completionScheduled else { return }
                completionScheduled = true
                cancelIdleTimer()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) { [weak self] in
                    self?.parent.onCheckInComplete()
                }

            case "joinComplete":
                guard !completionScheduled else { return }
                completionScheduled = true
                cancelIdleTimer()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) { [weak self] in
                    self?.parent.onJoinComplete()
                }

            case "activity":
                resetIdleTimer()

            default:
                break
            }
        }

        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            resetIdleTimer()
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            parent.onLoaded()
            injectActivityWatcher(in: webView)
            resetIdleTimer()

            guard let current = webView.url?.absoluteString.lowercased(),
                  current.contains("churchsuite.com") else { return }

            if parent.purpose == .checkIn && current.contains("/checkin") {
                injectCheckInWatcher(in: webView)
            } else if parent.purpose == .join && current.contains("/-/forms/") {
                injectJoinWatcher(in: webView)
            }
        }

        func webView(
            _ webView: WKWebView,
            didFailProvisionalNavigation navigation: WKNavigation!,
            withError error: Error
        ) {
            parent.onLoaded()
        }

        func webView(
            _ webView: WKWebView,
            didFail navigation: WKNavigation!,
            withError error: Error
        ) {
            parent.onLoaded()
        }

        private func injectActivityWatcher(in webView: WKWebView) {
            let script = """
            (function(){
              if(window.__koActivityWatcher){return;}
              window.__koActivityWatcher=true;
              let last=0;
              function ping(){
                const now=Date.now();
                if(now-last>5000){last=now;window.webkit.messageHandlers.koKiosk.postMessage('activity');}
              }
              ['touchstart','click','keydown','input'].forEach(e=>document.addEventListener(e,ping,true));
            })();
            """
            webView.evaluateJavaScript(script)
        }

        private func injectCheckInWatcher(in webView: WKWebView) {
            let script = """
            (function(){
              if(window.__koCheckinWatcher){return;}
              window.__koCheckinWatcher=true;
              const phrases=[
                "you're checked in",
                "you’re checked in",
                "you have been checked in",
                "checked in successfully",
                "successfully checked in",
                "check-in successful",
                "check in successful",
                "check-in complete",
                "check in complete"
              ];
              function check(){
                const text=((document.body&&document.body.innerText)||'').toLowerCase();
                for(const phrase of phrases){
                  if(text.includes(phrase)){
                    window.webkit.messageHandlers.koKiosk.postMessage('checkInComplete');
                    return;
                  }
                }
              }
              new MutationObserver(check).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
              window.setInterval(check,350);
              check();
            })();
            """
            webView.evaluateJavaScript(script)
        }

        private func injectJoinWatcher(in webView: WKWebView) {
            let script = """
            (function(){
              if(window.__koJoinWatcher){return;}
              window.__koJoinWatcher=true;
              function check(){
                const text=((document.body&&document.body.innerText)||'').toLowerCase();
                const success=(text.includes('thank you')&&(text.includes('submitted')||text.includes('response')||text.includes('completed')))
                  || text.includes('form has been submitted')
                  || text.includes('response has been submitted');
                if(success){
                  window.webkit.messageHandlers.koKiosk.postMessage('joinComplete');
                  return;
                }
              }
              new MutationObserver(check).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
              window.setInterval(check,500);
            })();
            """
            webView.evaluateJavaScript(script)
        }

        func resetIdleTimer() {
            cancelIdleTimer()
            let delay: TimeInterval
            switch parent.purpose {
            case .checkIn:
                delay = 90
            case .join:
                delay = 300
            case .staffStart, .staffClose:
                return
            }

            let work = DispatchWorkItem { [weak self] in
                DispatchQueue.main.async {
                    self?.parent.onIdleTimeout()
                }
            }
            idleWorkItem = work
            DispatchQueue.main.asyncAfter(deadline: .now() + delay, execute: work)
        }

        func cancelIdleTimer() {
            idleWorkItem?.cancel()
            idleWorkItem = nil
        }

        func webView(
            _ webView: WKWebView,
            decidePolicyFor navigationAction: WKNavigationAction,
            decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
        ) {
            guard let host = navigationAction.request.url?.host?.lowercased() else {
                decisionHandler(.cancel)
                return
            }

            if host == "churchsuite.com" || host.hasSuffix(".churchsuite.com") {
                decisionHandler(.allow)
            } else {
                decisionHandler(.cancel)
            }
        }

        func webView(
            _ webView: WKWebView,
            createWebViewWith configuration: WKWebViewConfiguration,
            for navigationAction: WKNavigationAction,
            windowFeatures: WKWindowFeatures
        ) -> WKWebView? {
            if let url = navigationAction.request.url,
               let host = url.host?.lowercased(),
               host == "churchsuite.com" || host.hasSuffix(".churchsuite.com") {
                webView.load(URLRequest(url: url))
            }
            return nil
        }
    }
}
