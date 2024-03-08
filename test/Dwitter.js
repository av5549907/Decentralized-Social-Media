const Dwitter = artifacts.require("Dwitter");

contract("Dwitter", async (accounts) => {
  const owner = accounts[0];
  const user = accounts[1];
  let instance;

  beforeEach(async () => {
    instance = await Dwitter.deployed();
  });

  it("should stop the Dapp", async () => {
    await instance.stopDapp({ from: owner });
    const stopped = await instance.stopped();
    assert.equal(stopped, true, "Dapp was not stopped successfully");
  });

  it("should start the Dapp", async () => {
    await instance.startDapp({ from: owner });
    const stopped = await instance.stopped();
    assert.equal(stopped, false, "Dapp was not started successfully");
  });

  it("should add a maintainer", async () => {
    await instance.addMaintainer(user, { from: owner });
    const isMaintainer = await instance.isMaintainer(user);
    assert.equal(isMaintainer, true, "Maintainer was not added successfully");
  });

  it("should remove a maintainer", async () => {
    await instance.revokeMaintainer(user, { from: owner });
    const isMaintainer = await instance.isMaintainer(user);
    assert.equal(isMaintainer, false, "Maintainer was not removed successfully");
  });

  it("should register a user", async () => {
    const username = 'check';
    const name = 'checkName';
    const imgHash = 'checkImg';
    const coverImg = 'checkCover';
    const bio = 'testing';

    await instance.registerUser(username, name, imgHash, coverImg, bio, { from: user });
    const userInfo = await instance.getUser.call(user);
    assert.equal(userInfo.id, 2, "User registration failed");
  });

  it("should create a Dweet", async () => {
    const hashtag = 'check';
    const content = 'checkName';
    const imghash = 'checkImg';

    await instance.createDweet(hashtag, content, imghash, { from: user });
    const totalDweets = await instance.totalDweets();
    assert.equal(totalDweets, 1, "Dweet creation failed");
  });

  it("should create an advertisement", async () => {
    const imghash = "check";
    const link = "check";
    const adcost = await instance.advertisementCost();

    await instance.submitAdvertisement(imghash, link, { from: user, value: adcost });
    const totalAds = await instance.totalAdvertisements();
    assert.equal(totalAds, 1, "Advertisement submission failed");
  });

  it("should accept an advertisement", async () => {
    const id = 1;
    await instance.advertisementApproval(id, true, { from: owner });
    const approval = await instance.getAdvertisementStatus(id);
    assert.equal(approval, 1, "Advertisement acceptance failed");
  });

  it("should reject an advertisement", async () => {
    const imghash = "check";
    const link = "check";
    const adcost = await instance.advertisementCost();

    await instance.submitAdvertisement(imghash, link, { from: user, value: adcost });
    const id = await instance.totalAdvertisements();

    await instance.advertisementApproval(id, false, { from: owner });
    const approval = await instance.getAdvertisementStatus(id);
    assert.equal(approval, 2, "Advertisement rejection failed");
  });
});
