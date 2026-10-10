const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "blood_bank",
    password: "1234",
    port: 5432
});

// Test API
app.get("/", (req, res) => {
    res.json({
        message: "Blood Bank Management System API is running"
    });
});

// Test database connection
app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            success: true,
            message: "PostgreSQL connected successfully",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });
    }
});

// ==================== DONOR APIs ====================

// Get all donors
app.get("/api/donors", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                donor_id,
                name,
                age,
                gender,
                blood_group_code,
                phone,
                email,
                address,
                last_donation_date,
                eligibility_status
            FROM DONOR
            ORDER BY donor_id
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch donors",
            error: error.message
        });
    }
});

// Get one donor by ID
app.get("/api/donors/:id", async (req, res) => {
    try {
        const donorId = parseInt(req.params.id);

        const result = await pool.query(
            `
            SELECT 
                donor_id,
                name,
                age,
                gender,
                blood_group_code,
                phone,
                email,
                address,
                last_donation_date,
                eligibility_status
            FROM DONOR
            WHERE donor_id = $1
            `,
            [donorId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Donor not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch donor",
            error: error.message
        });
    }
});

// Add donor
app.post("/api/donors", async (req, res) => {
    try {
        const {
            donor_id,
            name,
            age,
            gender,
            blood_group_code,
            phone,
            email,
            address,
            last_donation_date,
            eligibility_status
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO DONOR (
                donor_id,
                name,
                age,
                gender,
                blood_group_code,
                phone,
                email,
                address,
                last_donation_date,
                eligibility_status
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING *
            `,
            [
                donor_id,
                name,
                age,
                gender,
                blood_group_code,
                phone,
                email,
                address,
                last_donation_date,
                eligibility_status
            ]
        );

        res.status(201).json({
            success: true,
            message: "Donor added successfully",
            donor: result.rows[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to add donor",
            error: error.message
        });
    }
});

// Update donor
app.put("/api/donors/:id", async (req, res) => {
    try {
        const donorId = parseInt(req.params.id);

        const {
            name,
            age,
            gender,
            blood_group_code,
            phone,
            email,
            address,
            last_donation_date,
            eligibility_status
        } = req.body;

        const result = await pool.query(
            `
            UPDATE DONOR
            SET
                name = $1,
                age = $2,
                gender = $3,
                blood_group_code = $4,
                phone = $5,
                email = $6,
                address = $7,
                last_donation_date = $8,
                eligibility_status = $9
            WHERE donor_id = $10
            RETURNING *
            `,
            [
                name,
                age,
                gender,
                blood_group_code,
                phone,
                email,
                address,
                last_donation_date,
                eligibility_status,
                donorId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Donor not found"
            });
        }

        res.json({
            success: true,
            message: "Donor updated successfully",
            donor: result.rows[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update donor",
            error: error.message
        });
    }
});

// Delete donor
app.delete("/api/donors/:id", async (req, res) => {
    try {
        const donorId = parseInt(req.params.id);

        const result = await pool.query(
            `
            DELETE FROM DONOR
            WHERE donor_id = $1
            RETURNING *
            `,
            [donorId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Donor not found"
            });
        }

        res.json({
            success: true,
            message: "Donor deleted successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete donor",
            error: error.message
        });
    }
});
// ==================== BLOOD STOCK APIs ====================

// Get all blood stock

// Get all blood stock with hospital details
app.get("/api/blood-stock", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                bs.stock_id,
                bs.hospital_id,
                h.name,
                bs.blood_group_code,
                bs.units_available,
                bs.target_capacity,
                bs.last_updated
            FROM BLOOD_STOCK bs
            JOIN HOSPITAL h
                ON bs.hospital_id = h.hospital_id
            ORDER BY bs.stock_id
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch blood stock",
            error: error.message
        });
    }
});

// Update blood stock
app.put("/api/blood-stock/:id", async (req, res) => {
    try {
        const stockId = parseInt(req.params.id);
        const { units_available, target_capacity } = req.body;

        if (
            !Number.isInteger(stockId) ||
            !Number.isInteger(Number(units_available)) ||
            !Number.isInteger(Number(target_capacity))
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid stock values"
            });
        }

        if (Number(units_available) < 0 || Number(target_capacity) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Units cannot be negative and target must be greater than 0"
            });
        }

        const result = await pool.query(
            `
            UPDATE BLOOD_STOCK
            SET
                units_available = $1,
                target_capacity = $2,
                last_updated = CURRENT_TIMESTAMP
            WHERE stock_id = $3
            RETURNING *
            `,
            [
                Number(units_available),
                Number(target_capacity),
                stockId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Blood stock record not found"
            });
        }

        res.json({
            success: true,
            message: "Blood stock updated successfully",
            stock: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update blood stock",
            error: error.message
        });
    }
});
// Get all recipients
app.get("/api/recipients", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                recipient_id,
                name,
                age,
                gender,
                blood_group_needed,
                hospital_id,
                attending_doctor_id,
                date_registered
            FROM RECIPIENT
            ORDER BY recipient_id
        `);

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching recipients:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch recipients"
        });
    }
});

// Add a recipient
app.post("/api/recipients", async (req, res) => {
    try {
        const {
            name, age, gender, blood_group_needed,
            hospital_id, attending_doctor_id, date_registered
        } = req.body;

        const missingFields = [];

if (!name) missingFields.push("name");
if (!age) missingFields.push("age");
if (!gender) missingFields.push("gender");
if (!blood_group_needed) missingFields.push("blood_group_needed");
if (!hospital_id) missingFields.push("hospital_id");
if (!attending_doctor_id) missingFields.push("attending_doctor_id");
if (!date_registered) missingFields.push("date_registered");

if (missingFields.length > 0) {
    return res.status(400).json({
        success: false,
        message: "Missing required fields: " + missingFields.join(", ")
    });
}

        const result = await pool.query(`
            INSERT INTO RECIPIENT
                (name, age, gender, blood_group_needed, hospital_id,
                 attending_doctor_id, date_registered)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [
            name, age, gender, blood_group_needed,
            hospital_id, attending_doctor_id, date_registered
        ]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding recipient:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add recipient"
        });
    }
});

// Update a recipient
app.put("/api/recipients/:id", async (req, res) => {
    try {
        const {
            name, age, gender, blood_group_needed,
            hospital_id, attending_doctor_id, date_registered
        } = req.body;

        const result = await pool.query(`
            UPDATE RECIPIENT
            SET name = $1,
                age = $2,
                gender = $3,
                blood_group_needed = $4,
                hospital_id = $5,
                attending_doctor_id = $6,
                date_registered = $7
            WHERE recipient_id = $8
            RETURNING *
        `, [
            name, age, gender, blood_group_needed,
            hospital_id, attending_doctor_id, date_registered,
            req.params.id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Recipient not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating recipient:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update recipient"
        });
    }
});

// Delete a recipient
app.delete("/api/recipients/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM RECIPIENT WHERE recipient_id = $1 RETURNING recipient_id",
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Recipient not found"
            });
        }

        res.json({
            success: true,
            message: "Recipient deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting recipient:", error);
        res.status(500).json({
            success: false,
            message: "Could not delete recipient. It may be linked to other records."
        });
    }
});
// Get hospitals and staff for recipient registration
app.get("/api/recipient-form-options", async (req, res) => {
    try {
        const hospitals = await pool.query(`
            SELECT hospital_id, name
            FROM HOSPITAL
            ORDER BY name
        `);

        const doctors = await pool.query(`
            SELECT staff_id, name
            FROM STAFF
            ORDER BY name
        `);

        res.json({
            hospitals: hospitals.rows,
            doctors: doctors.rows
        });
    } catch (error) {
        console.error("Error loading recipient form options:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load hospitals and doctors"
        });
    }
});
app.get("/api/dashboard-stats", async (req, res) => {
    try {
        const [
            donors,
            recipients,
            stock,
            hospitals,
            requests
        ] = await Promise.all([
            pool.query(
                "SELECT COUNT(*)::int AS total FROM DONOR"
            ),
            pool.query(
                "SELECT COUNT(*)::int AS total FROM RECIPIENT"
            ),
            pool.query(`
                SELECT COALESCE(SUM(units_available), 0)::int AS total
                FROM BLOOD_STOCK
            `),
            pool.query(
                "SELECT COUNT(*)::int AS total FROM HOSPITAL"
            ),
            pool.query(`
                SELECT
                    COUNT(*) FILTER (
                        WHERE status = 'Pending'
                    )::int AS pending,
                    COUNT(*) FILTER (
                        WHERE status = 'Approved'
                    )::int AS approved
                FROM BLOOD_REQUEST
            `)
        ]);

        res.json({
            totalDonors: donors.rows[0].total,
            totalRecipients: recipients.rows[0].total,
            totalUnits: stock.rows[0].total,
            totalHospitals: hospitals.rows[0].total,
            pendingRequests: requests.rows[0].pending,
            approvedRequests: requests.rows[0].approved
        });

    } catch (error) {
        console.error("Dashboard statistics error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load dashboard statistics"
        });
    }
});

        
app.get("/api/dashboard-stats", async (req, res) => {
    try {
        const [
            donors,
            recipients,
            stock,
            hospitals,
            requests
        ] = await Promise.all([
            pool.query("SELECT COUNT(*)::int AS total FROM DONOR"),
            pool.query("SELECT COUNT(*)::int AS total FROM RECIPIENT"),
            pool.query(`
                SELECT COALESCE(SUM(units_available), 0)::int AS total
                FROM BLOOD_STOCK
            `),
            pool.query("SELECT COUNT(*)::int AS total FROM HOSPITAL"),
            pool.query(`
                SELECT
                    COUNT(*) FILTER (
                        WHERE status = 'Pending'
                    )::int AS pending,
                    COUNT(*) FILTER (
                        WHERE status = 'Approved'
                    )::int AS approved
                FROM BLOOD_REQUEST
            `)
        ]);

        res.json({
            totalDonors: donors.rows[0].total,
            totalRecipients: recipients.rows[0].total,
            totalUnits: stock.rows[0].total,
            totalHospitals: hospitals.rows[0].total,
            pendingRequests: requests.rows[0].pending,
            approvedRequests: requests.rows[0].approved
        });

    } catch (error) {
        console.error("Dashboard statistics error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load dashboard statistics"
        });
    }
});
app.get("/api/latest-blood-requests", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                br.request_id,
                br.blood_group_code,
                br.units_needed,
                br.priority,
                br.request_date,
                br.status,
                r.name AS recipient_name,
                h.name AS hospital_name
            FROM BLOOD_REQUEST br
            JOIN RECIPIENT r
                ON br.recipient_id = r.recipient_id
            JOIN HOSPITAL h
                ON br.hospital_id = h.hospital_id
            ORDER BY br.request_date DESC, br.request_id DESC
            LIMIT 5
        `);

        res.json(result.rows);
    } catch (error) {
        console.error("Latest blood requests error:", error);
        res.status(500).json({
            message: "Failed to load latest blood requests"
        });
    }
});
app.get("/api/requests", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                br.request_id,
                br.recipient_id,
                br.hospital_id,
                br.blood_group_code,
                br.units_needed,
                br.priority,
                br.request_date,
                br.status,
                br.processed_by_staff_id,
                r.name AS recipient_name,
                h.name AS hospital_name
            FROM BLOOD_REQUEST br
            JOIN RECIPIENT r
                ON br.recipient_id = r.recipient_id
            JOIN HOSPITAL h
                ON br.hospital_id = h.hospital_id
            ORDER BY br.request_date DESC, br.request_id DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error("Fetch blood requests error:", error);
        res.status(500).json({
            message: "Failed to fetch blood requests"
        });
    }
});
app.put("/api/requests/:id/status", async (req, res) => {
    try {
        const requestId = Number(req.params.id);
        const { status } = req.body;

        if (!Number.isInteger(requestId) || requestId <= 0) {
            return res.status(400).json({
                message: "Invalid request ID"
            });
        }

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be Approved or Rejected"
            });
        }

        const result = await pool.query(
            `UPDATE BLOOD_REQUEST
             SET status = $1
             WHERE request_id = $2
             RETURNING request_id, status`,
            [status, requestId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Blood request not found"
            });
        }

        res.json({
            message: `Request ${status.toLowerCase()} successfully`,
            request: result.rows[0]
        });
    } catch (error) {
        console.error("Update blood request error:", error);
        res.status(500).json({
            message: "Failed to update blood request"
        });
    }
});
// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
