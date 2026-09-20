package com.gogolinolett.km;

import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.embedding.onnx.allminilml6v2q.AllMiniLmL6V2QuantizedEmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static dev.langchain4j.store.embedding.filter.MetadataFilterBuilder.metadataKey;

/**
 * Hybrid knowledge base: human-readable Obsidian Markdown notes in Vault/Tickets
 * plus a locally persisted vector index in Vault/Agent_Index/store.json.
 * The Markdown files are the source of truth; the vector store only holds
 * embeddings and the ticketId needed to find the file again.
 */
public class ObsidianKnowledgeManager {

    private static final Path VAULT_DIR = Path.of("Vault");
    private static final Path TICKETS_DIR = VAULT_DIR.resolve("Tickets");
    private static final Path INDEX_DIR = VAULT_DIR.resolve("Agent_Index");
    private static final Path STORE_FILE = INDEX_DIR.resolve("store.json");
    private static final String METADATA_TICKET_ID = "ticketId";
    private static final DateTimeFormatter TIMESTAMP =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final YAMLMapper yamlMapper = new YAMLMapper();
    private EmbeddingModel embeddingModel;
    private InMemoryEmbeddingStore<TextSegment> store;

    public void initializeSystem() throws IOException {
        Files.createDirectories(TICKETS_DIR);
        Files.createDirectories(INDEX_DIR);
        embeddingModel = new AllMiniLmL6V2QuantizedEmbeddingModel();
        if (Files.exists(STORE_FILE)) {
            store = InMemoryEmbeddingStore.fromFile(STORE_FILE);
            System.out.println("Vektor-Store geladen: " + STORE_FILE);
        } else {
            store = new InMemoryEmbeddingStore<>();
            System.out.println("Neuer Vektor-Store initialisiert.");
        }
    }

    public void saveNewTicket(String ticketId, String problem, String solution,
                              List<String> tags) throws IOException {
        Map<String, Object> frontmatter = new LinkedHashMap<>();
        frontmatter.put("id", ticketId);
        frontmatter.put("created", LocalDateTime.now().format(TIMESTAMP));
        frontmatter.put("tags", tags);
        // YAMLMapper already emits the leading "---" document start marker.
        String yaml = yamlMapper.writeValueAsString(frontmatter);

        String body = "# Problem\n\n" + problem + "\n\n# Lösung\n\n" + solution + "\n";
        Files.writeString(ticketFile(ticketId), yaml + "---\n\n" + body, StandardCharsets.UTF_8);

        reindexTicket(ticketId, body);
        System.out.println("Ticket gespeichert: " + ticketFile(ticketId));
    }

    public String searchKnowledge(String query, int maxResults) throws IOException {
        Embedding queryEmbedding = embeddingModel.embed(query).content();
        EmbeddingSearchResult<TextSegment> result = store.search(EmbeddingSearchRequest.builder()
                .queryEmbedding(queryEmbedding)
                .maxResults(maxResults)
                .build());

        StringBuilder sb = new StringBuilder();
        for (EmbeddingMatch<TextSegment> match : result.matches()) {
            String ticketId = match.embedded().metadata().getString(METADATA_TICKET_ID);
            Path file = ticketFile(ticketId);
            if (!Files.exists(file)) {
                continue; // index entry whose note was deleted outside this tool
            }
            sb.append(String.format("=== %s (Score: %.4f) ===%n", ticketId, match.score()))
              .append(Files.readString(file, StandardCharsets.UTF_8))
              .append(System.lineSeparator());
        }
        return sb.isEmpty() ? "Keine passenden Einträge gefunden." : sb.toString();
    }

    public void updateExistingTicket(String ticketId, String newKnowledge) throws IOException {
        Path file = ticketFile(ticketId);
        if (!Files.exists(file)) {
            throw new IOException("Ticket existiert nicht: " + file);
        }
        String updated = Files.readString(file, StandardCharsets.UTF_8)
                + "\n## Update " + LocalDateTime.now().format(TIMESTAMP) + "\n\n"
                + newKnowledge + "\n";
        Files.writeString(file, updated, StandardCharsets.UTF_8);

        reindexTicket(ticketId, stripFrontmatter(updated));
        System.out.println("Ticket aktualisiert: " + file);
    }

    /** Replaces any existing embedding for the ticket, then persists the store. */
    private void reindexTicket(String ticketId, String text) {
        store.removeAll(metadataKey(METADATA_TICKET_ID).isEqualTo(ticketId));
        TextSegment segment = TextSegment.from(text, Metadata.from(METADATA_TICKET_ID, ticketId));
        store.add(embeddingModel.embed(segment).content(), segment);
        store.serializeToFile(STORE_FILE);
    }

    private static String stripFrontmatter(String content) {
        if (content.startsWith("---")) {
            int end = content.indexOf("---", 3);
            if (end >= 0) {
                return content.substring(end + 3).stripLeading();
            }
        }
        return content;
    }

    private static Path ticketFile(String ticketId) {
        return TICKETS_DIR.resolve(ticketId + ".md");
    }
}
