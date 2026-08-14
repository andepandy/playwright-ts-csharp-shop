using Microsoft.Playwright;

namespace ShopUi.Tests.Pages;

public sealed class HomePage
{
    private readonly IPage _page;

    public HomePage(IPage page)
    {
        _page = page;
    }

    public async Task GotoAsync()
    {
        await _page.GotoAsync("https://www.automationexercise.com/");
    }

    public async Task<ProductsPage> OpenProductsAsync()
    {
        await _page.Locator("a[href='/products']").First.ClickAsync(new() { Force = true });
        return new ProductsPage(_page);
    }

    public async Task<LoginPage> OpenLoginAsync()
    {
        await _page.Locator("a[href='/login']").First.ClickAsync(new() { Force = true });
        return new LoginPage(_page);
    }
}
