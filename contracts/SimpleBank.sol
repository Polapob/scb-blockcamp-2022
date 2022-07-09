pragma solidity >=0.4.22 <0.9.0;

// SPDX-License-Identifier: MIT

interface DaiCoin {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint8);

    function totalSupply() external view returns (uint256);

    function balanceOf(address _owner) external view returns (uint256 balance);

    function transfer(address _to, uint256 _value)
        external
        returns (bool success);

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool success);

    function approve(address _spender, uint256 _value)
        external
        returns (bool success);

    function allowance(address _owner, address _spender)
        external
        view
        returns (uint256 remaining);
}

contract SimpleBank {
    struct AccountDetail {
        string name;
        uint256 balance;
    }
    string public bankCurrency;
    uint256 private bankBalance;
    address public contractAddress;
    DaiCoin private DaiContract;
    uint256 private MAX_INT =
        0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    mapping(address => string[]) private mapAddressToAccounts;
    mapping(string => AccountDetail) private mapAccountToAccountDetail;
    event Deposit(
        address indexed sender,
        string indexed accountName,
        uint256 amount
    );
    event Transfer(
        address indexed sender,
        string indexed senderAccountName,
        string indexed receiverAccountName,
        uint256 amount
    );
    event Withdraw(
        address indexed withdrawer,
        string indexed accountName,
        uint256 amount
    );

    constructor() {
        DaiContract = DaiCoin(0x8a9424745056Eb399FD19a0EC26A14316684e274);
        bankCurrency = DaiContract.name();
        contractAddress = address(this);
    }

    function compareString(string memory a, string memory b)
        private
        pure
        returns (bool)
    {
        if (keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b))) {
            return true;
        }
        return false;
    }

    function findAccount(string memory accountName)
        private
        view
        returns (bool)
    {
        AccountDetail memory mapValue = mapAccountToAccountDetail[accountName];
        AccountDetail memory defaultValue = AccountDetail("", 0);
        if (
            compareString(mapValue.name, defaultValue.name) &&
            mapValue.balance == defaultValue.balance
        ) {
            return false;
        }
        return true;
    }

    function findManyAccounts(string[] memory accountNames)
        private
        view
        returns (bool)
    {
        for (uint256 _index = 0; _index < accountNames.length; _index++) {
            if (findAccount(accountNames[_index]) == false) {
                return false;
            }
        }
        return true;
    }

    function createAccount(string memory accountName)
        public
        returns (string memory, uint256)
    {
        require(
            findAccount(accountName) == false,
            "An account is already created!"
        );
        mapAddressToAccounts[msg.sender].push(accountName);
        AccountDetail memory createdAccountDetail = AccountDetail(
            accountName,
            0
        );
        mapAccountToAccountDetail[accountName] = createdAccountDetail;
        return (createdAccountDetail.name, createdAccountDetail.balance);
    }

    function getBankBalance() public view returns (uint256) {
        return DaiContract.balanceOf(contractAddress);
    }

    function getUserDaiInWallet() public view returns (uint256) {
        return DaiContract.balanceOf(msg.sender);
    }

    function getUserAllowance() public view returns (uint256) {
        return DaiContract.allowance(msg.sender, contractAddress);
    }

    function verifyAccount(string memory accountName)
        public
        view
        returns (bool)
    {
        string[] memory userAccounts = mapAddressToAccounts[msg.sender];
        for (uint256 _index = 0; _index < userAccounts.length; _index++) {
            if (compareString(accountName, userAccounts[_index])) {
                return true;
            }
        }
        return false;
    }

    function deposit(string memory accountName, uint256 amount) public {
        uint256 walletBalance = DaiContract.balanceOf(msg.sender);
        require(
            findAccount(accountName) == true,
            "You must create an account first."
        );
        require(
            verifyAccount(accountName),
            "You aren't the owner of the account."
        );
        require(walletBalance >= amount, "Insufficient amount Dai Coin.");
        require(
            amount <= DaiContract.allowance(msg.sender, contractAddress),
            "You must allowance token first."
        );
        DaiContract.transferFrom(msg.sender, contractAddress, amount);
        mapAccountToAccountDetail[accountName].balance += amount;
        emit Deposit(msg.sender, accountName, amount);
    }

    function withdraw(string memory accountName, uint256 amount) public {
        uint256 depositAmount = mapAccountToAccountDetail[accountName].balance;
        require(findAccount(accountName), "You must create an account first.");
        require(
            verifyAccount(accountName),
            "You aren't the owner of the account."
        );
        require(
            depositAmount >= amount,
            "You withdraw more than your deposit."
        );
        DaiContract.transfer(msg.sender, amount);
        mapAccountToAccountDetail[accountName].balance -= amount;
        emit Withdraw(msg.sender, accountName, amount);
    }

    function transfer(
        string memory fromAccountName,
        string memory toAccountName,
        uint256 amount
    ) public {
        require(findAccount(fromAccountName), "You must create account first.");
        require(findAccount(toAccountName), "You must create account first.");
        require(
            verifyAccount(fromAccountName),
            "You aren't the owner of the account."
        );
        require(
            mapAccountToAccountDetail[fromAccountName].balance >= amount,
            "Insufficient amount Dai coin."
        );

        bool isTransferToYourAccount = verifyAccount(toAccountName);

        if (isTransferToYourAccount) {
            mapAccountToAccountDetail[fromAccountName].balance -= amount;
            mapAccountToAccountDetail[toAccountName].balance += amount;
        } else {
            mapAccountToAccountDetail[fromAccountName].balance -= amount;
            mapAccountToAccountDetail[toAccountName].balance +=
                (amount * 99) /
                100;
        }
        emit Transfer(msg.sender, fromAccountName, toAccountName, amount);
    }

    function calculateTotalAmount(uint256[] memory amountForEachAccount)
        public
        pure
        returns (uint256)
    {
        uint256 sumAmount = 0;
        for (
            uint256 _index = 0;
            _index <= amountForEachAccount.length;
            _index++
        ) {
            sumAmount += amountForEachAccount[_index];
        }
        return sumAmount;
    }

    function transferToMany(
        string memory fromAccountName,
        string[] memory toAccountNames,
        uint256[] memory amountForEachAccount
    ) public {
        require(
            toAccountNames.length == amountForEachAccount.length,
            "The number of accounts much equal to the number of amounts"
        );
        require(
            findAccount(fromAccountName),
            "You must create an account first."
        );
        require(
            findManyAccounts(toAccountNames),
            "Can't transfer to uncreated account."
        );
        require(
            verifyAccount(fromAccountName),
            "You doesn't have permission to this account!."
        );
        require(
            calculateTotalAmount(amountForEachAccount) <=
                mapAccountToAccountDetail[fromAccountName].balance,
            "Insufficient funds to transfer."
        );

        for (uint256 _index = 0; _index <= toAccountNames.length; _index++) {
            transfer(
                fromAccountName,
                toAccountNames[_index],
                amountForEachAccount[_index]
            );
        }
    }

    function getSenderAccounts() public view returns (string[] memory) {
        return mapAddressToAccounts[msg.sender];
    }

    function getAccountBalance(string memory accountName)
        public
        view
        returns (uint256)
    {
        require(findAccount(accountName), "You must create an account first");
        return mapAccountToAccountDetail[accountName].balance;
    }

    function getAccountBalances(string[] memory accountNames)
        public
        view
        returns (uint256[] memory)
    {
        require(
            findManyAccounts(accountNames),
            "You must create accounts first"
        );
        uint256[] memory balances = new uint256[](accountNames.length);
        for (uint256 _index = 0; _index < accountNames.length; _index++) {
            balances[_index] = getAccountBalance(accountNames[_index]);
        }
        return balances;
    }
}
