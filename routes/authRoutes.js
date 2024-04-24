const express = require("express");
const prisma = require("../prismaClient");
const { faker } = require("@faker-js/faker");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    let user = await prisma.user.findUnique({
      where: {
        phoneNumber,
      },
      include: {
        relusertenant: {
          include: {
            tenant: {
              include: {
                vouchers: {
                  include: {
                    discountType: true,
                  },
                },
                coupons: {
                  include: {
                    discountType: true,
                  },
                },
              },
            },
          },
        },
        wallet: true, // Include user's wallet
      },
    });

    if (!user) {
      const voucherDiscountTypeExists = await prisma.discountType.findFirst({
        where: { id: 1 },
      });
      const couponDiscountTypeExists = await prisma.discountType.findFirst({
        where: { id: 2 },
      });

      if (!voucherDiscountTypeExists) {
        await prisma.discountType.create({
          data: {
            id: 1,
            name: "Voucher Discount",
          },
        });
      }

      if (!couponDiscountTypeExists) {
        await prisma.discountType.create({
          data: {
            id: 2,
            name: "Coupon Discount",
          },
        });
      }

      user = await prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          phoneNumber: phoneNumber,
          wallet: {
            // Create wallet for the user
            create: {
              pointBalance: faker.number.int({ min: 0, max: 1000 }), // Example point balance
            },
          },
          relusertenant: {
            create: Array.from({ length: 6 }, () => ({
              tenant: {
                create: {
                  name: faker.commerce.product(),
                  imageUrl: faker.image.url(),
                  vouchers: {
                    createMany: {
                      data: Array.from({ length: 6 }, () => ({
                        description: faker.lorem.words(),
                        name: faker.commerce.product(),
                        imageUrl: faker.image.url(),
                        currency: "KM",
                        discountValue: faker.number.int({ min: 10, max: 100 }),
                        discountTypeId: 1,
                      })),
                    },
                  },
                  coupons: {
                    createMany: {
                      data: Array.from({ length: 6 }, () => ({
                        description: faker.lorem.words(),
                        name: faker.commerce.product(),
                        currency: "KM",
                        discountValue: faker.number.int({ min: 10, max: 100 }),
                        imageUrl: faker.image.url(),
                        discountTypeId: 2,
                      })),
                    },
                  },
                },
              },
            })),
          },
        },
        include: {
          relusertenant: {
            include: {
              tenant: true,
            },
          },
          wallet: true, // Include user's wallet
        },
      });

      // Create wallet for the user and connect tenants dynamically
      const walletId = user.wallet.id;
      const tenantIds = user.relusertenant.map(({ tenant }) => tenant.id);

      await prisma.wallet.update({
        where: { id: walletId },
        data: {
          tenants: {
            connect: tenantIds.map((id) => ({ id })),
          },
        },
      });
    }
    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/checkUser", async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        phoneNumber,
      },
      include: {
        relusertenant: {
          include: {
            tenant: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // If user exists, return the first tenant
    const firstTenant =
      user.relusertenant.length > 0 ? user.relusertenant[0].tenant : null;

    return res
      .status(200)
      .json({ message: "User found", tenant: firstTenant, user });
  } catch (error) {
    console.error("Error checking user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
