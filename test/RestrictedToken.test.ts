import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer, utils } from "ethers";

describe("RestrictedToken", function () {
  let restrictedToken: Contract;
  let user1: Signer;
  let user2: Signer;
  let admin: Signer;

  let userAddress1: String;
  let userAddress2: String;

  before(async function () {
    const RestrictedToken = await ethers.getContractFactory("RestrictedToken");
    restrictedToken = await RestrictedToken.deploy("RestrictedToken", "BAN");
    await restrictedToken.deployed();
    [admin, user1, user2] = await ethers.getSigners();
    userAddress1 = await user1.getAddress();
    userAddress2 = await user2.getAddress();
  });

  it("Should deploy the RestrictedToken contract successfully", async () => {
    const codeSize = await ethers.provider
      .getCode(restrictedToken.address)
      .then((code) => {
        return code.length;
      });
    expect(codeSize).to.be.greaterThan(100);
  });

  it("Should successfully restrict an address when called by the owner", async () => {
    expect(await restrictedToken.isRestricted(userAddress1)).to.equal(false);
    await restrictedToken.connect(admin).restrictAddress(userAddress1);
    expect(await restrictedToken.isRestricted(userAddress1)).to.equal(true);
  });

  it("Should fail to restrict an address when called by a non-admin user", async () => {
    await expect(
      restrictedToken.connect(user1).restrictAddress(userAddress2)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should fail to un-restrict an address when called by a non-admin user", async () => {
    await expect(
      restrictedToken.connect(user1).unRestrictAddress(userAddress2)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should successfully un-restrict an address when called by the owner", async () => {
    expect(await restrictedToken.isRestricted(userAddress1)).to.equal(true);
    await restrictedToken.connect(admin).unRestrictAddress(userAddress1);
    expect(await restrictedToken.isRestricted(userAddress1)).to.equal(false);
  });

  it("Should successfully transfer tokens to an unrestricted address", async () => {
    expect(await restrictedToken.balanceOf(userAddress1)).to.equal(0);
    await restrictedToken.transfer(userAddress1, utils.parseEther("1000"));
    expect(await restrictedToken.balanceOf(userAddress1)).to.equal(
      utils.parseEther("1000")
    );
  });

  it("Should successfully restrict an address when called by the owner", async () => {
    await restrictedToken.connect(admin).restrictAddress(userAddress1);
    expect(await restrictedToken.isRestricted(userAddress1)).to.equal(true);
  });

  it("Should fail to transfer tokens from a restricted address", async () => {
    await expect(
      restrictedToken
        .connect(user1)
        .transfer(userAddress2, utils.parseEther("1000"))
    ).to.be.revertedWith("Restricted 'from' address.");
  });

  it("Should fail to transfer tokens to a restricted address", async () => {
    await expect(
      restrictedToken
        .connect(user2)
        .transfer(userAddress1, utils.parseEther("1000"))
    ).to.be.revertedWith("Restricted 'to' address.");
  });
});
