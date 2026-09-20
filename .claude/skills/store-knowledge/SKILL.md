---
name: store-knowledge
description: Erkenntnisse, Problemlösungen und Lessons Learned korrekt in der hybriden Wissensdatenbank (knowledge-manager/Vault, Obsidian-Markdown + Vektor-Index) ablegen oder dort nachschlagen. Diesen Skill immer verwenden, wenn der Nutzer sagt "merk dir das", "dokumentiere das", "leg das im Vault ab", "speichere die Erkenntnis/Lösung", "neues Ticket", "haben wir dazu schon was?" — und auch unaufgefordert anbieten, nachdem ein nicht-triviales Problem gelöst wurde (Bugfix mit überraschender Ursache, Workaround, Tooling-Stolperfalle), selbst wenn der Nutzer das Vault nicht erwähnt.
---

# Wissen in der Wissensdatenbank ablegen

Die Wissensdatenbank lebt in `knowledge-manager/Vault`:
Markdown-Tickets in `Vault/Tickets/` (Obsidian-kompatibel, YAML-Frontmatter)
plus ein Vektor-Index in `Vault/Agent_Index/store.json` für semantische Suche.

## Das Vault ist auch die LESE-Quelle

**Vor jedem Prozess** (Feature, Bugfix, Analyse, Re-Architektur) die
relevanten Tickets einlesen: `search` mit 2–3 Formulierungen des Themas —
dort stehen die bisherigen Erkenntnisse, Design-Entscheidungen und ihre
Begründungen. Nicht in design.md/README nach Entscheidungen suchen und keine
Erkenntnisse dorthin schreiben: das Vault ist die einzige gepflegte Quelle
(CLAUDE.md bleibt die reine Architektur-Landkarte).

## Eiserne Regel: nur über das CLI schreiben

Lege **niemals** von Hand Markdown-Dateien in `Vault/Tickets/` an und editiere
niemals `store.json` direkt. Der Grund: Nur der Java-Code
(`ObsidianKnowledgeManager`) erzeugt die Embeddings — eine von Hand angelegte
Datei ist für die semantische Suche unsichtbar, und der Index läuft
auseinander. Das CLI ist der einzige Weg, der Markdown und Index garantiert
synchron hält.

Alle Befehle vom Repo-Root aus (jeder Aufruf ist ein einzelnes Kommando,
nicht verketten):

```powershell
# Suchen (maxResults optional, Standard 3)
.\knowledge-manager\gradlew.bat -p knowledge-manager run --quiet --args="search 'Suchbegriffe' 3"

# Neues Ticket anlegen
.\knowledge-manager\gradlew.bat -p knowledge-manager run --quiet --args="save TICKET-ID 'Problem-Text' 'Lösungs-Text' 'tag1,tag2'"

# Bestehendes Ticket ergänzen (hängt Abschnitt mit Zeitstempel an + re-indiziert)
.\knowledge-manager\gradlew.bat -p knowledge-manager run --quiet --args="update TICKET-ID 'Neues Wissen'"
```

Innerhalb von `--args="..."` mehrwortige Werte in einfache Anführungszeichen
setzen. Umlaute funktionieren; die Konsolen-*Ausgabe* kann Umlaute verstümmelt
anzeigen (cp1252) — die Dateien sind trotzdem korrektes UTF-8, das ist kein
Fehler. Die WARNING-Zeilen zu ONNX/native access beim Start sind harmlos.

## Workflow: erst suchen, dann ablegen

1. **Immer zuerst suchen** (`search` mit 2–3 Formulierungen des Themas).
   Duplikate sind das Hauptrisiko der Wissensbasis: zwei halbe Tickets zum
   selben Thema sind schlechter als eines, das gepflegt wird.
2. **Treffer zum selben Thema?** → `update` auf das bestehende Ticket statt
   eines neuen. Gleiches Thema heißt: gleiche Ursache oder gleiche Komponente,
   nicht nur ähnliche Stichworte.
3. **Kein Treffer?** → `save` mit neuem Ticket.

## Konventionen

**Ticket-ID**: `<BEREICH>-<NNN>`, Bereich großgeschrieben, Nummer dreistellig
fortlaufend pro Bereich. Vor dem Anlegen per `Glob` in
`knowledge-manager/Vault/Tickets/` die nächste freie Nummer ermitteln.
Etablierte Bereiche: ein kurzes Projektkürzel für das Host-Projekt (beim
ersten Ticket festlegen, z. B. `APP`), `KM` (Knowledge-Manager selbst),
`TOOL` (Gradle/IDE/Windows-Tooling), `DB`, `TEST` (nur für
Wegwerf-Testdaten). Neue Bereiche sparsam einführen.

**Problem-Text**: das Symptom, so wie man es beim nächsten Mal wieder googeln
würde — beobachtbares Verhalten, Fehlermeldung, Kontext. Nicht die Lösung
vorwegnehmen.

**Lösungs-Text**: die Ursache und was tatsächlich geholfen hat, inklusive dem
*Warum*. Eine Lösung ohne Begründung ist beim nächsten abweichenden Fall
wertlos. Verworfene Ansätze kurz erwähnen, wenn sie naheliegend waren.

**Tags**: 2–4 kleingeschriebene Stichworte (Technologie, Komponente),
kommasepariert ohne Leerzeichen, z. B. `gradle,windows` oder `docker,netzwerk`.

## Beispiel

Erkenntnis aus einer Debugging-Session: `gradlew run -Dfoo=bar` — die Property
kam in der Anwendung nie an.

```powershell
.\knowledge-manager\gradlew.bat -p knowledge-manager run --quiet --args="search 'System Property kommt nicht an gradle run'"
```

Kein Treffer, also:

```powershell
.\knowledge-manager\gradlew.bat -p knowledge-manager run --quiet --args="save TOOL-001 'gradlew run mit -Dfoo=bar: System.getProperty liefert in der Anwendung null.' 'Das -D setzt die Property nur in der Gradle-Build-JVM, nicht in der Anwendungs-JVM des JavaExec-run-Tasks. Fix: im run-Task per systemProperty(...) explizit durchreichen.' 'gradle,javaexec,windows'"
```

## Nach dem Ablegen

Kurz per `search` mit einer *anderen* Formulierung gegenprüfen, dass das neue
Ticket gefunden wird — das validiert, dass das Embedding den Inhalt trägt.
Dem Nutzer die Ticket-ID nennen.
