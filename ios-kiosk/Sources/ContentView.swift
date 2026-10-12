import SwiftUI

private let checkInURL = URL(string: "https://kingdomoverflow.churchsuite.com/checkin")!
private let joinURL = URL(string: "https://kingdomoverflow.churchsuite.com/-/forms/zqtiiald")!

private enum KioskMode: Equatable {
    case home
    case web(URL, WebPurpose)
    case staff
}

enum WebPurpose: Equatable {
    case checkIn
    case join
    case staff
}

struct ContentView: View {
    @AppStorage("ko-session-ready") private var sessionReady = false
    @State private var mode: KioskMode = .home
    @State private var registrationNotice = false

    private let navy = Color(red: 20/255, green: 29/255, blue: 38/255)
    private let navyDeep = Color(red: 16/255, green: 24/255, blue: 33/255)
    private let cream = Color(red: 226/255, green: 226/255, blue: 210/255)
    private let pink = Color(red: 197/255, green: 31/255, blue: 93/255)
    private let hotPink = Color(red: 243/255, green: 0/255, blue: 197/255)

    var body: some View {
        ZStack {
            background
            switch mode {
            case .home:
                home
            case .staff:
                staff
            case let .web(url, purpose):
                web(url: url, purpose: purpose)
            }
        }
        .statusBarHidden(true)
        .persistentSystemOverlays(.hidden)
    }

    private var background: some View {
        ZStack {
            LinearGradient(colors: [navy, navyDeep], startPoint: .topLeading, endPoint: .bottomTrailing)
            Circle()
                .fill(hotPink.opacity(0.13))
                .frame(width: 520, height: 520)
                .blur(radius: 80)
                .offset(x: -330, y: -420)
            Circle()
                .fill(Color(red: 65/255, green: 98/255, blue: 1).opacity(0.11))
                .frame(width: 460, height: 460)
                .blur(radius: 90)
                .offset(x: 350, y: 380)
        }
        .ignoresSafeArea()
    }

    private var home: some View {
        GeometryReader { geometry in
            let wide = geometry.size.width >= 760
            ScrollView {
                VStack(spacing: 0) {
                    header
                    Spacer().frame(height: wide ? 68 : 44)

                    Text("✦  WELCOME")
                        .font(.system(size: 12, weight: .heavy, design: .rounded))
                        .tracking(2.0)
                        .foregroundStyle(.white.opacity(0.72))
                        .padding(.horizontal, 16)
                        .padding(.vertical, 9)
                        .background(.white.opacity(0.055), in: Capsule())
                        .overlay(Capsule().stroke(.white.opacity(0.08), lineWidth: 1))

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

                    if registrationNotice {
                        Label("You’re registered. Now tap Check in to join today’s session.", systemImage: "checkmark.circle.fill")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundStyle(.green.opacity(0.92))
                            .padding(.horizontal, 20)
                            .padding(.vertical, 14)
                            .background(.green.opacity(0.09), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
                            .overlay(RoundedRectangle(cornerRadius: 20, style: .continuous).stroke(.green.opacity(0.2), lineWidth: 1))
                            .padding(.top, 24)
                    }

                    if !sessionReady {
                        Label("Waiting for a team member to start today’s session", systemImage: "clock.fill")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundStyle(.white.opacity(0.72))
                            .padding(.horizontal, 18)
                            .padding(.vertical, 12)
                            .background(.white.opacity(0.05), in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                            .overlay(RoundedRectangle(cornerRadius: 18, style: .continuous).stroke(.white.opacity(0.08), lineWidth: 1))
                            .padding(.top, 24)
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
                .padding(.top, wide ? 44 : 28)
                .padding(.bottom, 26)
                .frame(maxWidth: .infinity)
            }
        }
    }

    private var header: some View {
        HStack(spacing: 16) {
            Text("KO")
                .font(.system(size: 18, weight: .black, design: .rounded))
                .foregroundStyle(cream)
                .frame(width: 62, height: 62)
                .background(
                    LinearGradient(colors: [pink, Color(red: 139/255, green: 18/255, blue: 72/255)], startPoint: .topLeading, endPoint: .bottomTrailing),
                    in: RoundedRectangle(cornerRadius: 20, style: .continuous)
                )
                .shadow(color: .black.opacity(0.25), radius: 12, y: 6)

            VStack(alignment: .leading, spacing: 4) {
                Text("Kingdom Overflow")
                    .font(.system(size: 23, weight: .black, design: .rounded))
                    .foregroundStyle(cream)
                Text("BELONGING  •  OPPORTUNITY  •  WELLBEING")
                    .font(.system(size: 10, weight: .medium))
                    .tracking(1.8)
                    .foregroundStyle(.white.opacity(0.38))
            }

            Spacer()

            TimelineView(.periodic(from: .now, by: 10)) { context in
                VStack(alignment: .trailing, spacing: 2) {
                    Text(context.date.formatted(date: .omitted, time: .shortened))
                        .font(.system(size: 30, weight: .black, design: .rounded))
                        .foregroundStyle(cream)
                    Text(context.date.formatted(.dateTime.weekday(.wide).day().month(.wide)))
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(.white.opacity(0.34))
                }
            }
        }
    }

    private var checkInCard: some View {
        Button {
            guard sessionReady else { return }
            mode = .web(checkInURL, .checkIn)
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
        .buttonStyle(.plain)
        .disabled(!sessionReady)
    }

    private var newHereCard: some View {
        Button {
            mode = .web(joinURL, .join)
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
        .buttonStyle(.plain)
    }

    private var footer: some View {
        HStack(spacing: 14) {
            Text("ChurchSuite-powered • secure check-in")
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(.white.opacity(0.31))
            Spacer()
            Button {
                mode = .staff
            } label: {
                Text(sessionReady ? "Staff  •  Session live" : "Staff controls")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundStyle(.white.opacity(0.78))
                    .padding(.horizontal, 18)
                    .padding(.vertical, 12)
                    .background(.white.opacity(0.05), in: Capsule())
                    .overlay(Capsule().stroke(.white.opacity(0.1), lineWidth: 1))
            }
            .buttonStyle(.plain)
        }
    }

    private var staff: some View {
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

                Spacer().frame(height: 62)

                Text("STAFF CONTROLS")
                    .font(.system(size: 12, weight: .heavy))
                    .tracking(2.0)
                    .foregroundStyle(hotPink.opacity(0.86))

                Text(sessionReady ? "Today’s session is live" : "Start today’s session")
                    .font(.system(size: 48, weight: .black, design: .rounded))
                    .tracking(-1.6)
                    .foregroundStyle(.white)
                    .padding(.top, 10)

                Text(sessionReady
                     ? "Open ChurchSuite to manage or close the current session. When you have closed it there, confirm below so the kiosk returns to standby."
                     : "Open ChurchSuite, choose Show More → Create from gathering → choose the Gathering → confirm/save. Then come back here and mark the session live.")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundStyle(.white.opacity(0.58))
                    .lineSpacing(6)
                    .frame(maxWidth: 820, alignment: .leading)
                    .padding(.top, 18)

                VStack(spacing: 14) {
                    Button {
                        mode = .web(checkInURL, .staff)
                    } label: {
                        Label(sessionReady ? "Open ChurchSuite session" : "Open ChurchSuite session setup", systemImage: "arrow.up.right.square")
                            .font(.system(size: 17, weight: .black))
                            .foregroundStyle(.white)
                            .frame(maxWidth: .infinity, minHeight: 72)
                            .background(
                                LinearGradient(colors: [hotPink, pink], startPoint: .leading, endPoint: .trailing),
                                in: RoundedRectangle(cornerRadius: 22, style: .continuous)
                            )
                    }
                    .buttonStyle(.plain)

                    Button {
                        sessionReady.toggle()
                        mode = .home
                    } label: {
                        HStack {
                            Text(sessionReady ? "Session is closed — return home" : "Session is live — return home")
                                .font(.system(size: 17, weight: .black))
                            Spacer()
                            Image(systemName: "arrow.right")
                                .fontWeight(.black)
                        }
                        .foregroundStyle(navy)
                        .padding(.horizontal, 24)
                        .frame(maxWidth: .infinity, minHeight: 72)
                        .background(cream, in: RoundedRectangle(cornerRadius: 22, style: .continuous))
                    }
                    .buttonStyle(.plain)
                }
                .frame(maxWidth: 820)
                .padding(.top, 32)

                Label("ChurchSuite sign-in is remembered inside this kiosk app, so staff should normally only need to sign in once on this iPad.", systemImage: "lock.shield.fill")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(.white.opacity(0.34))
                    .frame(maxWidth: 820, alignment: .leading)
                    .padding(.top, 24)
            }
            .frame(maxWidth: 1050, alignment: .leading)
            .padding(.horizontal, 54)
            .padding(.vertical, 44)
            .frame(maxWidth: .infinity, alignment: .center)
        }
    }

    private func web(url: URL, purpose: WebPurpose) -> some View {
        ZStack(alignment: .topTrailing) {
            ChurchSuiteWebView(url: url, purpose: purpose) {
                if purpose == .checkIn {
                    mode = .home
                }
            }
            .ignoresSafeArea()

            Button {
                if purpose == .join {
                    registrationNotice = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 7) {
                        registrationNotice = false
                    }
                }
                mode = purpose == .staff ? .staff : .home
            } label: {
                Label(purpose == .join ? "Finished / KO home" : "KO home", systemImage: "chevron.left")
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
                .foregroundStyle(light ? navy.opacity(0.55) : .white.opacity(0.55))

            Text(title)
                .font(.system(size: 36, weight: .black, design: .rounded))
                .tracking(-1.2)
                .foregroundStyle(light ? navy : .white)
                .padding(.top, 7)

            HStack(alignment: .center, spacing: 14) {
                Text(subtitle)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundStyle(light ? navy.opacity(0.58) : .white.opacity(0.57))
                    .lineLimit(2)
                Spacer()
                if enabled {
                    Image(systemName: "arrow.right")
                        .font(.system(size: 20, weight: .black))
                        .foregroundStyle(light ? navy : cream)
                }
            }
            .padding(.top, 12)
        }
        .padding(26)
        .frame(maxWidth: .infinity, minHeight: 270, alignment: .leading)
        .background(
            Group {
                if light {
                    RoundedRectangle(cornerRadius: 30, style: .continuous)
                        .fill(cream)
                } else {
                    RoundedRectangle(cornerRadius: 30, style: .continuous)
                        .fill(LinearGradient(colors: [Color(red: 36/255, green: 48/255, blue: 60/255), Color(red: 29/255, green: 39/255, blue: 50/255)], startPoint: .topLeading, endPoint: .bottomTrailing))
                }
            }
        )
        .overlay(RoundedRectangle(cornerRadius: 30, style: .continuous).stroke(.white.opacity(0.09), lineWidth: 1))
        .shadow(color: .black.opacity(0.2), radius: 20, y: 10)
        .opacity(enabled ? 1 : 0.46)
    }
}
