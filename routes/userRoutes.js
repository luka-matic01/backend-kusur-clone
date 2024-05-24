const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const userId = parseInt(slug);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        relusertenant: {
          include: {
            tenant: {
              include: {
                vouchers: true,
                coupons: true,
                wallet: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
