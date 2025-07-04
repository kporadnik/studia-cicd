# Serverless User API - AWS TypeScript

## Opis
Aplikacja chmurowa typu serverless udostępniająca REST API do zarządzania użytkownikami.  
Kod został napisany w TypeScript z wykorzystaniem czystej architektury. Dane są przechowywane w DynamoDB, a backend działa w AWS Lambda, zarządzany przez API Gateway.

## Link do wdrożonej aplikacji
https://twoja-api-endpoint.amazonaws.com/prod/user/create

## Technologie
- Node.js (v20)
- TypeScript
- AWS Lambda + API Gateway
- DynamoDB
- Git + GitHub
- GitHub Actions (CI/CD)

## Instalacja lokalna
```bash
git clone https://github.com/twoj-login/twoj-projekt.git
cd twoj-projekt
npm install
```

## Skrypty
```bash
npm run test       # uruchomienie testów jednostkowych
npm run bundle     # kompilacja TypeScript do JavaScript dla Lambd
npm run deploy     # bundlowanie i deployment do AWS
npm run destroy    # usunięcie stacku z chmury AWS
```

## Deployment
Deployment jest automatyczny i wykonywany przy pushu do brancha production.
Pipeline GitHub Actions realizuje:
- Instalację zależności
- Uruchomienie testów jednostkowych
- Uwierzytelnienie do AWS (poprzez AWS SAM)
- Wdrożenie funkcji Lambda na chmurę

## API - Endpointy
- ```POST /user/create``` – tworzy nowego użytkownika
- ```GET /user/retrieve/{id}``` – pobiera dane użytkownika
- ```PATCH /user/update/{id}``` – aktualizuje dane użytkownika
- ```DELETE /user/delete/{id}``` – usuwa użytkownika

## Struktura tabeli DynamoDB (users-db)
Nazwa pola	Typ	Opis
user_id	PK (S)	Unikalny identyfikator
first_name	String	Imię użytkownika
last_name	String	Nazwisko użytkownika
email	String	Adres e-mail

## Przykładowe requesty
```POST /user/create```
```json 
{
  "firstName": "Kacper",
  "lastName": "Kowalski",
  "email": "root@gmail.com"
}
```
```PATCH /user/update/{id}```
```json
{
  "firstName": "Jan",
  "lastName": "Nowak"
}
```

## Autor - Kacper Poradnik