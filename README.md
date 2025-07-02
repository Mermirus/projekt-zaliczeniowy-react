# Aplikacja do Zarządzania Rezerwacjami Spotkań

Aplikacja React do zarządzania rezerwacjami spotkań z integracją Firebase, Material UI i obsługą trybu ciemnego.

## Funkcjonalności

- Autentykacja użytkowników - rejestracja i logowanie
- Zarządzanie spotkaniami - dodawanie, edycja, usuwanie rezerwacji
- Kalendarz - wizualizacja spotkań w formie kalendarza
- Filtrowanie i wyszukiwanie - zaawansowane filtry spotkań
- Paginacja - wygodne przeglądanie listy spotkań
- Tryb ciemny - przełączanie między jasnym i ciemnym motywem
- Walidacja formularzy - sprawdzanie poprawności danych
- Responsywny design - działanie na różnych urządzeniach

## Wymagania systemowe

- Node.js w wersji 16.0.0 lub nowszej
- npm (zainstalowany wraz z Node.js) lub yarn
- Git (do klonowania repozytorium)
- Przeglądarka internetowa (Chrome, Firefox, Safari, Edge)

## Instalacja i uruchomienie

### Krok 1: Klonowanie repozytorium

```bash
git clone <URL_REPOZYTORIUM>
cd projekt-zaliczeniowy-react
```

### Krok 2: Instalacja zależności

```bash
npm install
```

lub jeśli używasz yarn:

```bash
yarn install
```

### Krok 3: Uruchomienie aplikacji

```bash
npm start
```

lub

```bash
yarn start
```

Aplikacja zostanie uruchomiona na `http://localhost:3000`

## Struktura projektu

```
src/
├── components/          # Komponenty React
│   ├── AddToGoogleCalendarButton.tsx
│   ├── LoginForm.tsx
│   ├── MeetingCalendar.tsx
│   ├── MeetingFilters.tsx
│   ├── MeetingForm.tsx
│   └── MeetingList.tsx
├── context/            # Konteksty React
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── pages/              # Strony aplikacji
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── services/           # Serwisy do komunikacji z Firebase
│   ├── authService.ts
│   └── meetingService.ts
├── models/             # Definicje typów TypeScript
│   └── Meeting.ts
├── styles/             # Style CSS
│   └── calendar.css
└── firebaseConfig.ts   # Konfiguracja Firebase
```

## Używane technologie

- React 18 - biblioteka UI
- TypeScript - typowanie statyczne
- Firebase - backend i autentykacja
  - Authentication (email/password)
  - Firestore Database
- Material UI (MUI) - komponenty UI
- React Router - routing
- Yup - walidacja formularzy
- date-fns - obsługa dat

## Rozwiązywanie problemów

### Problem: Aplikacja nie uruchamia się
**Rozwiązanie:**
1. Sprawdź czy masz zainstalowany Node.js w odpowiedniej wersji
2. Usuń folder `node_modules` i plik `package-lock.json`
3. Uruchom ponownie `npm install`
4. Spróbuj `npm start`

### Problem: Błędy TypeScript
**Rozwiązanie:**
1. Sprawdź czy wszystkie zależności są zainstalowane
2. Uruchom `npm run build` aby zobaczyć szczegółowe błędy
3. Upewnij się, że używasz kompatybilnych wersji pakietów

### Problem: Błędy związane z Firebase
**Rozwiązanie:** Firebase jest już skonfigurowany w projekcie. Jeśli występują błędy, sprawdź czy:
1. Masz dostęp do internetu
2. Konfiguracja Firebase w `src/firebaseConfig.ts` jest poprawna
3. Reguły bezpieczeństwa Firestore są odpowiednio ustawione

## Deployment

### Przygotowanie do produkcji

```bash
npm run build
```

### Hosting na Firebase

1. Zainstaluj Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Zaloguj się do Firebase:
```bash
firebase login
```

3. Zainicjalizuj hosting:
```bash
firebase init hosting
```

4. Wdróż aplikację:
```bash
firebase deploy
```

## Licencja

Ten projekt jest przeznaczony do celów edukacyjnych.

## Wsparcie

W przypadku problemów:
1. Sprawdź sekcję "Rozwiązywanie problemów" powyżej
2. Upewnij się, że wszystkie kroki instalacji zostały wykonane poprawnie
3. Sprawdź czy masz odpowiednią wersję Node.js

---

**Uwaga:** Firebase jest już skonfigurowany w projekcie. Aplikacja używa Firebase w trybie testowym. 