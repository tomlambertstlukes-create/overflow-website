import SwiftUI
import CryptoKit

private let checkInURL = URL(string: "https://kingdomoverflow.churchsuite.com/checkin")!
private let joinURL = URL(string: "https://kingdomoverflow.churchsuite.com/-/forms/zqtiiald")!

enum WebPurpose: Equatable { case checkIn, join, staffStart, staffClose }

private enum KioskMode: Equatable {
    case home
    case staff
    case web(URL, WebPurpose)
    case checkInSuccess
    case registrationSuccess
}

private struct Gathering: Identifiable, Equatable {
    let id: String
    let name: String
    let asset: String?
}

private let gatherings: [Gathering] = [
    .init(id: "hub", name: "Overflow Hub", asset: "overflow-hub-wordmark"),
    .init(id: "am", name: "Overflow:AM", asset: "overflow-am-wordmark"),
    .init(id: "dance", name: "Overflow Dance", asset: "overflow-dance-wordmark"),
    .init(id: "football", name: "Overflow Football", asset: "overflow-football-wordmark"),
    .init(id: "create", name: "Overflow Create", asset: "overflow-create-wordmark"),
    .init(id: "wellbeing", name: "Overflow Wellbeing Centre", asset: nil)
]

private func pinDigest(_ value: String) -> String {
    SHA256.hash(data: Data(value.utf8)).map { String(format: "%02x", $0) }.joined()
}

struct ContentView: View {
    @AppStorage("ko-session-ready") private var sessionReady = false
    @AppStorage("ko-session-date") private var sessionDate = ""
    @AppStorage("ko-gathering-id") private var gatheringID = "hub"
    @AppStorage("ko-gathering-name") private var gatheringName = "Overflow Hub"
    @AppStorage("ko-staff-pin-hash") private var staffPinHash = ""

    @State private var mode: KioskMode = .home
    @State private var webLoaded = false
    @State private var showPIN = false
    @State private var pinContext: PINContext = .unlock
    @StateObject private var network = NetworkMonitor()

    private let navy = Color(red: 20/255, green: 29/255, blue: 38/255)
    private let navyDeep = Color(red: 16/255, green: 24/255, blue: 33/255)
    private let cream = Color(red: 226/255, green: 226/255, blue: 210/255)
    private let pink = Color(red: 197/255, green: 31/255, blue: 93/255)
    private let hotPink = Color(red: 243/255, green: 0/255, blue: 197/255)
    private let orange = Color(red: 217/255, green: 130/255, blue: 69/255)
    private let green = Color(red: 99/255, green: 214/255, blue: 164/255)

    private var selectedGathering: Gathering {
        gatherings.first(where: { $0.id == gatheringID }) ?? gatherings[0]
    }

    var body: some View {
        ZStack {
            background
            switch mode {
            case .home: home
            case .staff: staff
            case let .web(url, purpose): web(url: url, purpose: purpose)
            case .checkInSuccess: checkInSuccess
            case .registrationSuccess: registrationSuccess
            }

            if showPIN {
                PINOverlay(
                    existingHash: staffPinHash,
                    forceSetup: pinContext == .change,
                    onCancel: { showPIN = false },
                    onSuccess: { newHash in
                        if let newHash { staffPinHash = newHash }
                        showPIN = false
                        mode = .staff
                    }
                )
                .transition(.opacity)
                .zIndex(50)
            }
        }
        .animation(.easeOut(duration: 0.22), value: mode)
        .statusBarHidden(true)
        .persistentSystemOverlays(.hidden)
        .onAppear { normalizeSession() }
        .onReceive(Timer.publish(every: 60, on: .main, in: .common).autoconnect()) { _ in normalizeSession() }
    }

    private var background: some View {
        ZStack {
            LinearGradient(colors: [navy, navyDeep], startPoint: .topLeading, endPoint: .bottomTrailing)
            Circle().fill(hotPink.opacity(0.17)).frame(width: 560, height: 560).blur(radius: 95).offset(x: -360, y: -450)
            Circle().fill(pink.opacity(0.12)).frame(width: 480, height: 480).blur(radius: 105).offset(x: -430, y: 80)
            Circle().fill(cream.opacity(0.07)).frame(width: 480, height: 480).blur(radius: 115).offset(x: 390, y: 470)
        }.ignoresSafeArea()
    }

    private var home: some View {
        GeometryReader { geo in
            let wide = geo.size.width >= 760
            ScrollView {
                VStack(spacing: 0) {
                    header(wide: wide)
                    Spacer().frame(height: wide ? 58 : 38)
                    Kicker(text: "✦  WELCOME")
                    Text("Good to see you.")
                        .font(.system(size: wide ? 58 : 42, weight: .black, design: .rounded))
                        .tracking(-1.8).foregroundStyle(.white).padding(.top, 20)
                    Text("Let’s get you checked in.")
                        .font(.system(size: wide ? 50 : 32, weight: .black, design: .rounded))
                        .tracking(-1.6)
                        .foregroundStyle(LinearGradient(colors: [hotPink, pink, cream], startPoint: .leading, endPoint: .trailing))
                    Text("Been before? Check in for today. First time with us? Register once, then you’ll be ready to check in.")
                        .font(.system(size: wide ? 18 : 15, weight: .medium)).foregroundStyle(.white.opacity(0.58))
                        .multilineTextAlignment(.center).lineSpacing(5).frame(maxWidth: 760).padding(.top, 18)

                    if sessionReady { activeBanner.padding(.top, 26) }
                    else {
                        Label("Waiting for a team member to start today’s session", systemImage: "clock.fill")
                            .font(.system(size: 14, weight: .bold)).foregroundStyle(.white.opacity(0.72))
                            .padding(.horizontal, 18).padding(.vertical, 12)
                            .background(.white.opacity(0.05), in: RoundedRectangle(cornerRadius: 18))
                            .overlay(RoundedRectangle(cornerRadius: 18).stroke(.white.opacity(0.08))).padding(.top, 26)
                    }

                    Group {
                        if wide {
                            HStack(spacing: 22) { checkInCard; newHereCard }
                        } else {
                            VStack(spacing: 18) { checkInCard; newHereCard }
                        }
                    }.padding(.top, 30)
                    footer.padding(.top, 28)
                }
                .frame(maxWidth: 1180).padding(.horizontal, wide ? 54 : 24).padding(.top, wide ? 40 : 26).padding(.bottom, 26)
                .frame(maxWidth: .infinity)
            }
        }
    }

    private func header(wide: Bool) -> some View {
        HStack(spacing: 15) {
            BrandPNG(name: "ko-logo-dark").frame(width: 64, height: 64)
                .background(.white.opacity(0.025), in: Circle()).overlay(Circle().stroke(.white.opacity(0.07))).shadow(color: .black.opacity(0.25), radius: 14, y: 6)
            VStack(alignment: .leading, spacing: 4) {
                Text("Kingdom Overflow").font(.system(size: wide ? 23 : 20, weight: .black, design: .rounded)).foregroundStyle(cream)
                Text("BELONGING  •  OPPORTUNITY  •  WELLBEING").font(.system(size: wide ? 10 : 8.5, weight: .medium)).tracking(wide ? 1.8 : 1.2).foregroundStyle(.white.opacity(0.38))
            }
            Spacer()
            TimelineView(.periodic(from: .now, by: 10)) { context in
                VStack(alignment: .trailing, spacing: 2) {
                    Text(context.date.formatted(date: .omitted, time: .shortened)).font(.system(size: wide ? 30 : 24, weight: .black, design: .rounded)).foregroundStyle(cream)
                    if wide { Text(context.date.formatted(.dateTime.weekday(.wide).day().month(.wide))).font(.system(size: 12, weight: .medium)).foregroundStyle(.white.opacity(0.34)) }
                }
            }
        }
    }

    private var activeBanner: some View {
        HStack(spacing: 12) {
            Circle().fill(green).frame(width: 8, height: 8).shadow(color: green.opacity(0.5), radius: 8)
            if let asset = selectedGathering.asset { BrandPNG(name: asset).frame(width: 150, height: 40) }
            else { Text(selectedGathering.name).font(.system(size: 14, weight: .black)).foregroundStyle(cream) }
            Text("SESSION LIVE").font(.system(size: 10, weight: .heavy)).tracking(1.7).foregroundStyle(green.opacity(0.9))
        }
        .padding(.horizontal, 16).padding(.vertical, 10)
        .background(green.opacity(0.07), in: RoundedRectangle(cornerRadius: 20)).overlay(RoundedRectangle(cornerRadius: 20).stroke(green.opacity(0.22)))
    }

    private var checkInCard: some View {
        Button { if sessionReady { openWeb(checkInURL, .checkIn) } } label: {
            ChoiceCard(icon: sessionReady ? "person.2.fill" : "clock.fill", eyebrow: sessionReady ? "I’VE BEEN BEFORE" : "WAITING FOR STAFF", title: "Check in", subtitle: sessionReady ? "Find your name and check in for today" : "Today’s ChurchSuite session needs to be started first", light: true, enabled: sessionReady)
        }.buttonStyle(PressStyle()).disabled(!sessionReady)
    }

    private var newHereCard: some View {
        Button { openWeb(joinURL, .join) } label: {
            ChoiceCard(icon: "person.badge.plus", eyebrow: "FIRST TIME WITH US", title: "New here", subtitle: "Register once, then check in today", light: false, enabled: true)
        }.buttonStyle(PressStyle())
    }

    private var footer: some View {
        HStack(spacing: 14) {
            HStack(spacing: 6) {
                Circle().fill(network.isOnline ? green : orange).frame(width: 7, height: 7)
                Text(network.isOnline ? "Online" : "Offline")
                Text("•  KO Kiosk 2.1")
            }.font(.system(size: 11, weight: .bold)).foregroundStyle(network.isOnline ? green.opacity(0.72) : orange.opacity(0.9))
            Spacer()
            Text(sessionReady ? "SESSION LIVE  •  HOLD FOR STAFF" : "PRESS & HOLD FOR STAFF")
                .font(.system(size: 11, weight: .heavy)).tracking(1.2).foregroundStyle(.white.opacity(0.67))
                .padding(.horizontal, 16).padding(.vertical, 12).background(.white.opacity(0.05), in: Capsule()).overlay(Capsule().stroke(.white.opacity(0.1)))
                .contentShape(Capsule()).onLongPressGesture(minimumDuration: 0.9) { pinContext = .unlock; showPIN = true }
        }
    }

    private var staff: some View {
        GeometryReader { geo in
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    Button { mode = .home } label: { Label("CHECK-IN HOME", systemImage: "chevron.left") }.buttonStyle(PillButtonStyle())
                    Text("STAFF CONTROLS").font(.system(size: 12, weight: .heavy)).tracking(2).foregroundStyle(hotPink).padding(.top, 48)
                    Text(sessionReady ? "Today’s session is live" : "Start today’s session")
                        .font(.system(size: geo.size.width >= 760 ? 48 : 38, weight: .black, design: .rounded)).tracking(-1.6).foregroundStyle(.white).padding(.top, 10)
                    Text(sessionReady ? "\(selectedGathering.name) is live. KO will automatically detect when ChurchSuite closes the session." : "Choose the KO gathering, then open ChurchSuite. KO will automatically recognise when the matching session becomes live.")
                        .font(.system(size: 17, weight: .medium)).foregroundStyle(.white.opacity(0.58)).lineSpacing(6).frame(maxWidth: 850, alignment: .leading).padding(.top, 16)

                    if !sessionReady {
                        Text("CHOOSE GATHERING").font(.system(size: 11, weight: .heavy)).tracking(1.8).foregroundStyle(.white.opacity(0.45)).padding(.top, 28).padding(.bottom, 12)
                        gatheringSelector
                    } else { activeBanner.padding(.top, 28) }

                    Button { openWeb(checkInURL, sessionReady ? .staffClose : .staffStart) } label: {
                        Label(sessionReady ? "Open ChurchSuite to close session" : "Start in ChurchSuite", systemImage: "arrow.up.right.square")
                            .font(.system(size: 17, weight: .black)).frame(maxWidth: .infinity).padding(.vertical, 22).foregroundStyle(navy)
                            .background(LinearGradient(colors: [hotPink, pink, cream], startPoint: .leading, endPoint: .trailing), in: RoundedRectangle(cornerRadius: 22))
                    }.buttonStyle(PressStyle()).padding(.top, 30)

                    HStack(spacing: 12) {
                        Button(sessionReady ? "Mark closed manually" : "Mark live manually") { markSession(!sessionReady); mode = .home }.buttonStyle(PillButtonStyle())
                        Button("Change staff PIN") { pinContext = .change; staffPinHash = ""; showPIN = true }.buttonStyle(PillButtonStyle())
                        Button("Reset ChurchSuite login") { ChurchSuiteWebView.resetPersistentSession() }.buttonStyle(PillButtonStyle())
                    }.padding(.top, 18)
                }
                .frame(maxWidth: 1050, alignment: .leading).padding(geo.size.width >= 760 ? 52 : 24).frame(maxWidth: .infinity)
            }
        }
    }

    private var gatheringSelector: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(gatherings) { g in
                    Button {
                        gatheringID = g.id; gatheringName = g.name
                    } label: {
                        VStack(spacing: 8) {
                            if let asset = g.asset { BrandPNG(name: asset).frame(width: 145, height: 42) }
                            else { Text("OVERFLOW").font(.system(size: 14, weight: .black)).foregroundStyle(cream).frame(width: 145, height: 42) }
                            Text(g.name).font(.system(size: 11, weight: .bold)).foregroundStyle(.white.opacity(gatheringID == g.id ? 0.95 : 0.55))
                        }
                        .padding(.horizontal, 18).padding(.vertical, 14)
                        .background(gatheringID == g.id ? pink.opacity(0.22) : .white.opacity(0.04), in: RoundedRectangle(cornerRadius: 20))
                        .overlay(RoundedRectangle(cornerRadius: 20).stroke(gatheringID == g.id ? hotPink.opacity(0.65) : .white.opacity(0.08)))
                    }.buttonStyle(PressStyle())
                }
            }
        }
    }

    private func web(url: URL, purpose: WebPurpose) -> some View {
        ZStack(alignment: .topTrailing) {
            ChurchSuiteWebView(
                url: url,
                purpose: purpose,
                onCheckInComplete: { mode = .checkInSuccess; DispatchQueue.main.asyncAfter(deadline: .now() + 1.4) { mode = .home } },
                onJoinComplete: { mode = .registrationSuccess },
                onSessionState: { active, detectedGathering in handleSessionState(active: active, gathering: detectedGathering, purpose: purpose) },
                onLoaded: { webLoaded = true },
                onIdleTimeout: { mode = .home }
            ).ignoresSafeArea()

            Button {
                mode = purpose == .staffStart || purpose == .staffClose ? .staff : .home
            } label: {
                Label(purpose == .staffStart || purpose == .staffClose ? "Staff" : "KO home", systemImage: "chevron.left")
                    .font(.system(size: 12, weight: .heavy)).foregroundStyle(.white).padding(.horizontal, 16).padding(.vertical, 12).background(pink, in: Capsule()).shadow(radius: 8)
            }.padding(16)

            if !webLoaded {
                ZStack {
                    background
                    VStack(spacing: 18) { BrandPNG(name: "ko-logo-dark").frame(width: 90, height: 90); Text("Opening ChurchSuite…").font(.system(size: 20, weight: .black)).foregroundStyle(cream); ProgressView().tint(hotPink) }
                }.ignoresSafeArea()
            }
        }.onAppear { webLoaded = false }
    }

    private var checkInSuccess: some View {
        VStack(spacing: 14) {
            Image(systemName: "checkmark").font(.system(size: 38, weight: .black)).foregroundStyle(navy).frame(width: 84, height: 84).background(cream, in: Circle())
            Text("You’re checked in.").font(.system(size: 48, weight: .black, design: .rounded)).foregroundStyle(.white)
            Text("Have a great session.").font(.system(size: 17, weight: .medium)).foregroundStyle(.white.opacity(0.56))
        }
    }

    private var registrationSuccess: some View {
        VStack(spacing: 14) {
            BrandPNG(name: "ko-logo-dark").frame(width: 84, height: 84)
            Text("WELCOME TO KINGDOM OVERFLOW").font(.system(size: 11, weight: .heavy)).tracking(2).foregroundStyle(hotPink)
            Text("You’re registered.").font(.system(size: 46, weight: .black, design: .rounded)).foregroundStyle(.white)
            Text("Your KO record is ready. You can now check in for today.").font(.system(size: 17, weight: .medium)).foregroundStyle(.white.opacity(0.58))
            if sessionReady {
                Button("CHECK IN FOR TODAY  →") { openWeb(checkInURL, .checkIn) }
                    .font(.system(size: 16, weight: .black)).foregroundStyle(navy).padding(.horizontal, 34).padding(.vertical, 20)
                    .background(LinearGradient(colors: [hotPink, pink, cream], startPoint: .leading, endPoint: .trailing), in: RoundedRectangle(cornerRadius: 22)).padding(.top, 18)
            }
            Button("RETURN HOME") { mode = .home }.buttonStyle(PillButtonStyle()).padding(.top, 6)
        }.multilineTextAlignment(.center).padding(30)
    }

    private func openWeb(_ url: URL, _ purpose: WebPurpose) { webLoaded = false; mode = .web(url, purpose) }

    private func handleSessionState(active: Bool, gathering: String?, purpose: WebPurpose) {
        if let gathering, let match = gatherings.first(where: { $0.name.caseInsensitiveCompare(gathering) == .orderedSame }) {
            gatheringID = match.id; gatheringName = match.name
        }
        if active {
            markSession(true)
            if purpose == .staffStart { mode = .home }
        } else {
            if purpose == .staffClose || purpose == .checkIn {
                markSession(false)
                mode = .home
            }
        }
    }

    private func markSession(_ ready: Bool) {
        sessionReady = ready
        sessionDate = ready ? todayKey : ""
    }

    private var todayKey: String {
        let f = DateFormatter(); f.locale = Locale(identifier: "en_GB"); f.dateFormat = "yyyy-MM-dd"; return f.string(from: Date())
    }

    private func normalizeSession() {
        if !sessionDate.isEmpty && sessionDate != todayKey { sessionReady = false; sessionDate = "" }
    }
}

private enum PINContext { case unlock, change }

private struct PINOverlay: View {
    let existingHash: String
    let forceSetup: Bool
    let onCancel: () -> Void
    let onSuccess: (String?) -> Void

    @State private var digits = ""
    @State private var firstPIN = ""
    @State private var confirming = false
    @State private var error = ""

    private var setup: Bool { forceSetup || existingHash.isEmpty }

    var body: some View {
        ZStack {
            Color.black.opacity(0.72).ignoresSafeArea()
            VStack(spacing: 20) {
                Text(setup ? (confirming ? "Confirm staff PIN" : "Create staff PIN") : "Staff access")
                    .font(.system(size: 28, weight: .black, design: .rounded)).foregroundStyle(.white)
                Text(setup ? "Choose a 4-digit PIN for this kiosk." : "Enter the 4-digit staff PIN.")
                    .font(.system(size: 14, weight: .medium)).foregroundStyle(.white.opacity(0.58))
                HStack(spacing: 14) { ForEach(0..<4, id: \.self) { i in Circle().fill(i < digits.count ? Color(red: 243/255, green: 0, blue: 197/255) : .white.opacity(0.14)).frame(width: 15, height: 15) } }.padding(.vertical, 6)
                if !error.isEmpty { Text(error).font(.system(size: 13, weight: .bold)).foregroundStyle(.orange) }
                LazyVGrid(columns: Array(repeating: GridItem(.fixed(72), spacing: 12), count: 3), spacing: 12) {
                    ForEach(["1","2","3","4","5","6","7","8","9","","0","⌫"], id: \.self) { key in
                        if key.isEmpty { Color.clear.frame(width: 72, height: 58) }
                        else { Button(key) { tap(key) }.font(.system(size: 22, weight: .black)).foregroundStyle(.white).frame(width: 72, height: 58).background(.white.opacity(0.08), in: RoundedRectangle(cornerRadius: 18)).overlay(RoundedRectangle(cornerRadius: 18).stroke(.white.opacity(0.09))) }
                    }
                }
                Button("Cancel", action: onCancel).font(.system(size: 13, weight: .bold)).foregroundStyle(.white.opacity(0.55)).padding(.top, 4)
            }
            .padding(34).background(Color(red: 20/255, green: 29/255, blue: 38/255), in: RoundedRectangle(cornerRadius: 30)).overlay(RoundedRectangle(cornerRadius: 30).stroke(.white.opacity(0.1))).shadow(radius: 30)
        }
    }

    private func tap(_ key: String) {
        error = ""
        if key == "⌫" { if !digits.isEmpty { digits.removeLast() }; return }
        guard digits.count < 4 else { return }
        digits += key
        guard digits.count == 4 else { return }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.08) {
            if setup {
                if !confirming { firstPIN = digits; digits = ""; confirming = true }
                else if digits == firstPIN { onSuccess(pinDigest(digits)) }
                else { error = "PINs didn’t match — try again."; digits = ""; firstPIN = ""; confirming = false }
            } else if pinDigest(digits) == existingHash { onSuccess(nil) }
            else { error = "That PIN isn’t correct."; digits = "" }
        }
    }
}

private struct ChoiceCard: View {
    let icon: String; let eyebrow: String; let title: String; let subtitle: String; let light: Bool; let enabled: Bool
    private let navy = Color(red: 20/255, green: 29/255, blue: 38/255)
    private let cream = Color(red: 226/255, green: 226/255, blue: 210/255)
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Image(systemName: icon).font(.system(size: 25, weight: .black)).foregroundStyle(light ? cream : .pink).frame(width: 58, height: 58).background(light ? navy : .white.opacity(0.06), in: RoundedRectangle(cornerRadius: 17))
            Spacer(minLength: 28)
            Text(eyebrow).font(.system(size: 10, weight: .heavy)).tracking(1.8).foregroundStyle(light ? navy.opacity(0.58) : .white.opacity(0.55))
            Text(title).font(.system(size: 34, weight: .black, design: .rounded)).tracking(-1).foregroundStyle(light ? navy : .white).padding(.top, 7)
            HStack { Text(subtitle).font(.system(size: 15, weight: .medium)).foregroundStyle(light ? navy.opacity(0.6) : .white.opacity(0.58)); Spacer(); if enabled { Image(systemName: "arrow.right").font(.system(size: 20, weight: .black)).foregroundStyle(light ? navy : cream) } }.padding(.top, 10)
        }
        .padding(26).frame(maxWidth: .infinity, minHeight: 245, alignment: .leading)
        .background(light ? AnyShapeStyle(cream) : AnyShapeStyle(LinearGradient(colors: [Color(red: 36/255, green: 48/255, blue: 60/255), Color(red: 29/255, green: 39/255, blue: 50/255)], startPoint: .topLeading, endPoint: .bottomTrailing)), in: RoundedRectangle(cornerRadius: 30))
        .overlay(RoundedRectangle(cornerRadius: 30).stroke(.white.opacity(0.09))).shadow(color: .black.opacity(0.22), radius: 26, y: 12).opacity(enabled ? 1 : 0.45)
    }
}

private struct Kicker: View {
    let text: String
    var body: some View { Text(text).font(.system(size: 12, weight: .heavy)).tracking(2.2).foregroundStyle(Color(red: 226/255, green: 226/255, blue: 210/255)).padding(.horizontal, 16).padding(.vertical, 9).background(.white.opacity(0.05), in: Capsule()).overlay(Capsule().stroke(.white.opacity(0.1))) }
}

private struct BrandPNG: View {
    let name: String
    var body: some View {
        if let url = Bundle.main.url(forResource: name, withExtension: "png", subdirectory: "brand"), let image = UIImage(contentsOfFile: url.path) { Image(uiImage: image).resizable().scaledToFit() }
        else { Circle().fill(Color(red: 197/255, green: 31/255, blue: 93/255)).overlay(Text("KO").font(.system(size: 18, weight: .black)).foregroundStyle(.white)) }
    }
}

private struct PressStyle: ButtonStyle { func makeBody(configuration: Configuration) -> some View { configuration.label.scaleEffect(configuration.isPressed ? 0.985 : 1).animation(.easeOut(duration: 0.09), value: configuration.isPressed) } }
private struct PillButtonStyle: ButtonStyle { func makeBody(configuration: Configuration) -> some View { configuration.label.font(.system(size: 12, weight: .heavy)).tracking(1.1).foregroundStyle(.white.opacity(0.78)).padding(.horizontal, 16).padding(.vertical, 12).background(.white.opacity(configuration.isPressed ? 0.09 : 0.05), in: Capsule()).overlay(Capsule().stroke(.white.opacity(0.1))) } }

final class NetworkMonitor: ObservableObject {
    @Published var isOnline = true
    private let monitor = NWPathMonitor()
    private let queue = DispatchQueue(label: "KO.NetworkMonitor")
    init() { monitor.pathUpdateHandler = { [weak self] path in DispatchQueue.main.async { self?.isOnline = path.status == .satisfied } }; monitor.start(queue: queue) }
    deinit { monitor.cancel() }
}
