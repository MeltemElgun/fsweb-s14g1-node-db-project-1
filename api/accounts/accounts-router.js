const router = require("express").Router();
const {
  logger,
  checkAccountPayload,
  checkAccountNameUnique,
  checkAccountId,
} = require("../accounts/accounts-middleware");

const accountModel = require("./accounts-model");
router.get("/", async (req, res, next) => {
  // KODLAR BURAYA
  try {
    let allAccounts = await accountModel.getAll();
    res.status(201).json(allAccounts);
  } catch (error) {
    res.status(500).json({ message: "accounts alınamadı" });
  }
});

router.get("/:id", checkAccountId, (req, res, next) => {
  // KODLAR BURAYA
  try {
    res.status(201).json(req.existAccount);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  checkAccountPayload,
  checkAccountNameUnique,
  async (req, res, next) => {
    // KODLAR BURAYA
    try {
      let insertedAccounts = await accountModel.create(req.payloadAccounts);
      res.status(201).json(insertedAccounts);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  checkAccountId,
  checkAccountPayload,
  async (req, res, next) => {
    // KODLAR BURAYA
    try {
      let updateAcounts = await accountModel.updateById(
        req.params.id,
        req.payloadAccounts
      );
      req.status(201).json(updateAcounts);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id", checkAccountId, async (req, res, next) => {
  // KODLAR BURAYA
  try {
    await accountModel.deleteById(req.params.id);
    res.status(201).json({ message: "deletion successful" });
  } catch (error) {
    next(error);
  }
});

router.use((err, req, res, next) => {
  // eslint-disable-line
  // KODLAR BURAYA
  let status = err.status || 500;
  res.status(status).json({
    customMessage: "Bir hata oluştu, server noktasından bu mesaj yazıldı",
    message: err.message,
  });
});

module.exports = router;
