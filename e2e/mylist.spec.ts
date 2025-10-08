import { test, expect } from "@playwright/test";

test("adds movie to personal list", async ({ page }) => {
  await page.goto("/de/shows");
  const thumbnail = page.getByTestId("thumbnail").first();
  const title = await thumbnail.getAttribute("data-title");
  await thumbnail.hover();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "addToMyList" })
  ).toBeVisible();
  await dialog.getByRole("button", { name: "addToMyList" }).click();
  await expect(
    dialog.getByRole("button", { name: "removeFromMyList" })
  ).toBeVisible();
  await dialog.press("Escape");
  await expect(dialog).not.toBeVisible();
  await page.goto("/de/my-list");
  await expect(
    page.getByTestId("thumbnail").and(page.locator(`[data-title="${title}"]`))
  ).toBeVisible();
});

test("removes movie from personal list", async ({ page }) => {
  await page.goto("/de/shows");
  const thumbnail = page.getByTestId("thumbnail").first();
  const title = await thumbnail.getAttribute("data-title");
  await thumbnail.hover();
  let dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "addToMyList" })
  ).toBeVisible();
  await dialog.getByRole("button", { name: "addToMyList" }).click();
  await expect(
    dialog.getByRole("button", { name: "removeFromMyList" })
  ).toBeVisible();
  await dialog.press("Escape");
  await page.goto("/de/my-list");
  await page
    .getByTestId("thumbnail")
    .and(page.locator(`[data-title="${title}"]`))
    .hover();
  dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("button", { name: "removeFromMyList" })
  ).toBeVisible();
  await dialog.getByRole("button", { name: "removeFromMyList" }).click();
  // closes dialog after removing from my list
  await expect(dialog).not.toBeVisible();

  await expect(page.locator(`[data-title="${title}"]`)).not.toBeVisible();
});
