# Darts Performance Hub

Eine statische Web App fuer deine persoenliche Darts-Performance, Liga-Vorbereitung und Gegnerdatenbank.

Die App laeuft komplett im Browser:

- Passwortschutz beim Oeffnen der App
- Dashboard mit Spielen, Siegquote, Leg-Differenz und aktueller Serie
- eigenes Spielerin-Profil mit Average, High Finish, Lieblingsdoppel und Dartsgewicht
- Liga-, Cup-, Turnier-, Trainings- und Eventspiele speichern
- separate Liga-Tabelle fuer alle Ligaspiele, auch Spiele ohne dich
- eigene Events beim Gegner-Anlegen erstellen und im Dashboard filtern
- Dashboard-Schalter fuer Offizielle Spiele, Alle Spiele oder Nur Training
- Gegnerprofile mit RDL-Name, Team, Liga, Spieltempo und Staerken
- Spielstatistik-Screenshots lokal an Matches haengen
- Legverlauf und mentale Matchanalyse speichern
- Setups speichern, bearbeiten, archivieren und auswerten
- automatische Statistik und Rangliste
- Trainings-App mit 501 Double Out gegen Computer-Gegner
- Checkout-Abfrage im 501-Training mit Ziel-Doppel, Treffer, Fehlversuch und Finish-Darts
- Doppeltraining und Scoring Check mit Speicherung
- lokale Analyse mit Coach-Hinweisen und Performance Report
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

1. Oeffne den App-Ordner auf deinem Computer.
2. Oeffne `index.html` mit deinem Browser.
3. Lege beim ersten Start ein Passwort fest.
4. Deine Daten werden lokal in diesem Browser gespeichert.

## Passwortschutz

Beim ersten Start fragt die App nach einem Passwort. Danach wird die App erst nach Eingabe dieses Passworts geoeffnet.

Wichtig: GitHub Pages ist eine statische Webseite. Der Passwortschutz schuetzt die App-Oberflaeche vor neugierigen Blicken, ersetzt aber keinen echten Server-Login. Lade deshalb keine JSON-Dateien mit echten Gegnerdaten in ein oeffentliches Repository hoch.

## Bereiche

`Dashboard` zeigt deine wichtigsten Kennzahlen und den Schnellzugriff auf Gegner. Standard ist `Offizielle Spiele`, also Liga, Cup und Turnier/Event. Training wird nur mitgezaehlt, wenn du auf `Alle Spiele` oder `Nur Training` umstellst.

`Setups` enthaelt auch dein eigenes Spielerin-Profil. Dort kannst du deine Basiswerte wie Average, High Finish, Lieblingsdoppel, Dartsgewicht, Heimatort und Alter bearbeiten.

`Spiele` speichert Liga, Cup, Turnier/Event, Training und Freundschaftsspiele. Du kannst Ergebnis, Average, Doppelquote, First 9, 100+, 140+, 180er, High Finish, Legverlauf, Setup, mentale Werte und Screenshots speichern.

`Liga Tabelle` ist fuer die originale Liga-Tabelle. Dort kannst du alle Ligaspiele eintragen, auch Spiele zwischen zwei Gegnern. Die App berechnet Punkte, Siege, Unentschieden, Niederlagen, Legs und Leg-Differenz. Platz 1 und 2 werden als Direktaufstieg markiert, Platz 3 bis 5 als Aufstiegsrunde. Diese Ligaspiele werden nicht in deine persoenliche Performance-Analyse gemischt.

`Gegner` verwaltet Profile mit RDL-Name, Team, Liga, Kategorie, Tempo, Average, Doppelquote, Staerken, Schwaechen und taktischen Hinweisen.

Beim Gegner-Anlegen kannst du `Liga`, `Cup`, `Liga + Cup` oder `Neues Event anlegen` waehlen. Eigene Events erscheinen danach oben im Dashboard als Schnellfilter und werden beim JSON Export mitgesichert.

`Training` enthaelt 501 Double Out gegen Computer-Gegner, Doppeltraining und Scoring Checks. Im 501-Training erscheint im Checkout-Bereich eine Zusatzabfrage: ob du ein Doppel anvisiert hast, welches Doppel es war, ob du es verpasst oder getroffen hast und mit wie vielen Darts du gecheckt hast. Cup-Gegner werden in der Trainingsbewertung beruecksichtigt, sobald sie als Kategorie `Cup` oder `Liga + Cup` gespeichert sind.

`Setups` speichert dein Material und wertet Matches pro Setup aus: Spiele, Average, Doppelquote, Siegquote und mentale Tendenz.

`Statistik` und `Analyse` haben einen Wettbewerbsfilter. Standard ist auch hier `Offizielle Spiele`, damit Trainingswerte deine Liga-Form nicht verfaelschen.

`Analyse` arbeitet lokal im Browser. Es wird keine externe KI API verwendet. Die App sucht Muster in Form, erstem Leg, Schlussphase, Nervositaet, Setup, Scoring, Checkout und Gegnerbilanzen.

`Rangliste` sortiert deine Gegner nach Bilanz, Siegen, Leg-Differenz, Siegquote oder Average.

`Einstellungen` enthaelt JSON Export, JSON Import und Daten zuruecksetzen.

## GitHub Pages nutzen

1. Erstelle auf GitHub ein neues Repository.
2. Lade nur diese Dateien hoch: `index.html`, `style.css`, `script.js`, `README.md` und optional `.gitignore`.
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
