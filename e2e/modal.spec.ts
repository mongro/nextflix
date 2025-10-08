import { test, expect } from "@playwright/test";

test("expanding small modal to big modal", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("thumbnail").first().click();
  await expect(page.getByTestId("movie-modal")).toBeVisible();

  await page.locator('[aria-label="moreInfo"]').click();
  await expect(page.locator('[data-testid="movie-modal-title"]')).toBeVisible();
  await expect(page).toHaveURL(/[\?&]id=(movie|tv)-\d+/);
});

test("closing modal after pressing back button", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("thumbnail").first().click();
  await expect(page.locator('[data-testid="movie-modal"]')).toBeVisible();

  await page.locator('[aria-label="moreInfo"]').click();
  await expect(page.locator('[data-testid="movie-modal-title"]')).toBeVisible();

  await page.goBack();

  await expect(page.getByTestId("movie-modal")).toBeHidden();
  await expect(page).not.toHaveURL(/[\?&]id=(movie|tv)-\d+/);
});
