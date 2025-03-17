import express from "express";
import { Client } from "pg";
import cors from "cors";
const app = express();
const port = 3100;
app.use(cors());
const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "Admin",
    password: "254327",
    port: 5432,
});
client.connect().catch((err) => console.error("Database connection error:", err));
const getChartData = async (timeRange) => {
    let query = "";
    const params = [];
    if (timeRange === "daily") {
        query = `
      SELECT TO_CHAR(date_column, 'YYYY-MM-DD') as label, SUM(volume) as volume
      FROM your_table
      WHERE date_column >= CURRENT_DATE - INTERVAL '1 day'
      GROUP BY label
      ORDER BY label;
    `;
    }
    else if (timeRange === "monthly") {
        query = `
      SELECT TO_CHAR(date_column, 'YYYY-MM') as label, SUM(volume) as volume
      FROM your_table
      WHERE date_column >= CURRENT_DATE - INTERVAL '1 month'
      GROUP BY label
      ORDER BY label;
    `;
    }
    else if (timeRange === "yearly") {
        query = `
      SELECT TO_CHAR(date_column, 'YYYY') as label, SUM(volume) as volume
      FROM your_table
      WHERE date_column >= CURRENT_DATE - INTERVAL '1 year'
      GROUP BY label
      ORDER BY label;
    `;
    }
    else {
        throw new Error("Invalid time range");
    }
    const res = await client.query(query, params);
    const labels = res.rows.map((row) => row.label);
    const data = res.rows.map((row) => row.volume);
    return {
        labels,
        datasets: [
            {
                label: "Volume Data",
                data,
                backgroundColor: "rgba(255, 87, 51, 0.7)",
                borderColor: "rgba(255, 87, 51, 1)",
                borderWidth: 2,
            },
        ],
    };
};
app.get("/chart-data", async (req, res) => {
    const { range } = req.query;
    if (!range || !["daily", "monthly", "yearly"].includes(range)) {
        return res.status(400).json({ error: "Invalid or missing range parameter" });
    }
    try {
        const chartData = await getChartData(range);
        res.json(chartData);
    }
    catch (error) {
        console.error("Error fetching chart data:", error);
        res.status(500).json({ error: "Failed to fetch chart data" });
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
