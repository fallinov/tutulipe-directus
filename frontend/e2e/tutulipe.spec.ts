import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3099'

test.describe('Tutulipe — Navigation et contenu', () => {
  test('accueil affiche le nom du site et les sections', async ({ page }) => {
    await page.goto(BASE)

    // Titre du site dans le hero
    await expect(page.locator('h1')).toContainText('Tutulipe')

    // Section articles récents
    await expect(page.getByRole('heading', { name: 'Dernières actualités' })).toBeVisible()

    // Section produits
    await expect(page.getByRole('heading', { name: 'Nos créations' })).toBeVisible()

    // Section CTA
    await expect(page.getByRole('heading', { name: 'Envie d\'une composition sur mesure' })).toBeVisible()

    await page.screenshot({ path: '../playwright/01-accueil.png', fullPage: true })
  })

  test('page articles liste les 3 articles publiés', async ({ page }) => {
    await page.goto(`${BASE}/articles`)

    await expect(page.locator('h1')).toContainText('Nos articles')

    // 3 articles créés
    await expect(page.getByText('Les fleurs de printemps')).toBeVisible()
    await expect(page.getByText('Comment entretenir vos bouquets')).toBeVisible()
    await expect(page.getByText('Mariage champêtre')).toBeVisible()

    await page.screenshot({ path: '../playwright/02-articles.png', fullPage: true })
  })

  test('page détail article affiche le contenu', async ({ page }) => {
    await page.goto(`${BASE}/articles/fleurs-printemps`)

    await expect(page.locator('h1')).toContainText('Les fleurs de printemps')
    await expect(page.getByText('tulipes, jonquilles et pivoines')).toBeVisible()

    // Bouton retour
    await expect(page.getByText('Tous les articles')).toBeVisible()

    await page.screenshot({ path: '../playwright/03-article-detail.png', fullPage: true })
  })

  test('page produits affiche les 4 produits et le filtre fonctionne', async ({ page }) => {
    await page.goto(`${BASE}/produits`)

    await expect(page.locator('h1')).toContainText('Nos produits')

    // 4 produits visibles
    const main = page.getByRole('main')
    await expect(main.getByText('Bouquet Éternel')).toBeVisible()
    await expect(main.getByText('Orchidée Phalaenopsis')).toBeVisible()
    await expect(main.getByText('Vase artisanal')).toBeVisible()
    await expect(main.getByText('Bouquet du marché')).toBeVisible()

    // Prix affichés
    await expect(main.getByText('65.00 CHF')).toBeVisible()
    await expect(main.getByText('38.50 CHF')).toBeVisible()

    await page.screenshot({ path: '../playwright/04-produits.png', fullPage: true })

    // Attendre l'hydratation Vue
    await page.waitForTimeout(1000)

    // Filtre par catégorie : Plantes
    const plantesBtn = page.getByRole('button', { name: 'Plantes' })
    await plantesBtn.click()
    // Attendre que le filtre soit appliqué (réactivité Vue)
    await page.waitForTimeout(500)
    await expect(main.getByText('Orchidée Phalaenopsis')).toBeVisible()
    // Les produits non-plantes doivent être masqués — vérifier le nombre de cartes
    const cards = main.locator('[data-slot="root"]')
    await expect(cards).toHaveCount(1)

    await page.screenshot({ path: '../playwright/05-produits-filtre-plantes.png', fullPage: true })

    // Retour à Tous
    await page.getByRole('button', { name: 'Tous' }).click()
    await page.waitForTimeout(500)
    await expect(cards).toHaveCount(4)
  })

  test('page détail produit affiche prix et catégorie', async ({ page }) => {
    await page.goto(`${BASE}/produits/bouquet-eternel`)

    await expect(page.locator('h1')).toContainText('Bouquet Éternel')
    await expect(page.getByText('65.00 CHF')).toBeVisible()
    await expect(page.getByText('Bouquets')).toBeVisible()
    await expect(page.getByText('roses, pivoines et eucalyptus')).toBeVisible()

    await page.screenshot({ path: '../playwright/06-produit-detail.png', fullPage: true })
  })

  test('page à propos affiche le contenu', async ({ page }) => {
    await page.goto(`${BASE}/a-propos`)

    await expect(page.locator('h1')).toContainText('À propos')
    await expect(page.getByText('atelier floral fondé en 2020')).toBeVisible()

    await page.screenshot({ path: '../playwright/07-a-propos.png', fullPage: true })
  })

  test('page contact affiche formulaire et coordonnées', async ({ page }) => {
    await page.goto(`${BASE}/contact`)

    await expect(page.locator('h1')).toContainText('Contact')

    // Formulaire
    await expect(page.getByRole('heading', { name: 'Écrivez-nous' })).toBeVisible()
    await expect(page.getByPlaceholder('Votre nom')).toBeVisible()
    await expect(page.getByPlaceholder('votre@email.ch')).toBeVisible()
    await expect(page.getByPlaceholder('Votre message...')).toBeVisible()

    // Coordonnées (scoper au main pour éviter le doublon footer)
    const main = page.getByRole('main')
    await expect(main.getByRole('link', { name: '032 422 00 00' })).toBeVisible()
    await expect(main.getByRole('link', { name: 'info@tutulipe.ch' })).toBeVisible()

    await page.screenshot({ path: '../playwright/08-contact.png', fullPage: true })
  })

  test('header navigation fonctionne sur toutes les pages', async ({ page }) => {
    await page.goto(BASE)

    // Le header est sticky
    const header = page.locator('header')
    await expect(header).toBeVisible()

    // Navigation vers articles
    await page.getByRole('link', { name: 'Articles' }).first().click()
    await expect(page).toHaveURL(`${BASE}/articles`)
    await expect(page.locator('h1')).toContainText('Nos articles')
  })

  test('navigation client-side charge le contenu sans refresh', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('h1')).toContainText('Tutulipe')

    // Naviguer vers Articles via le header
    await page.getByRole('link', { name: 'Articles' }).first().click()
    await expect(page).toHaveURL(`${BASE}/articles`)
    await expect(page.getByText('Les fleurs de printemps')).toBeVisible()

    // Naviguer vers Produits
    await page.getByRole('link', { name: 'Produits' }).first().click()
    await expect(page).toHaveURL(`${BASE}/produits`)
    await expect(page.getByRole('main').getByText('Bouquet Éternel')).toBeVisible()
    await expect(page.getByRole('main').getByText('65.00 CHF')).toBeVisible()

    // Naviguer vers À propos
    await page.getByRole('link', { name: 'À propos' }).first().click()
    await expect(page).toHaveURL(`${BASE}/a-propos`)
    await expect(page.getByText('atelier floral fondé en 2020')).toBeVisible()

    // Naviguer vers Contact
    await page.getByRole('link', { name: 'Contact' }).first().click()
    await expect(page).toHaveURL(`${BASE}/contact`)
    await expect(page.getByPlaceholder('Votre nom')).toBeVisible()
    await expect(page.getByRole('main').getByRole('link', { name: '032 422 00 00' })).toBeVisible()

    // Retour à l'accueil
    await page.getByRole('link', { name: 'Accueil' }).first().click()
    await expect(page).toHaveURL(`${BASE}/`)
    await expect(page.getByRole('heading', { name: 'Dernières actualités' })).toBeVisible()
  })

  test('footer affiche les données du site', async ({ page }) => {
    await page.goto(BASE)

    const footer = page.locator('footer')
    await expect(footer.getByRole('heading', { name: 'Tutulipe' })).toBeVisible()
    await expect(footer.getByRole('link', { name: '032 422 00 00' })).toBeVisible()
    await expect(footer.getByRole('link', { name: 'info@tutulipe.ch' })).toBeVisible()
  })

  test('page 404 pour un slug inexistant', async ({ page }) => {
    const response = await page.goto(`${BASE}/articles/slug-inexistant`)
    expect(response?.status()).toBe(404)
  })
})

test.describe('Tutulipe — Responsive mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('accueil mobile avec captures', async ({ page }) => {
    await page.goto(BASE)

    await expect(page.locator('h1')).toContainText('Tutulipe')

    // Le menu hamburger est visible
    await expect(page.getByRole('button', { name: 'Ouvrir le menu' })).toBeVisible()

    await page.screenshot({ path: '../playwright/09-accueil-mobile.png', fullPage: true })

    // Ouvrir le menu mobile
    await page.getByRole('button', { name: 'Ouvrir le menu' }).click()
    await page.screenshot({ path: '../playwright/10-menu-mobile.png', fullPage: true })
  })
})
