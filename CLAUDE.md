# Amarena

Minecraft-Modpack-Repo: KubeJS-Skripte und Mod-Konfiguration (u. a. FTB Quests)
unter `src/`, per Gradle-Tasks (`build.gradle.kts`) mit der Minecraft-Instanz
synchronisiert.

## Wissensdatenbank (PFLICHT-Workflow)

Erkenntnisse, Bugursachen und Design-Entscheidungen leben in der
Obsidian-Wissensdatenbank `knowledge-manager/Vault`, nicht in
Markdown-Dateien des Repos.

1. **Vor jeder Aufgabe** die relevanten Tickets einlesen — Suche mit 2–3
   Formulierungen zum Thema:

   ```powershell
   .\knowledge-manager\gradlew.bat -p knowledge-manager run --quiet --args="search 'Suchbegriffe' 3"
   ```

2. **Nach der Arbeit** neue Erkenntnisse (überraschende Ursachen, Workarounds,
   Design-Entscheidungen inkl. Warum und verworfener Alternativen) über den
   `store-knowledge`-Skill ablegen: erst suchen, Treffer per `update`
   ergänzen, sonst `save`. Niemals Ticket-Dateien von Hand anlegen.
3. CLAUDE.md bleibt die reine Architektur-Landkarte — Begründungen,
   Alternativen und Lessons Learned gehören ins Vault.

### Dokumentations-Standards für Design-Entscheidungen

Eine Entscheidung ist dokumentationspflichtig, wenn mindestens eines zutrifft:

- es wurde zwischen zwei oder mehr sinnvollen Ansätzen gewählt
- die Wahl beeinflusst Architektur oder zukünftige Erweiterbarkeit
- ein späterer Leser könnte sich fragen, warum es so gemacht wurde

Jedes Design-Entscheidungs-Ticket muss enthalten: die getroffene Entscheidung,
die erwogenen Alternativen, Pro und Contra je Alternative sowie die Begründung
der Wahl — eine Entscheidung ohne Begründung ist beim nächsten abweichenden
Fall wertlos. Naheliegende, aber verworfene Ansätze kurz mit Grund der
Verwerfung nennen.
