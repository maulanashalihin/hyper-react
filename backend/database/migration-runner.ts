import * as path from 'path'
import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'
import { Migrator, FileMigrationProvider } from 'kysely'
import { db } from './index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, '..', 'migrations'),
  }),
})

export async function runMigrations(): Promise<void> {
  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`  ✓ ${it.migrationName}`)
    } else if (it.status === 'Error') {
      console.error(`  ✗ ${it.migrationName}`)
    }
  })

  if (error) {
    console.error('Migration failed:', error)
    throw error
  }

  if (!results?.length) {
    console.log('No pending migrations')
  } else {
    console.log(`Completed ${results.length} migration(s)`)
  }
}

export async function revertLastMigration(): Promise<void> {
  const { error, results } = await migrator.migrateDown()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`  ✓ Reverted: ${it.migrationName}`)
    } else if (it.status === 'Error') {
      console.error(`  ✗ Failed to revert: ${it.migrationName}`)
    }
  })

  if (error) {
    console.error('Revert failed:', error)
    throw error
  }
}

const isDirectRun = process.argv[1]?.endsWith('migration-runner.ts')
if (isDirectRun) {
  const command = process.argv[2]
  if (command === 'revert') {
    revertLastMigration().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
  } else {
    runMigrations().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
  }
}
