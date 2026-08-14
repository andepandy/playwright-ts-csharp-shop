using Microsoft.Playwright;

namespace ShopUi.Tests.Pages;

public sealed class ProductsPage
{
    private readonly IPage _page;

    public ProductsPage(IPage page)
    {
        _page = page;
    }

    public ILocator Heading => _page.Locator(".title.text-center");
    public ILocator ProductNames => _page.Locator(".productinfo p");

    public async Task SearchAsync(string term)
    {
        await _page.Locator("#search_product").FillAsync(term);
        await _page.Locator("#submit_search").ClickAsync();
    }
}
