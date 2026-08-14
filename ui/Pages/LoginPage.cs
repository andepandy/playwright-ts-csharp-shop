using Microsoft.Playwright;

namespace ShopUi.Tests.Pages;

public sealed class LoginPage
{
    private readonly IPage _page;

    public LoginPage(IPage page)
    {
        _page = page;
    }

    public ILocator AccountInfoHeading => _page.Locator("text=Enter Account Information");
    public ILocator ExistingEmailError => _page.Locator("text=Email Address already exist");
    public ILocator AccountCreated => _page.Locator("h2[data-qa='account-created']");

    public async Task StartSignupAsync(string name, string email)
    {
        await _page.Locator("input[data-qa='signup-name']").FillAsync(name);
        await _page.Locator("input[data-qa='signup-email']").FillAsync(email);
        await _page.Locator("button[data-qa='signup-button']").ClickAsync();
    }

    public async Task CompleteRequiredFieldsAsync(string password)
    {
        await _page.Locator("input[data-qa='password']").FillAsync(password);
        await _page.Locator("input[data-qa='first_name']").FillAsync("Yande");
        await _page.Locator("input[data-qa='last_name']").FillAsync("Tester");
        await _page.Locator("input[data-qa='address']").FillAsync("10 Test Street");
        await _page.Locator("input[data-qa='state']").FillAsync("London");
        await _page.Locator("input[data-qa='city']").FillAsync("London");
        await _page.Locator("input[data-qa='zipcode']").FillAsync("SW1A 1AA");
        await _page.Locator("input[data-qa='mobile_number']").FillAsync("07700900000");
        await _page.Locator("button[data-qa='create-account']").ClickAsync();
    }
}
