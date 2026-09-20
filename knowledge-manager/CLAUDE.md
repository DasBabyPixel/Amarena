# Knowledge Manager — hybrides Wissensmanagement (Obsidian + Vektor-Index)

Eigenständiges Gradle-Projekt (nicht Teil des Host-Projekt-Builds). Speichert
Wissen als Obsidian-kompatible Markdown-Dateien und macht es über einen lokal
persistierten Vektor-Index semantisch durchsuchbar — komplett offline, ohne
externe API.

## Build & Run

- Vom Repo-Root: `.\knowledge-manager\gradlew.bat -p knowledge-manager run`
  (eigener Gradle-Wrapper, keine Gradle-Installation nötig) oder in diesem
  Verzeichnis `.\gradlew.bat run`.
- Der `run`-Task setzt `workingDir = projectDir`, damit `Vault/` immer neben
  `build.gradle` liegt.
- Java 17+, getestet mit Temurin 25 / Gradle 9.2.

## Datenlayout

- `Vault/Tickets/{ticketId}.md` — YAML-Frontmatter (id, created, tags) +
  Markdown-Body (`# Problem` / `# Lösung`, Updates als `## Update <Zeitstempel>`).
  **Die Markdown-Dateien sind die Source of Truth.**
- `Vault/Agent_Index/store.json` — serialisierter `InMemoryEmbeddingStore`;
  enthält nur Embeddings + `ticketId`-Metadatum, kann jederzeit aus den
  Markdown-Dateien neu aufgebaut werden.

## Architektur

`src/main/java/com/gogolinolett/km/`

- `ObsidianKnowledgeManager` — gesamte Fachlogik:
  - `initializeSystem()` — legt Vault-Verzeichnisse an, lädt `store.json`
    (falls vorhanden) oder initialisiert einen leeren Store.
  - `saveNewTicket(id, problem, lösung, tags)` — schreibt die Markdown-Datei
    und indiziert den Body. **Upsert-Semantik**: ein vorhandenes Embedding zur
    selben `ticketId` wird ersetzt, nie dupliziert.
  - `searchKnowledge(query, maxResults)` — Embedding-Suche, löst Treffer über
    das `ticketId`-Metadatum zurück auf die `.md`-Dateien auf und liefert deren
    vollen Inhalt (inkl. Score) als formatierten String.
  - `updateExistingTicket(id, neuesWissen)` — hängt das neue Wissen mit
    Zeitstempel an die Datei an und re-indiziert den kompletten Body
    (Frontmatter wird vor dem Embedden entfernt).
- `Main` — Einstiegspunkt mit zwei Modi:
  - ohne Argumente: Validierungs-Workflow (init → save TEST-001 → search).
  - mit Argumenten: CLI für Agenten/Skripte —
    `save <id> <problem> <lösung> <tag1,tag2>` · `search <query> [maxResults]` ·
    `update <id> <neues Wissen>`. Aufruf z. B.
    `.\knowledge-manager\gradlew.bat -p knowledge-manager run --quiet --args="search 'Thema'"`;
    mehrwortige Argumente innerhalb von `--args` in einfache Anführungszeichen.
    Das CLI ist der einzige unterstützte Schreibweg ins Vault (hält Markdown
    und Index synchron); genutzt vom Projekt-Skill `store-knowledge`
    (`.claude/skills/store-knowledge/SKILL.md` im Repo-Root).

## Abhängigkeiten

- `dev.langchain4j:langchain4j:1.0.0` — EmbeddingStore-API, `InMemoryEmbeddingStore`.
- `dev.langchain4j:langchain4j-embeddings-all-minilm-l6-v2-q:1.0.0-beta5` —
  quantisiertes MiniLM-Modell, läuft lokal via ONNX Runtime (im Jar gebündelt).
- `com.fasterxml.jackson.dataformat:jackson-dataformat-yaml` — Frontmatter-Erzeugung.

Hinweis: Die ONNX-/Native-Access-Warnungen auf Java 24+ sind harmlos; die
Umlaut-Zeichen erscheinen nur in der Windows-Konsole verstümmelt, die Dateien
selbst sind korrektes UTF-8.

Siehe `design.md` für die Begründung der Architekturentscheidungen.
