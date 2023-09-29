# Dokumentacja projektu video-converter-h265-h264

## Opis projektu

*video-converter-h265-h264* to aplikacja do konwertowania plików wideo z formatu H.265 do H.264. Aplikacja składa się z dwóch głównych komponentów: front-end napisany w Svelte oraz back-end oparty na Express. Do przetwarzania plików wideo wykorzystuje narzędzie FFMpeg.

## Technologie użyte w projekcie

- Front-end: Svelte
- Back-end: Express.js
- Narzędzie do konwersji wideo: FFMpeg

## Struktura projektu

Projekt składa się z dwóch głównych części: front-end i back-end.

### Front-end (Svelte)

Front-end projektu znajduje się w folderze svelte-frontend. Tutaj znajdziesz pliki związane z interfejsem użytkownika.

### Back-end (Express.js)

Back-end projektu znajduje się w głównym pliku server.js. Oto kluczowe elementy back-endu:

#### Middlewares

- express-formidable: Middleware do obsługi przesyłania plików.
- cors: Middleware umożliwiający żądania z różnych domen.

#### Obsługa plików wideo

- Aplikacja umożliwia przesyłanie plików wideo na serwer i konwertowanie ich z H.265 na H.264.
- Pliki wideo są przesyłane do folderu public i konwertowane do folderu converted.

#### Obsługa progresu konwersji

- Używamy biblioteki ffmpeg-progress-wrapper, aby monitorować postęp konwersji plików wideo.

#### API endpoints

- GET /vid/:video: Zwraca przekonwertowany plik wideo o nazwie video w formacie MP4.
- GET /prg/:video: Zwraca postęp konwersji pliku video w formacie JSON.
- POST /api/upload: Przesyła plik wideo na serwer i rozpoczyna proces konwersji.

#### Serwowanie aplikacji

Aplikacja jest uruchamiana na porcie 3001.

## Instrukcje uruchomienia

Aby uruchomić projekt, wykonaj następujące kroki:

1. Upewnij się, że masz zainstalowanego Node.js na swoim systemie.

2. Przejdź do głównego katalogu projektu.

3. Zainstaluj zależności, wykonując polecenie:

   ```
   npm install
   ```
   

4. Uruchom aplikację, wykonując polecenie:

   ```
    npm start
   ```
   

   Aplikacja będzie dostępna pod adresem http://localhost:5173.

## Uwagi końcowe

Projekt *video-converter-h265-h264* umożliwia przesyłanie plików wideo, konwersję ich z H.265 na H.264 oraz monitorowanie postępu konwersji. Jest to przykład zastosowania narzędzia FFMpeg w połączeniu z technologią Svelte i Express.js do tworzenia prostego narzędzia do konwersji wideo. Projekt można rozbudować o dodatkowe funkcje i interfejs użytkownika w przyszłości.
