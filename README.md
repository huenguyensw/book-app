# BookApp

Ett Angular-projekt som fungerar som frontend för Book App - en fullstackapplikation där användare kan logga in, hantera böcker och se inspirerande citat. Backend är byggd i .NET och finns i ett separat repo.

## Funktioner & UI

- Inloggning med e-post & lösenord
- Lista, lägg till, redigera & ta bort böcker
- Citat-sida
- Skyddade sidor (AuthGuard)
- **Toggle-switch** i navbar för växling av t.ex. dark/light-läge (eller annan funktion)
- **Responsivt gränssnitt**: fungerar på mobil, surfplatta och desktop

## Utveckling server

Starta en lokal utvecklings server, kör:

```bash
ng serve
```

Kör testing en lokal utvecklings server:
```bash
ng serve
```


När serven är igång, öppna din webläsare och navigera till `http://localhost:4200/`. Applikationen laddas om automatiskt när du ändrar någon av källfilerna.

## Live-länk
- Frontend (Vercel): [https://book-app-frontend.vercel.app](https://book-app-frontend.vercel.app)
- Backend API (Render): [https://bookapi-8cvo.onrender.com](https://bookapi-8cvo.onrender.com)


## Testa liveversionen

1. Besök frontend-länken:
   [https://book-app-frontend.vercel.app](https://book-app-frontend.vercel.app)
  
2. Logga in med testkontot:
    
```json
{
  "email": "test@example.com",
  "password": "MySecret123!"
}
