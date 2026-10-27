import { expect, test } from "@playwright/test";

test("home, offer and product journey", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/City Pharmacy/);
  await expect(page.getByRole("heading", { name: /Flat 15% OFF/i }).first()).toBeVisible();
  await expect(page.getByText("This week's bestsellers")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Diwali Dhamaka/i })).toBeVisible();

  await page.getByRole("link", { name: /Shop Diwali offer/i }).click();
  await expect(page).toHaveURL(/\/offers\/diwali-15/);
  await expect(page.getByRole("heading", { name: /Diwali Dhamaka/i }).first()).toBeVisible();
  await expect(page.getByText(/items with 15% off/i)).toBeVisible();

  const productLink = page.locator('a[href^="/product/"]').first();
  await expect(productLink).toBeVisible();
  await productLink.click();
  await expect(page).toHaveURL(/\/product\//);
  await expect(page.getByRole("button", { name: /add to cart/i })).toBeVisible();
});

test("shop filters and cart", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.getByRole("heading", { name: /All products/i })).toBeVisible();
  await expect(page.getByText(/products/).first()).toBeVisible();

  const firstCard = page.locator("article").first();
  await firstCard.getByRole("button", { name: /^add$/i }).click();
  await expect(page.getByText(/added to cart/i).first()).toBeVisible();

  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: /your cart/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /proceed to checkout/i })).toBeVisible();
});

test("patient enquiry and prescription forms are available", async ({ page }) => {
  await page.goto("/enquiry");
  await expect(page.getByRole("heading", { name: /patient enquiry/i }).first()).toBeVisible();
  await expect(page.getByPlaceholder("Full name")).toBeVisible();
  await expect(page.getByPlaceholder("10-digit mobile")).toBeVisible();

  await page.goto("/prescription");
  await expect(page.getByRole("heading", { name: /upload your prescription/i })).toBeVisible();
  await expect(page.getByText(/attach prescription photo/i)).toBeVisible();
});

test("admin route asks for staff sign-in", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /admin sign in/i })).toBeVisible();
  await expect(page.getByText(/admin access is limited/i)).toBeVisible();
});
