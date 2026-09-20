# Design-Entscheidungen — Knowledge Manager

## CLI in `Main` statt eigener CLI-Klasse oder Direktschreiben durch Agenten

**Entscheidung**: `Main` dispatcht auf Argumente (`save`/`search`/`update`,
ohne Argumente Demo-Workflow). Agenten (siehe Skill `store-knowledge`)
schreiben ausschließlich über dieses CLI ins Vault.

### Alternativen
| Ansatz | Pros | Cons |
|--------|------|------|
| CLI in `Main` (gewählt) | Ein Einstiegspunkt, kein zweiter `mainClass`-Task, Demo bleibt abwärtskompatibel | `Main` trägt zwei Rollen (Demo + CLI) |
| Separate `KnowledgeCli`-Klasse | Saubere Trennung | Zweiter Gradle-Task/`mainClass`-Umschaltung nötig — mehr Build-Komplexität für drei Befehle |
| Agenten schreiben Markdown direkt | Kein JVM-Start (~10 s) pro Ablage | Vektor-Index läuft garantiert auseinander, da nur der Java-Code Embeddings erzeugt; Suche wird lückenhaft — inakzeptabel |

## Eigenes Wrapper-Setup statt `gradle init` / Subprojekt

**Entscheidung**: Eigenständiges Gradle-Projekt im Unterordner
`knowledge-manager/` mit kopiertem Gradle-9.2-Wrapper aus BattleOfKnights.

### Alternativen
| Ansatz | Pros | Cons |
|--------|------|------|
| `gradle init` im Repo-Root | Entspricht wörtlich der Aufgabe | Kollidiert destruktiv mit dem bestehenden BattleOfKnights-Build; Gradle war zudem nicht auf dem PATH |
| Gradle-Subprojekt von BattleOfKnights | Ein Build für alles | Koppelt ein Wissens-Tool an ein LWJGL-Spiel; keinerlei fachlicher Zusammenhang |
| Eigenständiges Projekt im Unterordner (gewählt) | Selbstständig lauffähig und verschiebbar; Spiel-Build bleibt unberührt | Liegt vorerst im fremden Git-Repo (untracked, leicht zu verschieben) |

## InMemoryEmbeddingStore + JSON-Persistenz statt Vektor-Datenbank

**Entscheidung**: LangChain4j `InMemoryEmbeddingStore`, serialisiert nach
`Vault/Agent_Index/store.json` (`serializeToFile`/`fromFile`).

### Alternativen
| Ansatz | Pros | Cons |
|--------|------|------|
| InMemoryEmbeddingStore + JSON (gewählt) | Null Infrastruktur, eine Datei, menschenlesbar, im Vault versionierbar | Lädt alles in den Speicher; lineare Suche — für tausende Tickets völlig ausreichend |
| Eingebettete Vektor-DB (z. B. Chroma/Qdrant lokal) | Skaliert, echte ANN-Suche | Externer Prozess bzw. Docker; für ein Einzelnutzer-Vault überdimensioniert |

## Markdown-Dateien als Source of Truth

**Entscheidung**: Der Vektor-Store speichert nur Embeddings + `ticketId`;
`searchKnowledge` liest die Inhalte immer frisch aus den `.md`-Dateien.

### Alternativen
| Ansatz | Pros | Cons |
|--------|------|------|
| Nur ID im Store, Inhalt aus Datei (gewählt) | Kein Staleness-Problem bei manuellen Edits im Obsidian-Vault; Index jederzeit neu aufbaubar | Ein Datei-Read pro Treffer (vernachlässigbar) |
| Volltext im Store duplizieren | Suche ohne Datei-IO | Zwei Wahrheiten, die auseinanderlaufen, sobald jemand die Notiz in Obsidian editiert |

## Upsert-Semantik beim Indizieren

**Entscheidung**: `saveNewTicket` und `updateExistingTicket` entfernen vor dem
Hinzufügen alle Embeddings zur `ticketId` (`removeAll(metadataKey(...).isEqualTo(...))`).

### Alternativen
| Ansatz | Pros | Cons |
|--------|------|------|
| Remove-then-add (gewählt) | Idempotent — wiederholte Läufe/Updates erzeugen keine Duplikate im Index | Minimal mehr Arbeit pro Save |
| Nur add | Einfachster Code | Jeder erneute Lauf dupliziert Einträge; Suchergebnisse degenerieren |

## Frontmatter vor dem Embedden entfernen

**Decision**: Es wird nur der Markdown-Body embedded, nie das YAML-Frontmatter.

### Alternativen
| Ansatz | Pros | Cons |
|--------|------|------|
| Nur Body embedden (gewählt) | Embedding repräsentiert den fachlichen Inhalt | Tags fließen nicht in die Ähnlichkeit ein (bewusst: Tags sind Metadaten, keine Semantik) |
| Ganze Datei embedden | Trivial | ID/Datum/YAML-Syntax verwässern den Vektor und verschlechtern die Trefferqualität |
