plugins {
    id("com.android.application")
}

android {
    namespace = "org.kingdomoverflow.kiosk"
    compileSdk = 35

    defaultConfig {
        applicationId = "org.kingdomoverflow.kiosk"
        minSdk = 26
        targetSdk = 35
        versionCode = 20
        versionName = "2.0.0"
    }

    sourceSets {
        getByName("main") {
            assets.srcDir("../../public/brand")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }
}
