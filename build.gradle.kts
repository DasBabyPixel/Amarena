import java.nio.file.StandardOpenOption
import java.text.SimpleDateFormat
import java.util.*
import kotlin.io.path.createDirectories
import kotlin.io.path.outputStream

val common = "common"
val client = "client"
val server = "server"

val dirs = setOf(common, client, server)
val roots = dirs.groupBy({ it }, { fileTree("src/$it") }).mapValues { it.value.single() }

val prepareTasks = roots.mapValues {
    tasks.register<PrepareDirectory>("${it.key}PrepareDirectory") {
        this.sourceSet.set(it.value.dir)
    }
}

abstract class BackupClient : DefaultTask() {
    @get:OutputDirectory
    abstract val targetDirectory: DirectoryProperty

    @get:InputDirectory
    @get:Option(option = "directory", description = "Input directory for backup")
    abstract val directory: DirectoryProperty

    @get:Inject
    abstract val fs: FileSystemOperations

    @get:Input
    abstract val maxBackups: Property<Int>

    init {
        targetDirectory.convention(project.layout.buildDirectory.dir("backups"))
        maxBackups.convention(10)

        outputs.upToDateWhen { false }
    }

    @TaskAction
    fun run() {
        val timestamp = SimpleDateFormat("yyyyMMdd-HHmmss").format(Date())
        val backupDir = targetDirectory.dir("backup-$timestamp")
        val limit = maxBackups.get()
        fs.copy {
            from(directory)
            into(backupDir)
        }

        val backups = targetDirectory.asFile.get().listFiles { f -> f.isDirectory && f.name.startsWith("backup-") }
            ?.sortedByDescending { it.lastModified() } ?: emptyList()

        if (backups.size > limit) {
            val toDelete = backups.drop(limit)
            toDelete.forEach { dir ->
                dir.deleteRecursively()
                logger.lifecycle("Deleted old backup: $dir")
            }
        }
    }
}

abstract class PrepareClient : Sync() {
    @get:Internal
    @get:Option(option = "directory", description = "Destination directory for prepareClient")
    abstract val directory: DirectoryProperty

    init {
        into(directory)
        outputs.upToDateWhen { false }
        preserve {
            include(".vscode/**")
            include(".probe/**")
            include("config/ftbquests")
        }
    }
}

abstract class PrepareDirectory : DefaultTask() {
    @get:Internal
    abstract val sourceSet: DirectoryProperty

    @get:Optional
    @get:InputDirectory
    abstract val filesDirectory: DirectoryProperty

    @get:Optional
    @get:InputDirectory
    abstract val localFilesDirectory: DirectoryProperty

    @get:Optional
    @get:InputDirectory
    abstract val devFilesDirectory: DirectoryProperty

    @get:OutputDirectory
    abstract val output: DirectoryProperty

    @get:Inject
    abstract val fs: FileSystemOperations

    init {
        filesDirectory.convention(sourceSet.map { it.dir("files").apply { project.mkdir(this) } })
        devFilesDirectory.convention(sourceSet.map { it.dir("dev-files").apply { project.mkdir(this) } })
        localFilesDirectory.convention(sourceSet.map { it.dir("local-files").apply { project.mkdir(this) } })
        output.convention(project.layout.dir(project.provider { temporaryDir }))
    }

    @TaskAction
    fun run() {
        fs.delete {
            this.delete(output)
        }
        val dstDir = output.get().asFile
        fun copy(src: DirectoryProperty) {
            src.get().asFileTree.visit {
                val dst = dstDir.resolve(this.relativePath.pathString).toPath()
                if (file.isDirectory) {
                    dst.createDirectories()
                } else {
                    try {
                        file.inputStream().buffered().use { input ->
                            dst.parent.createDirectories()
                            dst.outputStream(StandardOpenOption.CREATE, StandardOpenOption.APPEND).buffered().use {
                                input.copyTo(it)
                            }
                        }
                    } catch (t: Throwable) {
                        t.printStackTrace()
                    }
                }
            }
        }
        copy(filesDirectory)
        copy(devFilesDirectory)
        copy(localFilesDirectory)
    }
}

val backup = tasks.register<BackupClient>("backupClient")

tasks.register<PrepareClient>("prepareClient") {
    dependsOn(backup)
    backup.get().directory.set(directory)

    from(prepareTasks[common])
    from(prepareTasks[client])
}
