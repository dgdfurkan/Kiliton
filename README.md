# Kurye Depo App - Kurulum ve Yayınlama Rehberi

Bu proje, kurye ekiplerinin bina şifrelerini kolayca paylaşabilmesi için geliştirilmiş modern bir web uygulamasıdır (PWA).

## 🚀 Başlangıç

Bu projeyi kendi bilgisayarınızda çalıştırmak veya internette yayınlamak için aşağıdaki adımları takip edin.

### 1. Firebase Kurulumu (Veritabanı ve Giriş Sistemi)

Uygulamanın çalışması için Google Firebase servisini kullanacağız. Ücretsizdir.

1.  [firebase.google.com](https://firebase.google.com/) adresine gidin ve Google hesabınızla giriş yapın.
2.  **"Go to Console"** (Konsola Git) butonuna tıklayın.
3.  **"Add project"** (Proje Ekle) butonuna tıklayın.
4.  Projenize bir isim verin (örn: `kurye-app-2024`) ve devam edin. Google Analytics'i kapatabilirsiniz, şart değil.
5.  Proje oluştuktan sonra sol menüden **Build -> Authentication** kısmına tıklayın.
6.  **"Get Started"** diyerek servisi başlatın.
7.  **Sign-in method** (Giriş yöntemi) sekmesinden **Email/Password** seçeneğini bulun, üzerine tıklayın ve **Enable** (Etkinleştir) diyerek kaydedin.
8.  Sol menüden **Build -> Firestore Database** kısmına tıklayın.
9.  **"Create Database"** butonuna tıklayın.
10. Konum olarak `eur3 (europe-west)` seçebilirsiniz (Türkiye'ye yakın).
11. **Security Rules** adımında **"Start in test mode"** seçip ilerleyin. (Bu, geliştirme aşamasında kolaylık sağlar).

### 2. API Anahtarlarını Almak ve Eklemek

1.  Firebase konsolunda sol üstte bulunan **Ayarlar (Dişli Çark)** simgesine tıklayın ve **Project settings** seçeneğine gidin.
2.  Aşağı kaydırın, **"Your apps"** kısmında **Web (`</>`)** ikonuna tıklayın.
3.  Uygulamaya bir takma ad verin (örn: `Web App`) ve **Register app** deyin.
4.  Ekrana gelen kod bloğundaki `const firebaseConfig = { ... }` kısmını kopyalayın.
5.  Bu projede `src/firebase.js` dosyasını açın.
6.  O dosyadaki `firebaseConfig` değişkeninin içini, kopyaladığınız yeni kodlarla değiştirin. Şuna benzemelidir:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD-...",
  authDomain: "kurye-app-....firebaseapp.com",
  projectId: "kurye-app-...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### 3. Bilgisayarınızda Çalıştırma

Terminali açın ve proje klasöründe şu komutları sırasıyla yazın:

```bash
# Gerekli paketleri yükle
npm install

# Uygulamayı başlat
npm run dev
```

Tarayıcınızda size verilen adresi (genelde `http://localhost:5173`) açarak uygulamayı test edebilirsiniz.

### 4. GitHub Pages'de Yayınlama (İnternete Açma)

Uygulamayı herkesin kullanabileceği bir link haline getirmek için:

1.  Bu projeyi kendi GitHub hesabınızda bir repoya yükleyin.
2.  `vite.config.js` dosyasını açın ve `base: '/repo-adiniz/',` satırını ekleyin (Eğer repo adınız `kurye-app` ise `base: '/kurye-app/',` olmalı). **Önemli:** Eğer direkt `kullaniciadi.github.io` repusu kullanacaksanız bu adıma gerek yok.
3.  Terminalde şu komutu çalıştırarak projeyi derleyin:

```bash
npm run build
```

4.  Oluşan `dist` klasörünün içindekileri sunucunuza yükleyin veya GitHub Pages kullanıyorsanız `gh-pages` paketi ile deploy edin.

**Alternatif (Vercel ile Tek Tıkla Kurulum - Önerilen):**
GitHub Pages bazen PWA ayarlarında (yönlendirme sorunları) karmaşık olabilir. En kolayı [Vercel](https://vercel.com) kullanmaktır.
1. Vercel'e üye olun.
2. "Add New Project" diyip GitHub reponuzu seçin.
3. Hiçbir ayar yapmadan "Deploy" deyin.
4. Size `https://proje-adiniz.vercel.app` gibi çalışan bir link verecektir.

## 📱 Telefona Uygulama Olarak Yükleme (PWA)

Siteye telefondan (Chrome veya Safari) girdiğinizde:
*   **Android:** "Ana Ekrana Ekle" uyarısı çıkabilir veya seçeneklerden "Uygulamayı Yükle" diyebilirsiniz.
*   **iOS (iPhone):** Paylaş butonuna basıp "Ana Ekrana Ekle" demeniz yeterlidir.

Artık internet yokken bile (önceden girdiği sayfalar için) açılabilen bir uygulamanız var!
