const accountModel = require("../accounts/accounts-model");
// const yup = require("yup");
// const accountShema = yup.object().shape({
//   name: yup
//     .string()
//     .min(3, "name of account must be between 3 and 100")
//     .max(100, "name of account must be between 3 and 100")
//     .required("name and budget are required"),
//   budget: yup
//     .number("budget of account must be a number")
//     .min(0,""budget of account is too large or too small"")
//     .max(1000000,""budget of account is too large or too small"")
//     .required("name and budget are required"),
// });

exports.logger = (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toLocaleString();
  console.log(`${timestamp}--${method}--${url}`);
  next();
};

exports.checkAccountPayload = async (req, res, next) => {
  // KODLAR BURAYA
  // Not: Validasyon için Yup(şu an yüklü değil!) kullanabilirsiniz veya kendiniz manuel yazabilirsiniz.
  try {
    let { name, budget } = req.body;
    let isValidLengthName =  name !== undefined && name.trim().length >= 3 && name.trim().length <= 100;
    let isValidbudget = budget !== undefined && (parseInt(budget) > 1000000 || parseInt(budget) < 0);
    let isValidbudgetNumber = isNaN(parseInt(budget));

    if (name === undefined || budget === undefined) {
      return res.status(400).json({ message: "name and budget are required" });
    } else if (!isValidLengthName) {
      return res.status(400).json({ message: "name of account must be between 3 and 100" });
    } else if (isValidbudgetNumber) {
      return res.status(400).json({ message: "budget of account must be a number" });
    } else if (isValidbudget) {
      return res.status(400).json({ message: "budget of account is too large or too small" });
    } else {
      req.payloadAccounts = {
        name: name.trim(),
        budget: budget,
      };
      next();
    }
  } catch (error) {
    next(error);
  }
};

exports.checkAccountNameUnique = async (req, res, next) => {
  // KODLAR BURAYA
  try {
    const { name } = req.body;
    const isName = !!name && (await accountModel.checkName(name));
    if (isName) {
      res.status(400).json({ message: "that name is taken" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

exports.checkAccountId = async (req, res, next) => {
  // KODLAR BURAYA
  try {
    const isExistAccount = await accountModel.getById(req.params.id);
    if (!isExistAccount) {
      res.status(404).json({ message: "account not found" });
    } else {
      req.existAccount = isExistAccount;
      next();
    }
  } catch (error) {
    next(error);
  }
};
