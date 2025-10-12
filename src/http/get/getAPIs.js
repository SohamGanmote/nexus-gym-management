import { toast } from "react-toastify";
import rawQuery from "../../connect-to-db/renderer";

export const getTodos = async () => {
	const result = await rawQuery("SELECT * FROM todo ORDER BY completed ASC;");
	return result;
};

export const getActiveTheme = async () => {
	try {
		const activeThemes = await rawQuery(
			`SELECT * FROM "Themes" WHERE is_active = 1 OR is_active = '1';`
		);

		if (!activeThemes || activeThemes.length === 0) {
			toast.error("No active theme found");
			throw new Error("No active theme found");
		}

		return activeThemes[0];
	} catch (error) {
		console.error("Error fetching active themes:", error);
		throw error;
	}
};

export async function getTheme({ page = 1 }) {
	try {
		const pageSize = 10; // Records per page
		const offset = (page - 1) * pageSize;

		// Fetch all themes ordered by is_active DESC
		const allThemes = await rawQuery(`
			SELECT * FROM "Themes"
			ORDER BY is_active DESC;
		`);

		if (!allThemes || allThemes.length === 0) {
			throw new Error("No themes found");
		}

		// Calculate total pages
		const totalThemes = allThemes.length;
		const totalPages = Math.ceil(totalThemes / pageSize);

		// Get paginated data
		const paginatedThemes = allThemes.slice(offset, offset + pageSize);

		return {
			pageNo: page,
			totalPages,
			data: paginatedThemes,
		};
	} catch (error) {
		console.error("Error fetching themes:", error);
		throw error;
	}
}

export async function getTiers({ page = 1 }) {
	try {
		const allTiers = await rawQuery(`SELECT * FROM "Tiers";`);

		if (!allTiers || allTiers.length === 0) {
			throw new Error("No tiers found");
		}

		if (page === "all") {
			const transformedData = allTiers.map((item) => ({
				value: item.tier_id,
				label: item.name,
				tier_data: item,
			}));

			return transformedData;
		}

		const pageNo = parseInt(page, 10) || 1;
		const pageSize = 10;

		const totalTiers = allTiers.length;
		const totalPages = Math.ceil(totalTiers / pageSize);

		const startIdx = (pageNo - 1) * pageSize;
		const endIdx = startIdx + pageSize;

		const tiersOnPage = allTiers.slice(startIdx, endIdx);

		return {
			pageNo,
			totalPages,
			data: tiersOnPage,
		};
	} catch (error) {
		console.error("Error fetching tiers:", error);
		throw error;
	}
}

export async function getUsers({ page = 1, search = "", filter = "all" }) {
	try {
		const pageNo = parseInt(page, 10) || 1;
		const pageSize = 10;
		const offset = (pageNo - 1) * pageSize;

		let users = [];
		let totalUsers = 0;

		// SEARCH
		if (search) {
			const searchTerm = search.toLowerCase();
			users = await rawQuery(`
        SELECT * FROM "Users"
        WHERE LOWER(first_name) LIKE '%${searchTerm}%'
           OR LOWER(last_name) LIKE '%${searchTerm}%'
           OR LOWER(mobile_no) LIKE '%${searchTerm}%'
        ORDER BY first_name ASC
        LIMIT ${pageSize} OFFSET ${offset};
      `);

			const countResult = await rawQuery(`
        SELECT COUNT(*) AS total FROM "Users"
        WHERE LOWER(first_name) LIKE '%${searchTerm}%'
           OR LOWER(last_name) LIKE '%${searchTerm}%'
           OR LOWER(mobile_no) LIKE '%${searchTerm}%';
      `);

			totalUsers = countResult[0]?.total || users.length;
		}
		// FILTER = ALL
		else if (filter === "all") {
			users = await rawQuery(`
			SELECT 
					u.user_id,
					u.first_name,
					u.last_name,
					u.mobile_no,
					u.dob,
					u.createdAt AS user_created_at,
					u.updatedAt AS user_updated_at,
					
					CASE
							WHEN EXISTS (
									SELECT 1 
									FROM "Subscriptions" s
									WHERE s.user_id = u.user_id
										AND DATE(s.end_date) >= DATE('now')
							) THEN 'Active'
							
							WHEN EXISTS (
									SELECT 1 
									FROM "Subscriptions" s
									WHERE s.user_id = u.user_id
							) THEN 'Not Active'
							
							ELSE 'Inquiry'
					END AS state
					FROM "Users" u
					ORDER BY u.first_name ASC
					LIMIT ${pageSize} OFFSET ${offset};
				`);

			const countResult = await rawQuery(
				`SELECT COUNT(*) AS total FROM "Users";`
			);
			totalUsers = countResult[0]?.total || users.length;
		}
		// FILTER = ACTIVE
		else if (filter === "active") {
			users = await rawQuery(`
        SELECT u.*
        FROM "Users" u
        JOIN "Subscriptions" s ON u.user_id = s.user_id
        WHERE DATE('now') BETWEEN s.start_date AND s.end_date
        ORDER BY u.first_name ASC
        LIMIT ${pageSize} OFFSET ${offset};
      `);

			const countResult = await rawQuery(`
        SELECT COUNT(DISTINCT u.user_id) AS total
        FROM "Users" u
        JOIN "Subscriptions" s ON u.user_id = s.user_id
        WHERE DATE('now') BETWEEN s.start_date AND s.end_date;
				`);

			users = users.map((item) => ({ ...item, state: "Active" }));
			totalUsers = countResult[0]?.total || users.length;
		}
		// FILTER = INACTIVE
		else if (filter === "inactive") {
			users = await rawQuery(`
				SELECT u.*
				FROM "Users" u
				WHERE EXISTS (
					SELECT 1 FROM "Subscriptions" s
					WHERE s.user_id = u.user_id
				)
				AND NOT EXISTS (
					SELECT 1 FROM "Subscriptions" s
					WHERE s.user_id = u.user_id
					AND DATE(s.end_date) >= DATE('now')
				)
				ORDER BY u.first_name ASC
				LIMIT ${pageSize} OFFSET ${offset};
			`);

			const countResult = await rawQuery(`
				SELECT COUNT(*) AS total
				FROM "Users" u
				WHERE EXISTS (
					SELECT 1 FROM "Subscriptions" s
					WHERE s.user_id = u.user_id
				)
				AND NOT EXISTS (
					SELECT 1 FROM "Subscriptions" s
					WHERE s.user_id = u.user_id
					AND DATE(s.end_date) >= DATE('now')
				);
			`);

			users = users.map((item) => ({ ...item, state: "Not Active" }));
			totalUsers = countResult[0]?.total || users.length;
		}
		// FILTER = INQUIRY (users with no subscriptions)
		else if (filter === "inquiry") {
			users = await rawQuery(`
        SELECT u.*
        FROM "Users" u
        LEFT JOIN "Subscriptions" s ON u.user_id = s.user_id
        WHERE s.subscription_id IS NULL
        ORDER BY u.first_name ASC
        LIMIT ${pageSize} OFFSET ${offset};
      `);

			const countResult = await rawQuery(`
        SELECT COUNT(*) AS total
        FROM "Users" u
        LEFT JOIN "Subscriptions" s ON u.user_id = s.user_id
        WHERE s.subscription_id IS NULL;
      `);

			users = users.map((item) => ({ ...item, state: "Inquiry" }));
			totalUsers = countResult[0]?.total || users.length;
		}

		return {
			pageNo,
			totalPages: Math.ceil(totalUsers / pageSize),
			data: users,
		};
	} catch (error) {
		console.error("Error fetching users:", error);
		toast.error("Error fetching users");
		throw error;
	}
}

export async function getUsersSubscriptionById({
	user_id,
	pageNo = 1,
	pageSize = 10,
}) {
	if (!user_id) throw new Error("user_id is required");

	// 1️⃣ Get user details
	const userResult = await rawQuery(`
    SELECT user_id, first_name, last_name, dob, mobile_no
    FROM "Users"
    WHERE user_id = '${user_id}';
  `);

	if (!userResult || userResult.length === 0) {
		throw new Error("User not found");
	}
	const user = userResult[0];

	// 2️⃣ Get subscriptions with user + admin details (paginated)
	const offset = (pageNo - 1) * pageSize;
	const subscriptions = await rawQuery(`
    SELECT 
      s.*,
      u.user_id AS subscriber_id,
      u.first_name AS user_first_name,
      u.last_name AS user_last_name,
      u.mobile_no AS user_mobile_no,
      a.admin_id,
      a.first_name AS admin_first_name,
      a.last_name AS admin_last_name,
      a.username AS admin_username,
      a.mobile_no AS admin_mobile_no
    FROM "Subscriptions" s
    LEFT JOIN "Users" u ON s.user_id = u.user_id
    LEFT JOIN "Admins" a ON s.admin_id = a.admin_id
    WHERE s.user_id = '${user_id}'
    ORDER BY s.end_date DESC
    LIMIT ${pageSize} OFFSET ${offset};
  `);

	// 3️⃣ Count total subscriptions
	const countResult = await rawQuery(`
    SELECT COUNT(*) AS total
    FROM "Subscriptions"
    WHERE user_id = '${user_id}';
  `);
	const totalSubscriptions = countResult[0]?.total || 0;
	const totalPages = Math.ceil(totalSubscriptions / pageSize);

	// 4️⃣ If no subscriptions
	if (subscriptions.length === 0) {
		return {
			user,
			message: "No subscriptions found for this user",
			subscriptions: [],
			pageNo,
			totalPages,
		};
	}

	// 5️⃣ Loop through subscriptions → add tier + payment details
	const subscriptionsWithDetails = [];

	for (const sub of subscriptions) {
		// Tier details
		const tierResult = await rawQuery(`
      SELECT tier_id, name, description, monthly, quarterly, halfyearly, yearly
      FROM "Tiers"
      WHERE tier_id = '${sub.tier_id}';
    `);
		const tier = tierResult[0] || null;

		// Payments
		const payments = await rawQuery(`
      SELECT *
      FROM "Payments"
      WHERE subscription_id = '${sub.subscription_id}'
      ORDER BY createdAt DESC;
    `);

		let totalPaid = 0;
		let latestPayment = payments[0] || null;
		payments.forEach((p) => (totalPaid += p.paid || 0));

		const paymentSummary = latestPayment
			? {
					mode: latestPayment.mode,
					paid: totalPaid,
					payable: latestPayment.payable,
			  }
			: null;

		// Determine active status
		const now = new Date();
		const isActive =
			new Date(sub.start_date) <= now && new Date(sub.end_date) >= now;

		subscriptionsWithDetails.push({
			...sub,
			isActive,
			tier,
			payment: paymentSummary,
		});
	}

	// 6️⃣ Return final structured result
	return {
		message: "User details and subscriptions fetched successfully",
		user,
		subscriptions: subscriptionsWithDetails,
		pageNo,
		totalPages,
	};
}

export async function getUsersSubscriptionWithPendingPaymentsById({ user_id }) {
	if (!user_id) {
		throw new Error("user_id is required");
	}

	// 1️⃣ Fetch all subscriptions along with their tiers and payments in a single query
	const rows = await rawQuery(`
    SELECT 
      s.subscription_id,
      s.user_id,
      s.start_date,
      s.end_date,
      s.admin_id,
      t.tier_id,
      t.name AS tier_name,
      t.description AS tier_description,
      t.monthly,
      t.quarterly,
      t.halfyearly,
      t.yearly,
      p.payment_id,
      p.mode AS payment_mode,
      p.paid AS payment_paid,
      p.payable AS payment_payable,
      p.createdAt AS payment_createdAt
    FROM "Subscriptions" s
    LEFT JOIN "Tiers" t ON s.tier_id = t.tier_id
    LEFT JOIN "Payments" p ON s.subscription_id = p.subscription_id
    WHERE s.user_id = '${user_id}'
    ORDER BY s.start_date DESC, p.createdAt DESC;
  `);

	if (!rows || rows.length === 0) {
		return {
			message: "No active subscriptions found for this user",
			subscriptions: [],
		};
	}

	// 2️⃣ Group rows by subscription_id
	const subscriptionsMap = new Map();

	for (const row of rows) {
		const subId = row.subscription_id;

		if (!subscriptionsMap.has(subId)) {
			// Create a new subscription object
			subscriptionsMap.set(subId, {
				subscription_id: subId,
				user_id: row.user_id,
				start_date: row.start_date,
				end_date: row.end_date,
				admin_id: row.admin_id,
				tier: {
					tier_id: row.tier_id,
					name: row.tier_name,
					description: row.tier_description,
					monthly: row.monthly,
					quarterly: row.quarterly,
					halfyearly: row.halfyearly,
					yearly: row.yearly,
				},
				payments: [],
				totalPaid: 0,
				latestPayment: null,
			});
		}

		const subscription = subscriptionsMap.get(subId);

		// If there is a payment in this row, add it
		if (row.payment_id) {
			subscription.payments.push({
				payment_id: row.payment_id,
				mode: row.payment_mode,
				paid: row.payment_paid,
				payable: row.payment_payable,
				createdAt: row.payment_createdAt,
			});

			subscription.totalPaid += row.payment_paid || 0;

			// Update latest payment
			if (
				!subscription.latestPayment ||
				new Date(row.payment_createdAt) >
					new Date(subscription.latestPayment.createdAt)
			) {
				subscription.latestPayment = {
					mode: row.payment_mode,
					paid: subscription.totalPaid,
					payable: row.payment_payable,
				};
			}
		}
	}

	// 3️⃣ Convert map to array
	const subscriptionsWithDetails = Array.from(subscriptionsMap.values()).map(
		(sub) => ({
			subscription_id: sub.subscription_id,
			user_id: sub.user_id,
			start_date: sub.start_date,
			end_date: sub.end_date,
			admin_id: sub.admin_id,
			tier: sub.tier,
			payment: sub.latestPayment,
		})
	);

	return {
		message: "Active subscriptions fetched successfully",
		subscriptions: subscriptionsWithDetails,
	};
}

export async function getUsersSearch({ search }) {
	try {
		if (!search || search.trim() === "") {
			return { success: false, message: "Search term is required", users: [] };
		}

		const searchTerm = search.trim().toLowerCase();

		const users = await rawQuery(`
			SELECT user_id, first_name, last_name, mobile_no, dob
			FROM "Users"
			WHERE LOWER("first_name") LIKE '%${searchTerm}%'
			OR LOWER("last_name") LIKE '%${searchTerm}%'
			LIMIT 5;
		`);

		return users;
	} catch (error) {
		console.error("Error fetching users:", error);
		return [];
	}
}

export async function getUsersPaymentById({
	user_id,
	subscription_id,
	pageNo = 1,
	pageSize = 10,
}) {
	if (!user_id || !subscription_id) {
		throw new Error("user_id and subscription_id are required");
	}

	const offset = (pageNo - 1) * pageSize;

	// 1️⃣ Count total payments
	const countResult = await rawQuery(`
    SELECT COUNT(*) AS total
    FROM "Payments"
    WHERE user_id = '${user_id}' AND subscription_id = '${subscription_id}';
  `);
	const totalPayments = countResult[0]?.total || 0;
	const totalPages = Math.ceil(totalPayments / pageSize);

	if (totalPayments === 0) {
		return {
			message: "No payments found for this subscription and user",
			totalPayments: 0,
			currentPage: pageNo,
			totalPages: 0,
			payments: [],
		};
	}

	// 2️⃣ Fetch paginated payments with admin details
	const payments = await rawQuery(`
    SELECT p.*,
           a.admin_id,
           a.first_name AS admin_first_name,
           a.last_name AS admin_last_name,
           a.username AS admin_username,
           a.mobile_no AS admin_mobile_no
    FROM "Payments" p
    LEFT JOIN "Admins" a ON p.admin_id = a.admin_id
    WHERE p.user_id = '${user_id}' AND p.subscription_id = '${subscription_id}'
    ORDER BY p.createdAt DESC
    LIMIT ${pageSize} OFFSET ${offset};
  `);

	return {
		message: "Payments fetched successfully",
		totalPayments,
		currentPage: pageNo,
		totalPages,
		payments,
	};
}

export async function getTrainers({ search = "" }) {
	try {
		let whereClause = `WHERE role = 'trainer'`;

		if (search && search.trim() !== "") {
			const searchTerm = `%${search.toLowerCase()}%`;
			whereClause += ` AND (LOWER(first_name) LIKE '${searchTerm}' OR LOWER(last_name) LIKE '${searchTerm}')`;
		}

		const trainers = await rawQuery(`
			SELECT admin_id, username, first_name, last_name, mobile_no, role
			FROM "Admins"
			${whereClause}
			ORDER BY first_name ASC;
		`);

		return {
			trainers,
			totalTrainers: trainers.length,
		};
	} catch (error) {
		console.error("Error fetching trainers:", error);
		throw new Error("Error fetching trainers");
	}
}

export async function getStatistics() {
	try {
		const now = new Date();

		// Current month range
		const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
		const currentMonthEnd = new Date(
			now.getFullYear(),
			now.getMonth() + 1,
			0,
			23,
			59,
			59,
			999
		);

		// Last month range
		const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		const lastMonthEnd = new Date(
			now.getFullYear(),
			now.getMonth(),
			0,
			23,
			59,
			59,
			999
		);

		// Today & yesterday range
		const todayStart = new Date(now.setHours(0, 0, 0, 0));
		const todayEnd = new Date(now.setHours(23, 59, 59, 999));
		const yesterdayStart = new Date(todayStart);
		yesterdayStart.setDate(yesterdayStart.getDate() - 1);
		const yesterdayEnd = new Date(todayEnd);
		yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

		// -----------------------------
		// 1️⃣ Today's & Yesterday's Revenue
		// -----------------------------
		const todayPaidRes = await rawQuery(
			`SELECT IFNULL(SUM(paid), 0) AS total FROM "Payments"
			 WHERE date BETWEEN '${todayStart.toISOString()}' AND '${todayEnd.toISOString()}';`
		);
		const yesterdayPaidRes = await rawQuery(
			`SELECT IFNULL(SUM(paid), 0) AS total FROM "Payments"
			 WHERE date BETWEEN '${yesterdayStart.toISOString()}' AND '${yesterdayEnd.toISOString()}';`
		);

		const todayPaid = todayPaidRes?.[0]?.total || 0;
		const yesterdayPaid = yesterdayPaidRes?.[0]?.total || 0;

		const revenueGrowthToday = yesterdayPaid
			? ((todayPaid - yesterdayPaid) / yesterdayPaid) * 100
			: 0;
		const revenueMessage = yesterdayPaid
			? `${revenueGrowthToday.toFixed(2)}% from yesterday`
			: "No revenue yesterday";

		// -----------------------------
		// 2️⃣ Monthly Revenue & Growth
		// -----------------------------
		const currentMonthPaidRes = await rawQuery(`
			SELECT IFNULL(SUM(paid), 0) AS total
			FROM "Payments"
			WHERE date BETWEEN '${currentMonthStart.toISOString()}' AND '${currentMonthEnd.toISOString()}';
		`);
		const lastMonthPaidRes = await rawQuery(`
			SELECT IFNULL(SUM(paid), 0) AS total
			FROM "Payments"
			WHERE date BETWEEN '${lastMonthStart.toISOString()}' AND '${lastMonthEnd.toISOString()}';
		`);

		const totalPaid = currentMonthPaidRes?.[0]?.total || 0;
		const totalPaidLastMonth = lastMonthPaidRes?.[0]?.total || 0;

		const revenueGrowth = totalPaidLastMonth
			? ((totalPaid - totalPaidLastMonth) / totalPaidLastMonth) * 100
			: 0;
		const revenue_message = totalPaidLastMonth
			? `${revenueGrowth.toFixed(2)}% from last month`
			: "No revenue last month";

		// -----------------------------
		// 3️⃣ Total Receivables (pending)
		// -----------------------------
		const receivablesRes = await rawQuery(`
			SELECT SUM(payable) AS total
			FROM (
				SELECT p1.payable
				FROM "Payments" p1
				WHERE p1.date = (
					SELECT MAX(p2.date)
					FROM "Payments" p2
					WHERE p2.subscription_id = p1.subscription_id
				)
			)
			WHERE payable != 0;
		`);
		const totalPending = receivablesRes?.[0]?.total || 0;

		// -----------------------------
		// 4️⃣ Active Members
		// -----------------------------
		const activeUsersRes = await rawQuery(`
			SELECT COUNT(DISTINCT u.user_id) AS active_count
			FROM "Users" u
			JOIN "Subscriptions" s ON s.user_id = u.user_id
			WHERE s.start_date <= CURRENT_TIMESTAMP AND s.end_date >= CURRENT_TIMESTAMP;
		`);
		const activeUsersCount = activeUsersRes?.[0]?.active_count || 0;

		const prevActiveRes = await rawQuery(`
			SELECT COUNT(DISTINCT u.user_id) AS active_count
			FROM "Users" u
			JOIN "Subscriptions" s ON s.user_id = u.user_id
			WHERE s.start_date <= '${lastMonthEnd.toISOString()}' 
			AND s.end_date >= '${lastMonthStart.toISOString()}';
		`);
		const prevActiveUsers = prevActiveRes?.[0]?.active_count || 0;

		const membersGrowth = prevActiveUsers
			? ((activeUsersCount - prevActiveUsers) / prevActiveUsers) * 100
			: 0;
		const members_message = prevActiveUsers
			? `${membersGrowth.toFixed(2)}% from last month`
			: "No active users last month";

		// -----------------------------
		// 5️⃣ Memberships
		// -----------------------------
		const newMembershipRes = await rawQuery(`
			SELECT COUNT(*) AS total
			FROM "Subscriptions"
			WHERE start_date BETWEEN '${currentMonthStart.toISOString()}' AND '${currentMonthEnd.toISOString()}';
		`);
		const prevMembershipRes = await rawQuery(`
			SELECT COUNT(*) AS total
			FROM "Subscriptions"
			WHERE start_date BETWEEN '${lastMonthStart.toISOString()}' AND '${lastMonthEnd.toISOString()}';
		`);

		const newMembershipCount = newMembershipRes?.[0]?.total || 0;
		const prevMembershipCount = prevMembershipRes?.[0]?.total || 0;

		const membershipsGrowth = prevMembershipCount
			? ((newMembershipCount - prevMembershipCount) / prevMembershipCount) * 100
			: 0;
		const memberships_message = prevMembershipCount
			? `${membershipsGrowth.toFixed(2)}% from last month`
			: "No memberships last month";

		// -----------------------------
		// 6️⃣ New Enquiries
		// -----------------------------
		const newEnquiriesRes = await rawQuery(`
			SELECT COUNT(*) AS total
			FROM "Users"
			WHERE createdAt BETWEEN '${currentMonthStart.toISOString()}' AND '${currentMonthEnd.toISOString()}';
		`);
		const prevEnquiriesRes = await rawQuery(`
			SELECT COUNT(*) AS total
			FROM "Users"
			WHERE createdAt BETWEEN '${lastMonthStart.toISOString()}' AND '${lastMonthEnd.toISOString()}';
		`);

		const newEnquiries = newEnquiriesRes?.[0]?.total || 0;
		const prevEnquiries = prevEnquiriesRes?.[0]?.total || 0;

		const enquiriesGrowth = prevEnquiries
			? ((newEnquiries - prevEnquiries) / prevEnquiries) * 100
			: 0;
		const enquiries_message = prevEnquiries
			? `${enquiriesGrowth.toFixed(2)}% from last month`
			: "No enquiries last month";

		// -----------------------------
		// ✅ Final Data
		// -----------------------------
		const statistics = [
			{
				title: "Today's Revenue",
				value: `₹${todayPaid.toLocaleString()}`,
				percentageChange: revenueMessage,
			},
			{
				title: "Monthly Revenue",
				value: `₹${totalPaid.toLocaleString()}`,
				percentageChange: revenue_message,
			},
			{
				title: "Receivables",
				value: `₹${totalPending.toLocaleString()}`,
				percentageChange: "Total Pending Amount",
			},
			{
				title: "General Members",
				value: `${activeUsersCount}`,
				percentageChange: members_message,
			},
			{
				title: "New Membership",
				value: `${newMembershipCount}`,
				percentageChange: memberships_message,
			},
			{
				title: "New Enquiries",
				value: `${newEnquiries}`,
				percentageChange: enquiries_message,
			},
		];

		return statistics;
	} catch (error) {
		console.error("Error fetching statistics:", error);
		return {
			success: false,
			message: "An error occurred while fetching statistics",
			error: error.message,
		};
	}
}

export const getGraphs = async ({ year }) => {
	try {
		const currentYear = year || new Date().getFullYear();

		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];

		const revenueData = [];
		const membersData = [];
		const membershipsData = [];
		const enquiriesData = [];

		for (let month = 0; month < 12; month++) {
			const startOfMonth = new Date(currentYear, month, 1);
			const endOfMonth = new Date(currentYear, month + 1, 0, 23, 59, 59, 999);

			const startStr = startOfMonth.toISOString().split("T")[0];
			const endStr = endOfMonth.toISOString().split("T")[0];

			// 💰 Total Revenue
			const revenueQuery = `
				SELECT IFNULL(SUM(paid), 0) AS totalRevenue
				FROM Payments
				WHERE date BETWEEN '${startStr}' AND '${endStr}';
			`;
			const revenueResult = await rawQuery(revenueQuery);
			const totalRevenue = revenueResult[0]?.totalRevenue || 0;
			revenueData.push(totalRevenue);

			// 👥 Total Members
			const membersQuery = `
				SELECT COUNT(*) AS totalMembers
				FROM Users
				WHERE DATE(createdAt) BETWEEN '${startStr}' AND '${endStr}';
			`;
			const membersResult = await rawQuery(membersQuery);
			const totalMembers = membersResult[0]?.totalMembers || 0;
			membersData.push(totalMembers);

			// 🏋️‍♀️ Total Memberships
			const membershipsQuery = `
				SELECT COUNT(*) AS totalMemberships
				FROM Subscriptions
				WHERE DATE(start_date) BETWEEN '${startStr}' AND '${endStr}';
			`;
			const membershipsResult = await rawQuery(membershipsQuery);
			const totalMemberships = membershipsResult[0]?.totalMemberships || 0;
			membershipsData.push(totalMemberships);

			// 📨 Total Enquiries (same as Users created)
			enquiriesData.push(totalMembers);
		}

		// Filter months with no data
		const filteredMonths = [];
		const filteredRevenue = [];
		const filteredMembers = [];
		const filteredMemberships = [];
		const filteredEnquiries = [];

		for (let i = 0; i < 12; i++) {
			if (
				revenueData[i] > 0 ||
				membersData[i] > 0 ||
				membershipsData[i] > 0 ||
				enquiriesData[i] > 0
			) {
				filteredMonths.push(months[i]);
				filteredRevenue.push(revenueData[i]);
				filteredMembers.push(membersData[i]);
				filteredMemberships.push(membershipsData[i]);
				filteredEnquiries.push(enquiriesData[i]);
			}
		}

		if (filteredMonths.length === 0) {
			return { message: `No Data Found for ${currentYear}` };
		}

		return [
			filteredMonths,
			filteredRevenue,
			filteredMembers,
			filteredMemberships,
			filteredEnquiries,
		];
	} catch (error) {
		console.error("Error fetching graph data:", error);
		throw error;
	}
};

export const getYearOption = async () => {
	try {
		// Query to get distinct years from start_date column
		const query = `
			SELECT DISTINCT strftime('%Y', start_date) AS year
			FROM Subscriptions
			ORDER BY year ASC;
		`;

		const years = await rawQuery(query);

		// Convert results to integer array
		const yearList = years.map((item) => parseInt(item.year, 10));

		return yearList;
	} catch (error) {
		console.error("Error fetching year options:", error);
		throw error;
	}
};

export async function getInvoice(subscription_id) {
	if (!subscription_id) {
		throw new Error("subscription_id is required");
	}

	// 1️⃣ Fetch invoice with user, subscription, and admin details
	const invoiceResult = await rawQuery(`
    SELECT 
      i.invoice_id,
      i.user_id,
      i.subscription_id,
      i.admin_id,
      i.createdAt AS invoice_createdAt,
      u.first_name AS user_first_name,
      u.last_name AS user_last_name,
      u.mobile_no AS user_mobile_no,
      s.start_date AS subscription_start_date,
      s.end_date AS subscription_end_date,
      s.tier_id AS tier_id,
      a.first_name AS admin_first_name,
      a.last_name AS admin_last_name,
      a.username AS admin_username
    FROM "Invoices" i
    LEFT JOIN "Users" u ON i.user_id = u.user_id
    LEFT JOIN "Subscriptions" s ON i.subscription_id = s.subscription_id
    LEFT JOIN "Admins" a ON i.admin_id = a.admin_id
    WHERE i.subscription_id = '${subscription_id}';
  `);

	if (!invoiceResult || invoiceResult.length === 0) {
		throw new Error("No invoice found");
	}
	const invoice = invoiceResult[0];

	// 2️⃣ Fetch tier details
	const tierResult = await rawQuery(`
    SELECT tier_id, name, monthly, quarterly, halfyearly, yearly
    FROM "Tiers"
    WHERE tier_id = '${invoice.tier_id}';
  `);
	const tier = tierResult[0];

	// 3️⃣ Fetch all payments for this subscription
	const payments = await rawQuery(`
    SELECT *
    FROM "Payments"
    WHERE subscription_id = '${subscription_id}'
    ORDER BY createdAt ASC;
  `);

	// 4️⃣ Calculate number of months between start and end date
	const startDate = new Date(invoice.subscription_start_date);
	const endDate = new Date(invoice.subscription_end_date);
	const numberOfMonths =
		(endDate.getFullYear() - startDate.getFullYear()) * 12 +
		(endDate.getMonth() - startDate.getMonth());

	// 5️⃣ Calculate discount and planPrice
	const totalPaid = payments.reduce((acc, p) => acc + p.paid, 0);
	const lastPayment = payments[payments.length - 1] || { payable: 0 };

	let discount = 0;
	let planPrice = 0;

	if (numberOfMonths === 1) {
		discount = tier.monthly - (totalPaid + lastPayment.payable);
		planPrice = tier.monthly;
	} else if (numberOfMonths === 3) {
		discount = tier.quarterly - (totalPaid + lastPayment.payable);
		planPrice = tier.quarterly;
	} else if (numberOfMonths === 6) {
		discount = tier.halfyearly - (totalPaid + lastPayment.payable);
		planPrice = tier.halfyearly;
	} else if (numberOfMonths === 12) {
		discount = tier.yearly - (totalPaid + lastPayment.payable);
		planPrice = tier.yearly;
	} else {
		discount =
			tier.monthly * numberOfMonths - (totalPaid + lastPayment.payable);
		planPrice = tier.monthly;
	}

	// 6️⃣ Construct response
	const responseData = {
		invoiceNumber: invoice.invoice_id,
		date: invoice.subscription_start_date,
		memberName: `${invoice.user_first_name} ${invoice.user_last_name}`,
		membershipName: tier.name,
		startDate: invoice.subscription_start_date,
		endDate: invoice.subscription_end_date,
		planPrice,
		discount,
		payments,
		numberOfMonths,
		admin: {
			firstName: invoice.admin_first_name,
			lastName: invoice.admin_last_name,
			username: invoice.admin_username,
		},
	};

	return responseData;
}

export async function getReceivables({
	page = 1,
	pageSize = 10,
	search = "",
}) {}

export const getTodaysRevenue = async ({ date }) => {
	try {
		// Use provided date or today's date (in YYYY-MM-DD format)
		const dateParam = date || new Date().toISOString().split("T")[0];

		// Query: Get all payments for that date
		const query = `
			SELECT 
				p.mode,
				p.paid,
				p.payable,
				u.first_name,
				u.last_name,
				u.mobile_no,
				s.start_date,
				s.end_date,
				s.subscription_id,
				t.name AS tier_name
			FROM Payments AS p
			LEFT JOIN Subscriptions AS s ON p.subscription_id = s.subscription_id
			LEFT JOIN Tiers AS t ON s.tier_id = t.tier_id
			LEFT JOIN Users AS u ON p.user_id = u.user_id
			WHERE DATE(p.date) = DATE('${dateParam}');
		`;

		const result = await rawQuery(query);
		return { data: result };
	} catch (error) {
		console.error("Error fetching today's revenue:", error);
		throw error;
	}
};

export async function getReminder() {
	try {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const formattedDate = today.toISOString();

		const reminders = await rawQuery(`
			SELECT 
				r.reminder_id,
				r.reminder_type,
				r.description,
				u.user_id,
				u.first_name,
				u.last_name,
				u.mobile_no
			FROM "Reminders" AS r
			LEFT JOIN "Users" AS u 
				ON r.user_id = u.user_id
			WHERE datetime(r.date_and_time) <= datetime('${formattedDate}')
			ORDER BY datetime(r.date_and_time) ASC;
		`);

		return reminders;
	} catch (error) {
		console.error("Error fetching reminders:", error);
		throw error;
	}
}
