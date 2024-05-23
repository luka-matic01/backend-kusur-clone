const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/checkTenant/:slug", async (req, res) => {
  const { slug } = req.params;
  const tenantId = parseInt(slug);

  try {
    // Find the tenant with the specified ID
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
      include: {
        vouchers: true,
        coupons: true,
        relusertenant: true,
        wallet: true,
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    // Extract user and wallet from the tenant
    const user =
      tenant.relusertenant.length > 0 ? tenant.relusertenant[0].user : null;
    const wallet = user ? user.wallet : null;

    res.json({ tenant, wallet });
  } catch (error) {
    console.error("Error fetching tenant data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
        wallet: true,
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
