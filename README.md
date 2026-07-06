# Darts Gegner Datenbank

Eine statische Web App fuer deine persoenliche Darts-Liga-Vorbereitung.

Die App laeuft komplett im Browser:

- Passwortschutz beim Oeffnen der App
- Gegnerprofile anlegen, bearbeiten und loeschen
- Spiele im Best-of-6-Format speichern
- automatische Statistik und Rangliste
- Trainings-App mit 501 Double Out gegen Computer-Gegner
- Doppeltraining und Scoring Check mit Speicherung
- Suche und Filter
- lokale Speicherung per `localStorage`
- JSON Export und Import fuer Backups

## Dateien

```text
index.html
style.css
script.js
README.md
```

Private JSON-Dateien wie `season-12-gegner-import.json` gehoeren nicht ins oeffentliche GitHub Repository.

## Lokal starten

Du kannst die App direkt oeffnen:

1. Lade den Ordner auf deinen Computer.
2. Oeffne `index.html` mit deinem Browser.
3. Lege beim ersten Start ein Passwort fest.
4. Deine Daten werden lokal in diesem Browser gespeichert.

## Passwortschutz

Beim ersten Start fragt die App nach einem Passwort. Danach wird die App erst nach Eingabe dieses Passworts geoeffnet.

Wichtig: GitHub Pages ist eine statische Webseite. Der Passwortschutz schuetzt vor einfachem Zugriff auf deinem Browser und deiner App-Oberflaeche. Lade trotzdem keine JSON-Dateien mit echten Gegnerdaten in ein oeffentliches Repository hoch.

## Training

Der Bereich `Training` enthaelt ein 501 Double Out gegen Computer-Gegner in mehreren Staerken. Nach einem Leg bewertet die App dein Spiel gegen die Average-Werte deiner gespeicherten Liga-Gegner.

Zusaetzlich kannst du Doppeltraining und Scoring Checks speichern. Diese Trainingsdaten werden lokal im Browser gespeichert und beim JSON Export mitgesichert.

## GitHub Pages nutzen

1. Erstelle auf GitHub ein neues Repository.
2. Lade nur die App-Dateien hoch: `index.html`, `style.css`, `script.js`, `README.md` und optional `.gitignore`.
3. Oeffne auf GitHub `Settings`.
4. Gehe zu `Pages`.
5. Waehle bei `Build and deployment` die Quelle `Deploy from a branch`.
6. Waehle den Branch `main` und den Ordner `/root`.
7. Speichere die Einstellung.

Nach kurzer Zeit zeigt GitHub dir dort die Adresse deiner App an.

## Datensicherung

Die App speichert Daten im Browser. Wenn du den Browser wechselst, den Browser-Speicher loeschst oder an einem anderen Geraet arbeitest, sind die Daten dort nicht automatisch vorhanden.

Nutze deshalb regelmaessig:

- `JSON Export`, um eine Sicherungsdatei zu speichern
- `JSON Import`, um eine Sicherungsdatei wieder einzuspielen

Bewahre diese JSON-Dateien privat auf, zum Beispiel lokal auf deinem Computer oder in einem privaten Cloud-Ordner.

## Hinweis

Die JSON-Datei enthaelt alle Gegner und Spiele. Bewahre sie am besten an einem sicheren Ort auf, wenn du deine Liga-Historie behalten moechtest.
