import { test, expect } from "@playwright/test";

test("search", async ({ page }) => {
  await page.goto("/de/shows");

  await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
  await page.getByRole("button", { name: "Search" }).click();
  await expect(
    page.getByRole("textbox", { name: "Search by Title" })
  ).toBeVisible();
  await page.getByRole("textbox", { name: "Search by Title" }).fill("harry");
  await expect(
    page.getByRole("textbox", { name: "Search by Title" })
  ).toHaveValue("harry");
  await expect(page.getByRole("button", { name: "Clear" })).toBeVisible();
  await expect(page).toHaveURL("/de/search?q=harry");
  await page.getByRole("button", { name: "Clear" }).click();
  await expect(
    page.getByRole("textbox", { name: "Search by Title" })
  ).toHaveValue("");
  await expect(page).toHaveURL("/de/shows");
  await expect(page.getByRole("button", { name: "Clear" })).not.toBeVisible();
});
