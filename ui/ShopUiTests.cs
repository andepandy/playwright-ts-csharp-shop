using Microsoft.Playwright.NUnit;
using NUnit.Framework;
using ShopUi.Tests.Pages;
using static Microsoft.Playwright.Assertions;

namespace ShopUi.Tests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class ShopUiTests : PageTest
{
    private async Task<HomePage> OpenShopAsync()
    {
        var home = new HomePage(Page);
        await home.GotoAsync();
        return home;
    }

    [Test]
    public async Task ProductsPageListsShopItems()
    {
        var products = await (await OpenShopAsync()).OpenProductsAsync();
        await Expect(products.Heading).ToContainTextAsync("All Products");
        await Expect(products.ProductNames.First).ToBeVisibleAsync();
        Assert.That(await products.ProductNames.CountAsync(), Is.GreaterThan(5));
    }

    [Test]
    public async Task SearchingForDressReturnsDressProducts()
    {
        var products = await (await OpenShopAsync()).OpenProductsAsync();
        await products.SearchAsync("Dress");
        await Expect(products.Heading).ToContainTextAsync("Searched Products");
        var names = await products.ProductNames.AllTextContentsAsync();
        Assert.That(names.Any(name => name.Contains("Dress", StringComparison.OrdinalIgnoreCase)), Is.True);
    }

    [Test]
    public async Task CreatingAnAccountWithAUniqueEmailSucceeds()
    {
        var login = await (await OpenShopAsync()).OpenLoginAsync();
        var email = $"e2e.{Guid.NewGuid():N}@yandetesting.com";
        await login.StartSignupAsync("Yande Tester", email);
        await Expect(login.AccountInfoHeading).ToBeVisibleAsync();
        await login.CompleteRequiredFieldsAsync("TestPass123!");
        await Expect(login.AccountCreated).ToContainTextAsync("Account Created");
    }

    [Test]
    public async Task CreatingAnAccountWithAnExistingEmailIsRejected()
    {
        var email = $"e2e.{Guid.NewGuid():N}@yandetesting.com";
        var firstVisit = await (await OpenShopAsync()).OpenLoginAsync();
        await firstVisit.StartSignupAsync("Yande Tester", email);
        await firstVisit.CompleteRequiredFieldsAsync("TestPass123!");
        await Expect(firstVisit.AccountCreated).ToBeVisibleAsync();

        await Page.Locator("a[data-qa='continue-button']").ClickAsync(new() { Force = true });
        await Page.Locator("a[href='/logout']").ClickAsync(new() { Force = true });

        var secondVisit = await (await OpenShopAsync()).OpenLoginAsync();
        await secondVisit.StartSignupAsync("Yande Tester", email);
        await Expect(secondVisit.ExistingEmailError).ToBeVisibleAsync();
    }
}
