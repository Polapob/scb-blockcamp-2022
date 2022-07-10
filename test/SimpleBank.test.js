const SimpleBank = artifacts.require("SimpleBank");

contract("SimpleBank", () => {
  it("name of currency is dai token", async () => {
    const contract = await SimpleBank.deployed();
    const currency = await contract.bankCurrency;
    assert.equal(currency, "DAI Token", "Bank Currency is DAI Token Only.");
  });
});
