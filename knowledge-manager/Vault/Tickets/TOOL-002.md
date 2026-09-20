---
id: "TOOL-002"
created: "2026-09-20 20:05:47"
tags:
- "gradle"
- "ftbquests"
- "sync"
---

# Problem

Im Spiel mit dem FTB-Quests-Editor geaenderte Quests (z. B. verschobene Quest-Positionen oder der order_index eines Kapitels) sind nach dem naechsten Spielstart wieder auf dem alten Stand, obwohl der Gradle-Task prepareClient config/ftbquests per preserve schuetzt.

# Lösung

Ursache: prepareClient in build.gradle.kts ist ein Gradle-Sync von src/common und src/client in die Instanz. preserve (include config/ftbquests/**, kubejs/, saves/**) schuetzt Zieldateien nur vor dem LOESCHEN, wenn sie in der Quelle fehlen - jede Datei, die im Repo existiert, wird trotzdem ueber die Instanzdatei kopiert. Ist die Repo-Kopie einer Quest-Datei aelter als der Live-Stand der Instanz, macht prepareClient die Editor-Aenderungen rueckgaengig (passiert am 2026-09-20 mit chapters/stone_age.snbt: Layout-Tausch zweier Quests und order_index gingen verloren). Rettung: prepareClient haengt von backupClient ab, das vorher die komplette Instanz nach build/backups/backup-JJJJMMTT-HHmmss kopiert (die letzten 10 bleiben erhalten) - die Datei aus dem Backup VOR dem ersten ueberschreibenden Lauf zurueckkopieren und die Repo-Kopie auf denselben Inhalt bringen. Regel: Quest-Dateien fliessen in beide Richtungen (pullFromMinecraft kopiert config/ftbquests/quests von der Instanz ins Repo, prepareClient vom Repo in die Instanz), deshalb nach Editor-Aenderungen immer erst pullFromMinecraft, dann prepareClient, und bei Hand-Edits an Quest-SNBT nie die Repo-Kopie hinter dem Instanzstand zuruecklassen. Hand-Edits erst auf den aktuellen Instanzstand mergen (FTB schreibt bei jeder Editor-Aenderung alle Kapiteldateien neu), in Repo UND Instanz schreiben und im Spiel /ftbquests reload ausfuehren, bevor weiter editiert wird. Weitere Fakten zum Sync: gameDir, kubejs und .probe im Repo-Root sind NTFS-Junctions in die Prism-Instanz; pushToMinecraft kopiert nur kubejs server_scripts, data, client_scripts und assets; die Zeitstempel in logs/latest.log sind Lokalzeit; ein Spielneustart legt latest.log neu an, ein vorher gestartetes tail -f sieht danach nichts mehr. Moegliche Alternative (nicht umgesetzt, Entscheidung des Nutzers offen): config/ftbquests aus dem prepareClient-Kopieren ausnehmen, wenn die Instanz die Quelle der Wahrheit fuer Quests sein soll - contra: eine frisch aufgesetzte Instanz bekaeme dann keine Quests mehr.
