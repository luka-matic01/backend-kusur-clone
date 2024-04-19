const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const tenantId = parseInt(slug);

  try {
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },

      include: {
        vouchers: true,
        coupons: true,
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: "tenant not found" });
    }

    res.json(tenant);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
