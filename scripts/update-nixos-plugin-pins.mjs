#!/usr/bin/env node
/**
 * Updates the pinned plugin versions and sha256 (SRI) hashes in
 * docs/deployment-nixos.md from a GitHub release of this repository.
 *
 * Usage:
 *   node scripts/update-nixos-plugin-pins.mjs                 # pin to the latest release
 *   node scripts/update-nixos-plugin-pins.mjs --tag v0.6.0    # pin to a specific release
 *   node scripts/update-nixos-plugin-pins.mjs --check         # exit 1 if the doc is stale
 *   node scripts/update-nixos-plugin-pins.mjs --release-json ./release.json  # offline/testing
 *
 * The sha256 values are taken from the `digest` field the GitHub API reports
 * per release asset. If a digest is missing (very old releases), the asset is
 * downloaded and hashed locally. Set GITHUB_TOKEN to avoid API rate limits.
 */

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const REPO = 'helpwave/id.helpwave.de'
const THEME_JAR = 'keycloak-theme-for-kc-26.2-and-above.jar'
const SPI_ARTIFACTS = ['helpwave-captcha', 'helpwave-picture', 'helpwave-policy-acceptance']

const DOC_PATH = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../docs/deployment-nixos.md'
)

function fail(message) {
    console.error(`✖ ${message}`)
    process.exit(1)
}

function parseArgs(argv) {
    const args = { tag: null, check: false, releaseJson: null }
    for (let i = 0; i < argv.length; i++) {
        switch (argv[i]) {
            case '--tag':
                args.tag = argv[++i]
                break
            case '--check':
                args.check = true
                break
            case '--release-json':
                args.releaseJson = argv[++i]
                break
            default:
                fail(`Unknown argument: ${argv[i]}`)
        }
    }
    return args
}

async function githubApi(url) {
    const headers = { 'Accept': 'application/vnd.github+json', 'User-Agent': REPO }
    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
    }
    const response = await fetch(url, { headers })
    if (!response.ok) {
        fail(`GitHub API request failed: ${response.status} ${response.statusText} (${url})`)
    }
    return response.json()
}

async function fetchRelease({ tag, releaseJson }) {
    if (releaseJson) {
        return JSON.parse(fs.readFileSync(releaseJson, 'utf8'))
    }
    const endpoint = tag
        ? `https://api.github.com/repos/${REPO}/releases/tags/${tag.startsWith('v') ? tag : `v${tag}`}`
        : `https://api.github.com/repos/${REPO}/releases/latest`
    return githubApi(endpoint)
}

/** GitHub reports digests as `sha256:<hex>`; Nix fetchurl wants SRI `sha256-<base64>`. */
function digestToSri(digest) {
    const match = /^sha256:([0-9a-f]{64})$/.exec(digest ?? '')
    if (!match) return null
    return `sha256-${Buffer.from(match[1], 'hex').toString('base64')}`
}

async function downloadAndHash(asset) {
    console.log(`  no API digest for ${asset.name}, downloading to hash locally …`)
    const response = await fetch(asset.browser_download_url, { redirect: 'follow' })
    if (!response.ok) {
        fail(`Download failed: ${response.status} ${response.statusText} (${asset.browser_download_url})`)
    }
    const bytes = Buffer.from(await response.arrayBuffer())
    return `sha256-${crypto.createHash('sha256').update(bytes).digest('base64')}`
}

async function assetSri(asset) {
    return digestToSri(asset.digest) ?? await downloadAndHash(asset)
}

function findAsset(release, predicate, description) {
    const asset = (release.assets ?? []).find(predicate)
    if (!asset) fail(`Release ${release.tag_name} has no asset matching: ${description}`)
    return asset
}

/** Replaces exactly one occurrence; fails loudly if the doc anchor shape changed. */
function replaceOnce(content, pattern, replacement, description) {
    const matches = content.match(new RegExp(pattern, 'g')) ?? []
    if (matches.length !== 1) {
        fail(
            `Expected exactly 1 match for ${description} in ${path.relative(process.cwd(), DOC_PATH)}, ` +
            `found ${matches.length}. Did the pin block in the doc change shape?`
        )
    }
    return content.replace(pattern, replacement)
}

async function main() {
    const args = parseArgs(process.argv.slice(2))
    const release = await fetchRelease(args)

    const themeVersion = release.tag_name.replace(/^v/, '')

    const themeAsset = findAsset(release, (a) => a.name === THEME_JAR, THEME_JAR)

    const spiAssets = Object.fromEntries(SPI_ARTIFACTS.map((artifact) => {
        const pattern = new RegExp(`^${artifact}-(\\d+\\.\\d+\\.\\d+(?:-[\\w.]+)?)\\.jar$`)
        const asset = findAsset(release, (a) => pattern.test(a.name), `${artifact}-<version>.jar`)
        return [artifact, { asset, version: pattern.exec(asset.name)[1] }]
    }))

    const spiVersions = new Set(Object.values(spiAssets).map(({ version }) => version))
    if (spiVersions.size !== 1) {
        fail(`SPI jars in release ${release.tag_name} disagree on their version: ${[...spiVersions].join(', ')}`)
    }
    const spiVersion = [...spiVersions][0]

    console.log(`Release ${release.tag_name}: themeVersion=${themeVersion}, spiVersion=${spiVersion}`)

    const hashes = {
        themePlugin: await assetSri(themeAsset),
        captchaSPI: await assetSri(spiAssets['helpwave-captcha'].asset),
        pictureSPI: await assetSri(spiAssets['helpwave-picture'].asset),
        policySPI: await assetSri(spiAssets['helpwave-policy-acceptance'].asset),
    }
    for (const [binding, sri] of Object.entries(hashes)) {
        console.log(`  ${binding.padEnd(12)} ${sri}`)
    }

    const original = fs.readFileSync(DOC_PATH, 'utf8')
    let content = original

    content = replaceOnce(
        content,
        /themeVersion = "[^"]+";/,
        `themeVersion = "${themeVersion}";`,
        'themeVersion pin'
    )
    content = replaceOnce(
        content,
        /spiVersion = "[^"]+";/,
        `spiVersion = "${spiVersion}";`,
        'spiVersion pin'
    )

    // Each binding is anchored to its jar file name so the hashes can never be
    // assigned to the wrong plugin, no matter how the doc is reordered.
    const bindingAnchors = {
        themePlugin: THEME_JAR,
        captchaSPI: 'helpwave-captcha-${spiVersion}.jar',
        pictureSPI: 'helpwave-picture-${spiVersion}.jar',
        policySPI: 'helpwave-policy-acceptance-${spiVersion}.jar',
    }
    for (const [binding, fileAnchor] of Object.entries(bindingAnchors)) {
        const escapedAnchor = fileAnchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        content = replaceOnce(
            content,
            new RegExp(`(release themeVersion "${escapedAnchor}"\\s*\\n\\s*")sha256-[A-Za-z0-9+/=]+(")`),
            `$1${hashes[binding]}$2`,
            `${binding} sha256`
        )
    }

    if (content === original) {
        console.log(`✔ ${path.relative(process.cwd(), DOC_PATH)} is already pinned to ${release.tag_name}`)
        return
    }

    if (args.check) {
        fail(`docs are stale: pins do not match release ${release.tag_name}. Run: npm run update-nix-pins`)
    }

    fs.writeFileSync(DOC_PATH, content)
    console.log(`✔ Updated ${path.relative(process.cwd(), DOC_PATH)} to ${release.tag_name}`)
}

await main()
