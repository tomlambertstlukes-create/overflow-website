import SwiftUI
import WebKit

struct ChurchSuiteWebView: UIViewRepresentable {
    let url: URL
    let purpose: WebPurpose
    let onCheckInComplete: () -> Void

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
        webView.customUserAgent = (webView.value(forKey: "userAgent") as? String ?? "") + " KingdomOverflowKiosk/1.0"
        webView.load(URLRequest(url: url))
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        if uiView.url == nil {
            uiView.load(URLRequest(url: url))
        }
    }

    static func dismantleUIView(_ uiView: WKWebView, coordinator: Coordinator) {
        uiView.configuration.userContentController.removeScriptMessageHandler(forName: "koKiosk")
        uiView.navigationDelegate = nil
        uiView.uiDelegate = nil
    }

    final class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler {
        let parent: ChurchSuiteWebView
        private var completionScheduled = false

        init(parent: ChurchSuiteWebView) {
            self.parent = parent
        }

        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            guard message.name == "koKiosk",
                  let value = message.body as? String,
                  value == "checkInComplete",
                  !completionScheduled else { return }

            completionScheduled = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.1) { [weak self] in
                self?.parent.onCheckInComplete()
            }
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            guard parent.purpose == .checkIn,
                  let current = webView.url?.absoluteString.lowercased(),
                  current.contains("churchsuite.com"),
                  current.contains("/checkin") else { return }

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
