---
id: "TOOL-001"
created: "2026-09-20 19:53:35"
tags:
- "git"
- "gitignore"
- "tooling"
---

# Problem

Neue Datei oder neuer Ordner im Repo-Root von Amarena (z. B. CLAUDE.md, knowledge-manager, .claude) erscheint in git status nicht als untracked und laesst sich nicht adden oder committen, obwohl sie existiert. git check-ignore -v auf den Pfad nennt als Ursache .gitignore Zeile 1 mit dem Muster /*.

# Lösung

Die Root-.gitignore von Amarena ist eine Whitelist: Zeile 1 mit dem Muster /* ignoriert saemtliche Top-Level-Eintraege, getrackt wird nur, was danach explizit per Negationsmuster freigegeben ist (!/build.gradle.kts, !/settings.gradle.kts, !/gradlew, !/gradle, !/src usw.). Fix: jeden neuen Top-Level-Pfad als eigene Zeile !/name in die Whitelist eintragen. Fuer Teilfreigaben das bestehende Muster verwenden (wie !/src gefolgt von /src/*/local-files): erst den Ordner freigeben, dann seinen Inhalt wieder ignorieren, dann den gewuenschten Unterordner freigeben - fuer Claude-Skills also die drei Zeilen !/.claude, /.claude/* und !/.claude/skills in dieser Reihenfolge, denn spaetere Regeln ueberschreiben fruehere. Verworfene Alternative: .claude komplett freigeben - einfacher, wuerde aber nutzerlokale Dateien wie settings.local.json mit einchecken. Diagnose immer mit git check-ignore -v plus Pfad statt zu raten; das Kommando nennt die verantwortliche Regel samt Zeilennummer. Beim Einrichten der Wissensdatenbank am 2026-09-20 wurden so CLAUDE.md, knowledge-manager und .claude/skills freigegeben; das Setup-Skript setup-store-knowledge behandelt Whitelist-gitignores nicht selbst.
