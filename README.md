# Darts Gegner Datenbank

Eine statische Web App fuer deine persoenliche Darts-Liga-Vorbereitung.

Die App laeuft komplett im Browser:

- Gegnerprofile anlegen, bearbeiten und loeschen
- Spiele im Best-of-6-Format speichern
- automatische Statistik und Rangliste
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

## Lokal starten

Du kannst die App direkt oeffnen:

1. Lade den Ordner auf deinen Computer.
2. Oeffne `index.html` mit deinem Browser.
3. Deine Daten werden lokal in diesem Browser gespeichert.

## GitHub Pages nutzen

1. Erstelle auf GitHub ein neues Repository.
2. Lade diese vier Dateien in das Repository hoch.
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

## Hinweis

Die JSON-Datei enthaelt alle Gegner und Spiele. Bewahre sie am besten an einem sicheren Ort auf, wenn du deine Liga-Historie behalten moechtest.
