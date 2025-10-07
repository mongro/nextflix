import { test, expect } from "@playwright/test";

test("expanding small modal to big modal works", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("thumbnail").first().click();
  await expect(page.getByTestId("movie-modal")).toBeVisible();

  await page.locator('[aria-label="moreInfo"]').click();
  await expect(page.locator('[data-testid="movie-modal-title"]')).toBeVisible();
});

test("switching to big modal adds query param to url", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("thumbnail").first().click();
  await expect(page.getByTestId("thumbnail")).toBeVisible();

  await page.locator('[aria-label="moreInfo"]').click();

  await expect(page).toHaveURL(/[\?&]id=(movie|tv)-\d+/);
});

test("big modal closes after pressing back button", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("thumbnail").first().click();
  await expect(page.locator('[data-testid="movie-modal"]')).toBeVisible();

  await page.locator('[aria-label="moreInfo"]').click();
  await expect(page.locator('[data-testid="movie-modal-title"]')).toBeVisible();

  await page.goBack();

  await expect(page.getByTestId("thumbnail")).toBeHidden();
  await expect(page).not.toHaveURL(/[\?&]id=(movie|tv)-\d+/);
});
