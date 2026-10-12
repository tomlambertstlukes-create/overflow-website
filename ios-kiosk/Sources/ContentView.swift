import SwiftUI
import Network

private let checkInURL = URL(string: "https://kingdomoverflow.churchsuite.com/checkin")!
private let joinURL = URL(string: "https://kingdomoverflow.churchsuite.com/-/forms/zqtiiald")!

private enum KioskMode: Equatable {
    case home
    case staff
    case web(URL, WebPurpose)
    case staffConfirm(Bool)
    case checkInSuccess
    case registrationSuccess
}

enum WebPurpose: Equatable {
    case checkIn
    case join
    case staffStart
    case staffClose
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
    .init(id: "wellbeing", name: "Overflow Wellbeing Centre", asset: nil),
]

struct ContentView: View {
    @AppStorage("ko-session-ready") private var sessionReady = false
    @AppStorage("ko-session-date") private var sessionDate = ""
    @AppStorage("ko-gathering-id") private var gatheringID = "hub"
    @AppStorage("ko-gathering-name") private var gatheringName = "Overflow Hub"

    @State private var mode: KioskMode = .home
    @State private var staffHint = false
    @State private var webLoaded = false
    @StateObject private var network = NetworkMonitor()

    private let navy = Color(red: 20/255, green: 29/255, blue: 38/255)
    private let navyDeep = Color(red: 16/255, green: 24/255, blue: 33/255)
    private let blueGrey = Color(red: 36/255, green: 52/255, blue: 71/255)
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
            case .home:
                home
                    .transition(.opacity.combined(with: .move(edge: .bottom)))
            case .staff:
                staff
                    .transition(.opacity)
            case let .web(url, purpose):
                web(url: url, purpose: purpose)
            case let .staffConfirm(starting):
                staffConfirmation(starting: starting)
            case .checkInSuccess:
                checkInSuccess
            case .registrationSuccess:
                registrationSuccess
            }

            if staffHint {
                VStack {
                    Spacer()
                    Text("Press and hold Staff controls")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundStyle(.white)
                        .padding(.horizontal, 18)
                        .padding(.vertical, 12)
                        .background(.black.opacity(0.68), in: Capsule())
                        .padding(.bottom, 28)
                }
                .transition(.opacity)
            }
        }
        .animation(.easeOut(duration: 0.28), value: mode)
        .animation(.easeOut(duration: 0.18), value: staffHint)
        .statusBarHidden(true)
        .persistentSystemOverlays(.hidden)
        .onAppear { normalizeSession() }
        .onReceive(Timer.publish(every: 60, on: .main, in: .common).autoconnect()) { _ in
            normalizeSession()
        }
    }

    private var background: some View {
        ZStack {
            LinearGradient(colors: [navy, navyDeep], startPoint: .topLeading, endPoint: .bottomTrailing)

            Circle()
                .fill(hotPink.opacity(0.16))
                .frame(width: 560, height: 560)
                .blur(radius: 90)
                .offset(x: -360, y: -450)

            Circle()
                .fill(pink.opacity(0.11))
                .frame(width: 460, height: 460)
                .blur(radius: 100)
                .offset(x: -430, y: 60)

            Circle()
                .fill(cream.opacity(0.07))
                .frame(width: 460, height: 460)
                .blur(radius: 110)
                .offset(x: 390, y: 470)
        }
        .ignoresSafeArea()
    }

    private var home: some View {
        GeometryReader { geometry in
            let wide = geometry.size.width >= 760

            ScrollView {
                VStack(spacing: 0) {
                    header(wide: wide)
                    Spacer().frame(height: wide ? 62 : 44)

                    Kicker(text: "✦  WELCOME")

                    Text("Good to see you.")
                        .font(.system(size: wide ? 58 : 42, weight: .black, design: .rounded))
                        .tracking(-1.8)
                        .foregroundStyle(.white)
                        .multilineTextAlignment(.center)
                        .padding(.top, 20)

                    Text("Let’s get you checked in.")
                        .font(.system(size: wide ? 51 : 32, weight: .black, design: .rounded))
                        .tracking(-1.6)
                        .foregroundStyle(
                            LinearGradient(colors: [hotPink, pink, cream], startPoint: .leading, endPoint: .trailing)
                        )
                        .multilineTextAlignment(.center)

                    Text("Been before? Check in for today. First time with us? Register once, then you’ll be ready to check in.")
                        .font(.system(size: wide ? 19 : 16, weight: .medium))
                        .foregroundStyle(.white.opacity(0.58))
                        .multilineTextAlignment(.center)
                        .lineSpacing(5)
                        .frame(maxWidth: 760)
                        .padding(.top, 20)
                        .padding(.horizontal, 20)

                    if sessionReady {
                        activeGatheringBanner
                            .padding(.top, 26)
                    } else {
                        Label("Waiting for a team member to start today’s session", systemImage: "clock.fill")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundStyle(.white.opacity(0.72))
                            .padding(.horizontal, 18)
                            .padding(.vertical, 12)
                            .background(.white.opacity(0.05), in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                            .overlay(RoundedRectangle(cornerRadius: 18, style: .continuous).stroke(.white.opacity(0.08), lineWidth: 1))
                            .padding(.top, 26)
                    }

                    Group {
                        if wide {
                            HStack(spacing: 22) {
                                checkInCard
                                newHereCard
                            }
                        } else {
                            VStack(spacing: 18) {
                                checkInCard
                                newHereCard
                            }
                        }
                    }
                    .padding(.top, 32)

                    footer
                        .padding(.top, 30)
                }
                .frame(maxWidth: 1180)
                .padding(.horizontal, wide ? 54 : 24)
                .padding(.top, wide ? 42 : 28)
                .padding(.bottom, 26)
                .frame(maxWidth: .infinity)
            }
        }
    }

    private func header(wide: Bool) -> some View {
        HStack(spacing: 16) {
            BrandPNG(name: "ko-logo-dark")
                .frame(width: 64, height: 64)
                .background(.white.opacity(0.025), in: Circle())
                .overlay(Circle().stroke(.white.opacity(0.07), lineWidth: 1))
                .shadow(color: .black.opacity(0.25), radius: 14, y: 6)

            VStack(alignment: .leading, spacing: 4) {
                Text("Kingdom Overflow")
                    .font(.system(size: wide ? 23 : 20, weight: .black, design: .rounded))
                    .foregroundStyle(cream)
                Text("BELONGING  •  OPPORTUNITY  •  WELLBEING")
                    .font(.system(size: wide ? 10 : 8.5, weight: .medium))
                    .tracking(wide ? 1.8 : 1.25)
                    .foregroundStyle(.white.opacity(0.38))
            }

            Spacer()

            TimelineView(.periodic(from: .now, by: 10)) { context in
                VStack(alignment: .trailing, spacing: 2) {
                    Text(context.date.formatted(date: .omitted, time: .shortened))
                        .font(.system(size: wide ? 30 : 24, weight: .black, design: .rounded))
                        .foregroundStyle(cream)
                    if wide {
                        Text(context.date.formatted(.dateTime.weekday(.wide).day().month(.wide)))
                            .font(.system(size: 12, weight: .medium))
                            .foregroundStyle(.white.opacity(0.34))
                    }
                }
            }
        }
    }

    private var activeGatheringBanner: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(green)
                .frame(width: 8, height: 8)
                .shadow(color: green.opacity(0.5), radius: 8)

            if let asset = selectedGathering.asset {
                BrandPNG(name: asset)
                    .frame(width: 150, height: 40)
            } else {
                Text(selectedGathering.name)
                    .font(.system(size: 14, weight: .black))
                    .foregroundStyle(cream)
            }

            Text("SESSION LIVE")
                .font(.system(size: 10, weight: .heavy))
                .tracking(1.7)
                .foregroundStyle(green.opacity(0.9))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(green.opacity(0.07), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 20, style: .continuous).stroke(green.opacity(0.22), lineWidth: 1))
    }

    private var checkInCard: some View {
        Button {
            guard sessionReady else { return }
            openWeb(checkInURL, .checkIn)
        } label: {
            KioskChoiceCard(
                icon: sessionReady ? "person.2.fill" : "clock.fill",
                eyebrow: sessionReady ? "I’VE BEEN BEFORE" : "WAITING FOR STAFF",
                title: "Check in",
                subtitle: sessionReady ? "Find your name and check in for today" : "Today’s ChurchSuite session needs to be started first",
                light: true,
                enabled: sessionReady
            )
        }
        .buttonStyle(KOPressStyle())
        .disabled(!sessionReady)
    }

    private var newHereCard: some View {
        Button {
            openWeb(joinURL, .join)
        } label: {
            KioskChoiceCard(
                icon: "person.badge.plus",
                eyebrow: "FIRST TIME WITH US",
                title: "New here",
                subtitle: "Register once, then check in today",
                light: false,
                enabled: true
            )
        }
        .buttonStyle(KOPressStyle())
    }

    private var footer: some View {
        HStack(spacing: 14) {
            HStack(spacing: 6) {
                Circle()
                    .fill(network.isOnline ? green : orange)
                    .frame(width: 7, height: 7)
                Text(network.isOnline ? "Online" : "Offline")
                Text("•  KO Kiosk 2.0")
            }
            .font(.system(size: 11, weight: .bold))
            .foregroundStyle(network.isOnline ? green.opacity(0.72) : orange.opacity(0.9))

            Spacer()

            Text(sessionReady ? "SESSION LIVE  •  HOLD FOR STAFF" : "PRESS & HOLD FOR STAFF")
                .font(.system(size: 11, weight: .heavy))
                .tracking(1.2)
                .foregroundStyle(.white.opacity(0.67))
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(.white.opacity(0.05), in: Capsule())
                .overlay(Capsule().stroke(.white.opacity(0.1), lineWidth: 1))
                .contentShape(Capsule())
                .onTapGesture {
                    staffHint = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.7) { staffHint = false }
                }
                .onLongPressGesture(minimumDuration: 1.0) {
                    mode = .staff
                }
        }
    }

    private var staff: some View {
        GeometryReader { geometry in
            let wide = geometry.size.width >= 760
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    Button {
                        mode = .home
                    } label: {
                        Label("CHECK-IN HOME", systemImage: "chevron.left")
                            .font(.system(size: 12, weight: .heavy))
                            .tracking(1.7)
                            .foregroundStyle(.white.opacity(0.75))
                            .padding(.horizontal, 16)
                            .padding(.vertical, 10)
                            .background(.white.opacity(0.05), in: Capsule())
                            .overlay(Capsule().stroke(.white.opacity(0.1), lineWidth: 1))
                    }
                    .buttonStyle(.plain)

                    Spacer().frame(height: 52)

                    Text("STAFF CONTROLS")
                        .font(.system(size: 12, weight: .heavy))
                        .tracking(2.0)
                        .foregroundStyle(hotPink.opacity(0.9))

                    Text(sessionReady ? "Today’s session is live" : "Start today’s session")
                        .font(.system(size: wide ? 48 : 38, weight: .black, design: .rounded))
                        .tracking(-1.6)
                        .foregroundStyle(.white)
                        .padding(.top, 10)

                    Text(sessionReady
                         ? "\(selectedGathering.name) is currently selected. Open ChurchSuite to manage or close the live session."
                         : "Choose the Kingdom Overflow gathering first, then open ChurchSuite and create the matching Check-In session.")
                        .font(.system(size: wide ? 18 : 16, weight: .medium))
                        .foregroundStyle(.white.opacity(0.58))
                        .lineSpacing(6)
                        .frame(maxWidth: 820, alignment: .leading)
                        .padding(.top, 18)

                    if sessionReady {
                        activeGatheringBanner
                            .padding(.top, 28)
                    } else {
                        Text("CHOOSE GATHERING")
                            .font(.system(size: 11, weight: .heavy))
                            .tracking(1.8)
                            .foregroundStyle(.white.opacity(0.45))
                            .padding(.top, 30)
                            .padding(.bottom, 12)

                        gatheringSelector
                    }

                    Button {
                        openWeb(checkInURL, sessionReady ? .staffClose : .staffStart)
                    } label: {
                        Label(
                            sessionReady ? "Open ChurchSuite session" : "Start in ChurchSuite",
                            systemImage: "arrow.up.right.square"
                        )
                        .font(.system(size: 17, weight: .black))
                        .foregroundStyle(sessionReady ? .white : navy)
                        .frame(maxWidth: .infinity, minHeight: 72)
                        .background(
                            sessionReady
                                ? LinearGradient(colors: [hotPink, pink], startPoint: .leading, endPoint: .trailing)
                                : LinearGradient(colors: [hotPink, pink, cream], startPoint: .leading, endPoint: .trailing),
                            in: RoundedRectangle(cornerRadius: 22, style: .continuous)
                        )
                    }
                    .buttonStyle(KOPressStyle())
                    .frame(maxWidth: 820)
                    .padding(.top, 30)

                    Text(sessionReady
                         ? "In ChurchSuite use Admin → Close, confirm the session is closed, then tap KO home."
                         : "In ChurchSuite choose Show More → Create from gathering → select the matching Gathering → confirm/save, then tap KO home.")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(.white.opacity(0.36))
                        .frame(maxWidth: 820, alignment: .leading)
                        .padding(.top, 15)

                    HStack(spacing: 14) {
                        StaffUtilityButton(title: "Reset ChurchSuite sign-in") {
                            ChurchSuiteWebView.resetPersistentSession()
                        }
                        StaffUtilityButton(title: "Clear local session status") {
                            clearSession()
                            mode = .home
                        }
                    }
                    .frame(maxWidth: 820)
                    .padding(.top, 34)

                    Text("ChurchSuite sign-in is retained securely inside this kiosk app. Personal form fields disappear when the ChurchSuite view closes; the login remains until staff reset it or ChurchSuite expires it.")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(.white.opacity(0.3))
                        .lineSpacing(4)
                        .frame(maxWidth: 820, alignment: .leading)
                        .padding(.top, 24)
                }
                .frame(maxWidth: 1050, alignment: .leading)
                .padding(.horizontal, wide ? 54 : 24)
                .padding(.vertical, wide ? 42 : 28)
                .frame(maxWidth: .infinity, alignment: .center)
            }
        }
    }

    private var gatheringSelector: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(gatherings) { gathering in
                    Button {
                        gatheringID = gathering.id
                        gatheringName = gathering.name
                    } label: {
                        VStack(spacing: 7) {
                            if let asset = gathering.asset {
                                BrandPNG(name: asset)
                                    .frame(width: 145, height: 44)
                            } else {
                                Text("OVERFLOW")
                                    .font(.system(size: 15, weight: .black))
                                    .foregroundStyle(cream)
                                    .frame(width: 145, height: 44)
                            }

                            Text(gathering.name)
                                .font(.system(size: 11, weight: .bold))
                                .foregroundStyle(gatheringID == gathering.id ? cream : .white.opacity(0.56))
                        }
                        .frame(width: 180, height: 92)
                        .background(
                            gatheringID == gathering.id ? pink.opacity(0.18) : .white.opacity(0.045),
                            in: RoundedRectangle(cornerRadius: 20, style: .continuous)
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 20, style: .continuous)
                                .stroke(gatheringID == gathering.id ? pink : .white.opacity(0.1), lineWidth: gatheringID == gathering.id ? 2 : 1)
                        )
                    }
                    .buttonStyle(KOPressStyle())
                }
            }
            .padding(.trailing, 8)
        }
        .frame(maxWidth: 900)
    }

    private func staffConfirmation(starting: Bool) -> some View {
        VStack(spacing: 0) {
            Spacer()

            BrandPNG(name: "ko-logo-dark")
                .frame(width: 78, height: 78)

            Text(starting ? "SESSION SETUP" : "SESSION CLOSE")
                .font(.system(size: 11, weight: .heavy))
                .tracking(2.0)
                .foregroundStyle(hotPink)
                .padding(.top, 26)

            Text(starting ? "Is \(selectedGathering.name) live?" : "Has the ChurchSuite session been closed?")
                .font(.system(size: 42, weight: .black, design: .rounded))
                .tracking(-1.4)
                .foregroundStyle(.white)
                .multilineTextAlignment(.center)
                .padding(.top, 10)

            Text(starting
                 ? "Only confirm once the matching Gathering has been created and is running in ChurchSuite."
                 : "Confirm once ChurchSuite has finished closing today’s session.")
                .font(.system(size: 17, weight: .medium))
                .foregroundStyle(.white.opacity(0.58))
                .multilineTextAlignment(.center)
                .frame(maxWidth: 700)
                .padding(.top, 16)

            Button {
                if starting {
                    sessionReady = true
                    sessionDate = todayKey
                    gatheringName = selectedGathering.name
                } else {
                    clearSession()
                }
                mode = .home
            } label: {
                HStack {
                    Text(starting ? "YES — SESSION IS LIVE" : "YES — SESSION IS CLOSED")
                    Spacer()
                    Image(systemName: "arrow.right")
                }
                .font(.system(size: 16, weight: .black))
                .foregroundStyle(navy)
                .padding(.horizontal, 24)
                .frame(maxWidth: 700, minHeight: 72)
                .background(
                    LinearGradient(colors: [hotPink, pink, cream], startPoint: .leading, endPoint: .trailing),
                    in: RoundedRectangle(cornerRadius: 22, style: .continuous)
                )
            }
            .buttonStyle(KOPressStyle())
            .padding(.top, 30)

            Button {
                mode = .staff
            } label: {
                Text("NOT YET — RETURN TO STAFF CONTROLS")
                    .font(.system(size: 12, weight: .heavy))
                    .tracking(1.2)
                    .foregroundStyle(.white.opacity(0.72))
                    .frame(maxWidth: 700, minHeight: 58)
                    .background(.white.opacity(0.05), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
                    .overlay(RoundedRectangle(cornerRadius: 20, style: .continuous).stroke(.white.opacity(0.1), lineWidth: 1))
            }
            .buttonStyle(KOPressStyle())
            .padding(.top, 14)

            Spacer()
        }
        .padding(.horizontal, 30)
    }

    private var checkInSuccess: some View {
        VStack(spacing: 0) {
            Spacer()

            Image(systemName: "checkmark")
                .font(.system(size: 38, weight: .black))
                .foregroundStyle(navy)
                .frame(width: 84, height: 84)
                .background(cream, in: Circle())
                .shadow(color: .black.opacity(0.2), radius: 18, y: 8)

            Text("You’re checked in.")
                .font(.system(size: 50, weight: .black, design: .rounded))
                .tracking(-1.5)
                .foregroundStyle(.white)
                .padding(.top, 26)

            Text("Have a great session.")
                .font(.system(size: 18, weight: .medium))
                .foregroundStyle(.white.opacity(0.55))
                .padding(.top, 8)

            Spacer()
        }
        .onAppear {
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.45) {
                if mode == .checkInSuccess { mode = .home }
            }
        }
    }

    private var registrationSuccess: some View {
        VStack(spacing: 0) {
            Spacer()

            BrandPNG(name: "ko-logo-dark")
                .frame(width: 82, height: 82)

            Text("WELCOME TO KINGDOM OVERFLOW")
                .font(.system(size: 11, weight: .heavy))
                .tracking(1.9)
                .foregroundStyle(hotPink)
                .padding(.top, 24)

            Text("You’re registered.")
                .font(.system(size: 48, weight: .black, design: .rounded))
                .tracking(-1.5)
                .foregroundStyle(.white)
                .padding(.top, 10)

            Text("Your Kingdom Overflow record is ready. You can now check in for today.")
                .font(.system(size: 17, weight: .medium))
                .foregroundStyle(.white.opacity(0.56))
                .multilineTextAlignment(.center)
                .frame(maxWidth: 650)
                .padding(.top, 14)

            if sessionReady {
                Button {
                    openWeb(checkInURL, .checkIn)
                } label: {
                    HStack {
                        Text("CHECK IN FOR TODAY")
                        Spacer()
                        Image(systemName: "arrow.right")
                    }
                    .font(.system(size: 16, weight: .black))
                    .foregroundStyle(navy)
                    .padding(.horizontal, 24)
                    .frame(maxWidth: 650, minHeight: 72)
                    .background(
                        LinearGradient(colors: [hotPink, pink, cream], startPoint: .leading, endPoint: .trailing),
                        in: RoundedRectangle(cornerRadius: 22, style: .continuous)
                    )
                }
                .buttonStyle(KOPressStyle())
                .padding(.top, 30)
            }

            Button {
                mode = .home
            } label: {
                Text("RETURN TO CHECK-IN HOME")
                    .font(.system(size: 12, weight: .heavy))
                    .tracking(1.2)
                    .foregroundStyle(.white.opacity(0.72))
                    .frame(maxWidth: 650, minHeight: 58)
                    .background(.white.opacity(0.05), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
                    .overlay(RoundedRectangle(cornerRadius: 20, style: .continuous).stroke(.white.opacity(0.1), lineWidth: 1))
            }
            .buttonStyle(KOPressStyle())
            .padding(.top, 14)

            Spacer()
        }
        .padding(.horizontal, 30)
    }

    private func web(url: URL, purpose: WebPurpose) -> some View {
        ZStack(alignment: .topTrailing) {
            ChurchSuiteWebView(
                url: url,
                purpose: purpose,
                onCheckInComplete: { mode = .checkInSuccess },
                onJoinComplete: { mode = .registrationSuccess },
                onLoaded: { webLoaded = true },
                onIdleTimeout: { returnFromWeb(purpose: purpose) }
            )
            .ignoresSafeArea()

            if !webLoaded {
                VStack(spacing: 18) {
                    BrandPNG(name: "ko-logo-dark")
                        .frame(width: 92, height: 92)
                    Text("Opening ChurchSuite…")
                        .font(.system(size: 20, weight: .black))
                        .foregroundStyle(cream)
                    Text("SECURE KO CHECK-IN")
                        .font(.system(size: 10, weight: .heavy))
                        .tracking(1.7)
                        .foregroundStyle(.white.opacity(0.38))
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(background)
                .ignoresSafeArea()
            }

            Button {
                returnFromWeb(purpose: purpose)
            } label: {
                Label("KO home", systemImage: "chevron.left")
                    .font(.system(size: 13, weight: .black))
                    .foregroundStyle(.white)
                    .padding(.horizontal, 17)
                    .frame(height: 48)
                    .background(pink, in: Capsule())
                    .shadow(color: .black.opacity(0.28), radius: 12, y: 6)
            }
            .buttonStyle(.plain)
            .padding(16)
        }
    }

    private func openWeb(_ url: URL, _ purpose: WebPurpose) {
        webLoaded = false
        mode = .web(url, purpose)
    }

    private func returnFromWeb(purpose: WebPurpose) {
        switch purpose {
        case .staffStart:
            mode = .staffConfirm(true)
        case .staffClose:
            mode = .staffConfirm(false)
        default:
            mode = .home
        }
    }

    private var todayKey: String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_GB")
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: Date())
    }

    private func normalizeSession() {
        if sessionReady && sessionDate != todayKey {
            clearSession()
        }
    }

    private func clearSession() {
        sessionReady = false
        sessionDate = ""
    }
}

private struct KioskChoiceCard: View {
    let icon: String
    let eyebrow: String
    let title: String
    let subtitle: String
    let light: Bool
    let enabled: Bool

    private let navy = Color(red: 20/255, green: 29/255, blue: 38/255)
    private let cream = Color(red: 226/255, green: 226/255, blue: 210/255)

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Image(systemName: icon)
                .font(.system(size: 27, weight: .bold))
                .foregroundStyle(light ? cream : Color(red: 1, green: 0.83, blue: 0.92))
                .frame(width: 60, height: 60)
                .background(light ? navy : .white.opacity(0.07), in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                .overlay(RoundedRectangle(cornerRadius: 18, style: .continuous).stroke(.white.opacity(0.09), lineWidth: 1))

            Spacer(minLength: 36)

            Text(eyebrow)
                .font(.system(size: 11, weight: .heavy))
                .tracking(2)
                .foregroundStyle(light ? navy.opacity(0.58) : .white.opacity(0.55))

            Text(title)
                .font(.system(size: 36, weight: .black, design: .rounded))
                .tracking(-1.1)
                .foregroundStyle(light ? navy : .white)
                .padding(.top, 7)

            HStack(alignment: .center) {
                Text(subtitle)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundStyle(light ? navy.opacity(0.6) : .white.opacity(0.58))
                    .multilineTextAlignment(.leading)
                Spacer(minLength: 14)
                if enabled {
                    Image(systemName: "arrow.right")
                        .font(.system(size: 20, weight: .black))
                        .foregroundStyle(light ? navy : cream)
                }
            }
            .padding(.top, 10)
        }
        .padding(26)
        .frame(maxWidth: .infinity, minHeight: 255, alignment: .leading)
        .background(
            Group {
                if light {
                    cream
                } else {
                    LinearGradient(
                        colors: [Color(red: 36/255, green: 48/255, blue: 60/255), Color(red: 29/255, green: 39/255, blue: 50/255)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                }
            },
            in: RoundedRectangle(cornerRadius: 30, style: .continuous)
        )
        .overlay(RoundedRectangle(cornerRadius: 30, style: .continuous).stroke(.white.opacity(0.09), lineWidth: 1))
        .shadow(color: .black.opacity(0.22), radius: 26, y: 12)
        .opacity(enabled ? 1 : 0.45)
    }
}

private struct Kicker: View {
    let text: String

    var body: some View {
        Text(text)
            .font(.system(size: 12, weight: .heavy))
            .tracking(2.2)
            .foregroundStyle(Color(red: 226/255, green: 226/255, blue: 210/255))
            .padding(.horizontal, 16)
            .padding(.vertical, 9)
            .background(.white.opacity(0.05), in: Capsule())
            .overlay(Capsule().stroke(.white.opacity(0.1), lineWidth: 1))
    }
}

private struct BrandPNG: View {
    let name: String

    var body: some View {
        if let image = BrandAssets.image(named: name) {
            Image(uiImage: image)
                .resizable()
                .scaledToFit()
        } else {
            RoundedRectangle(cornerRadius: 14)
                .fill(Color.white.opacity(0.04))
                .overlay(Text("KO").font(.headline.bold()).foregroundStyle(.white.opacity(0.7)))
        }
    }
}

private enum BrandAssets {
    static func image(named name: String) -> UIImage? {
        let candidates = [
            Bundle.main.url(forResource: name, withExtension: "png", subdirectory: "brand"),
            Bundle.main.url(forResource: name, withExtension: "png")
        ]
        for candidate in candidates {
            if let url = candidate, let image = UIImage(contentsOfFile: url.path) {
                return image
            }
        }
        return nil
    }
}

private struct StaffUtilityButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(.white.opacity(0.72))
                .frame(maxWidth: .infinity, minHeight: 56)
                .background(.white.opacity(0.05), in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                .overlay(RoundedRectangle(cornerRadius: 18, style: .continuous).stroke(.white.opacity(0.1), lineWidth: 1))
        }
        .buttonStyle(KOPressStyle())
    }
}

private struct KOPressStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.985 : 1)
            .opacity(configuration.isPressed ? 0.94 : 1)
            .animation(.easeOut(duration: 0.12), value: configuration.isPressed)
    }
}

private final class NetworkMonitor: ObservableObject {
    @Published var isOnline = true
    private let monitor = NWPathMonitor()
    private let queue = DispatchQueue(label: "ko-network-monitor")

    init() {
        monitor.pathUpdateHandler = { [weak self] path in
            DispatchQueue.main.async {
                self?.isOnline = path.status == .satisfied
            }
        }
        monitor.start(queue: queue)
    }

    deinit {
        monitor.cancel()
    }
}
