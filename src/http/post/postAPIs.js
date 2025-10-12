import { toast } from "react-toastify";
import rawQuery from "../../connect-to-db/renderer";
import { v4 as uuidv4 } from "uuid";

const token = JSON.parse(localStorage.getItem("token"));
const admin_id = token?.admin_id;

export const login = async ({ username, password }) => {
	try {
		const rows = await rawQuery(
			`SELECT * FROM "Admins" WHERE username = "${username}";`
		);

		if (!rows || rows.length === 0) {
			toast.error("Admin doesn't exist");
			throw new Error("admin doesn't exist");
		}

		const admin = rows[0];

		if (password !== admin.password_hash) {
			toast.error("Incorrect password");
			throw new Error("incorrect password");
		}

		return {
			message: "Logged in successfully",
			token: JSON.stringify(admin),
		};
	} catch (error) {
		console.error("Error Logging in:", error);
		throw error;
	}
};

export async function createNewTheme({
	primary_color,
	gradient_start,
	gradient_middle,
	gradient_end,
}) {
	try {
		// Validation
		if (
			!primary_color ||
			!gradient_start ||
			!gradient_middle ||
			!gradient_end
		) {
			toast.error("All fields must be provided");
			throw new Error("All fields must be provided");
		}

		const theme_id = uuidv4();

		// Insert new theme record
		await rawQuery(`
			INSERT INTO "Themes" (
				theme_id,
				primary_color,
				gradient_start,
				gradient_middle,
				gradient_end,
				is_active,
				createdAt,
				updatedAt
			)
			VALUES (
				'${theme_id}',
				'${primary_color}',
				'${gradient_start}',
				'${gradient_middle}',
				'${gradient_end}',
				0,
				CURRENT_TIMESTAMP,
				CURRENT_TIMESTAMP
			);
		`);

		toast.success("Theme created successfully");

		return {
			message: "Theme created successfully",
			result: {
				theme_id,
				primary_color,
				gradient_start,
				gradient_middle,
				gradient_end,
				is_active: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		};
	} catch (error) {
		console.error("Error creating theme:", error);
		throw error;
	}
}

export async function createNewTier({
	name,
	description,
	monthly,
	quarterly,
	halfyearly,
	yearly,
}) {
	try {
		// Validate required fields
		if (
			!name ||
			!description ||
			!monthly ||
			!quarterly ||
			!halfyearly ||
			!yearly
		) {
			toast.error("One or more fields missing");
			throw new Error("Required fields missing");
		}

		const tier_id = uuidv4();

		// Check if tier already exists
		const existingTier = await rawQuery(`
      SELECT * FROM "Tiers" WHERE LOWER(name) = '${name.trim().toLowerCase()}';
    `);

		if (existingTier.length > 0) {
			toast.error("Tier already exists");
			throw new Error("Tier already exists");
		}

		// Insert new tier
		await rawQuery(`
      INSERT INTO "Tiers" (tier_id, name, description, monthly, quarterly, halfyearly, yearly, createdAt, updatedAt)
      VALUES (
        '${tier_id}',
        '${name.trim().toLowerCase()}',
        '${description.trim().toLowerCase()}',
        ${monthly},
        ${quarterly},
        ${halfyearly},
        ${yearly},
				CURRENT_TIMESTAMP,
				CURRENT_TIMESTAMP
      );
    `);

		const newTier = {
			tier_id,
			name: name.trim().toLowerCase(),
			description: description.trim().toLowerCase(),
			monthly,
			quarterly,
			halfyearly,
			yearly,
		};

		toast.success("Tier created successfully");
		return { message: "Tier created successfully", result: newTier };
	} catch (error) {
		console.error("Error creating tier:", error);
		throw error;
	}
}

export async function createNewUser({ first_name, last_name, mobile_no, dob }) {
	try {
		// Validate required fields
		if (!first_name || !last_name || !mobile_no) {
			toast.error("One or more fields missing for registration");
			throw new Error("Required fields missing");
		}

		const user_id = uuidv4();

		// Check if user already exists
		const existingUsers = await rawQuery(`
      SELECT * FROM "Users" WHERE mobile_no = '${mobile_no}';
    `);

		if (existingUsers.length > 0) {
			toast.error("User already exists");
			throw new Error("User already exists");
		}

		// Insert new user
		await rawQuery(`
      INSERT INTO "Users" (user_id, first_name, last_name, mobile_no, dob, createdAt, updatedAt)
      VALUES (
        '${user_id}',
        '${first_name.trim().toLowerCase()}',
        '${last_name.trim().toLowerCase()}',
        '${mobile_no}',
        ${dob ? `'${dob}'` : "NULL"},
				CURRENT_TIMESTAMP,
				CURRENT_TIMESTAMP
      );
    `);

		// Return user object
		const user = {
			user_id,
			first_name,
			last_name,
			mobile_no,
			role: "user",
		};

		toast.success("User created successfully");
		return { message: "User created successfully", result: user };
	} catch (error) {
		console.error("Error creating user:", error);
		throw error;
	}
}

export async function createNewSubscription({
	user_id,
	tier_id,
	start_date,
	end_date,
	paid,
	payable,
	mode,
}) {
	try {
		// 🧩 Validate required fields
		if (
			!user_id ||
			!tier_id ||
			!start_date ||
			!end_date ||
			!mode ||
			paid === undefined ||
			payable === undefined
		) {
			throw new Error("One or more fields are missing");
		}

		// 🧩 Check if user exists
		const user = await rawQuery(
			`SELECT * FROM "Users" WHERE user_id = '${user_id}' LIMIT 1;`
		);
		if (!user || user.length === 0) {
			throw new Error("User not found");
		}

		// 🧩 Check if tier exists
		const tier = await rawQuery(
			`SELECT * FROM "Tiers" WHERE tier_id = '${tier_id}' LIMIT 1;`
		);
		if (!tier || tier.length === 0) {
			throw new Error("Tier not found");
		}

		// 🧩 Check if subscription already exists for overlapping dates
		const existingSubscription = await rawQuery(`
			SELECT * FROM "Subscriptions"
			WHERE user_id = '${user_id}'
			AND tier_id = '${tier_id}'
			AND start_date <= '${end_date}'
			AND end_date >= '${start_date}';
		`);

		if (existingSubscription.length > 0) {
			throw new Error("Subscription already exists within the specified dates");
		}

		// 🧾 Create new subscription
		const subscription_id = uuidv4();
		await rawQuery(`
			INSERT INTO "Subscriptions" (subscription_id, admin_id, user_id, tier_id, start_date, end_date, createdAt, updatedAt)
			VALUES (
				'${subscription_id}',
				'${admin_id}',
				'${user_id}',
				'${tier_id}',
				'${start_date}',
				'${end_date}',
				CURRENT_TIMESTAMP,
				CURRENT_TIMESTAMP
			);
		`);

		// 💰 Create payment entry
		const payment_id = uuidv4();
		await rawQuery(`
			INSERT INTO "Payments" (payment_id, user_id, admin_id, subscription_id, mode, paid, payable, date, createdAt, updatedAt)
			VALUES (
				'${payment_id}',
				'${user_id}',
				'${admin_id}',
				'${subscription_id}',
				'${mode}',
				${paid},
				${payable},
				'${start_date}',
				CURRENT_TIMESTAMP,
				CURRENT_TIMESTAMP
			);
		`);

		// 🧾 Create invoice entry
		const invoice_id = uuidv4();
		await rawQuery(`
			INSERT INTO "Invoices" (invoice_id, subscription_id, admin_id, user_id, createdAt, updatedAt)
			VALUES (
				'${invoice_id}',
				'${subscription_id}',
				'${admin_id}',
				'${user_id}',
				CURRENT_TIMESTAMP,
				CURRENT_TIMESTAMP
			);
		`);

		toast.success("Subscription created successfully");
		return {
			message: "Subscription and payment created successfully",
			subscription_id,
			payment_id,
			invoice_id,
		};
	} catch (error) {
		console.error("Error creating subscription:", error);
		throw error;
	}
}

export async function createNewPayment({
	user_id,
	subscription_id,
	mode,
	date,
	paid,
	payable,
}) {
	try {
		// 1️⃣ Validate required fields
		if (!user_id || !mode || paid === undefined || payable === undefined) {
			toast.error("One or more required fields are missing");
			throw new Error("One or more required fields are missing");
		}

		// 2️⃣ Check if user exists
		const userResult = await rawQuery(`
      SELECT * FROM "Users" WHERE user_id = '${user_id}';
    `);
		if (userResult.length === 0) {
			toast.error("User not found");
			throw new Error("User not found");
		}

		// 3️⃣ Check if subscription exists
		const subscriptionResult = await rawQuery(`
      SELECT * FROM "Subscriptions" WHERE subscription_id = '${subscription_id}';
    `);
		if (subscriptionResult.length === 0) {
			toast.error("Subscription not found");
			throw new Error("Subscription not found");
		}

		// 4️⃣ Generate new payment_id
		const payment_id = uuidv4();

		// 5️⃣ Insert new payment record
		await rawQuery(`
      INSERT INTO "Payments" (
        payment_id,
        user_id,
        subscription_id,
        admin_id,
        mode,
        paid,
        payable,
        createdAt,
        updatedAt,
        date
      )
      VALUES (
        '${payment_id}',
        '${user_id}',
        '${subscription_id}',
        '${admin_id || ""}',
        '${mode}',
        ${paid},
        ${payable},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        '${date}'
      );
    `);

		// 6️⃣ Fetch the newly inserted payment
		const newPaymentResult = await rawQuery(`
      SELECT * FROM "Payments" WHERE payment_id = '${payment_id}';
    `);
		const newPayment = newPaymentResult[0];

		toast.success("Payment created successfully");
		return {
			message: "Payment created successfully",
			payment: newPayment,
		};
	} catch (error) {
		console.error("Error creating new payment:", error);
		toast.error("Failed to create payment. Please try again.");
		throw error; // rethrow so the caller can handle it if needed
	}
}

export async function createNewTrainer({
	username,
	first_name,
	last_name,
	mobile_no,
	password,
	role = "trainer",
}) {
	try {
		// Validate inputs
		if (!username || !first_name || !last_name || !mobile_no) {
			throw new Error("One or more fields missing for registration");
		}

		// Check if username or mobile_no already exists
		const existingAccounts = await rawQuery(`
			SELECT * FROM "Admins" 
			WHERE username = '${username}' OR mobile_no = '${mobile_no}';
		`);

		if (existingAccounts?.length !== 0) {
			throw new Error("Username or mobile number already exists");
		}

		const admin_id = uuidv4();

		// Insert new admin record
		await rawQuery(`
			INSERT INTO "Admins" (
				admin_id,
				username,
				first_name,
				last_name,
				mobile_no,
				role,
				trigger_reset,
				password_hash,
				createdAt,
				updatedAt
			)
			VALUES (
				'${admin_id}',
				'${username}',
				'${first_name}',
				'${last_name}',
				'${mobile_no}',
				'${role}',
				1,
				'${password}',
				CURRENT_TIMESTAMP,
				CURRENT_TIMESTAMP
			);
		`);

		toast.success("Trainer created successfully");
		return {
			message: "Admin created successfully",
		};
	} catch (err) {
		console.error("Error while creating trainer:", err);
		throw new Error(err.message || "Error while creating trainer!");
	}
}

export async function createNewReminder({
	user_id,
	reminder_type,
	description,
	date_and_time,
}) {
	try {
		// Validate input
		if (!user_id || !reminder_type || !description || !date_and_time) {
			throw new Error("All fields are required.");
		}

		const parsedDateTime = new Date(date_and_time);
		if (isNaN(parsedDateTime)) {
			throw new Error("Invalid date_and_time format.");
		}

		const reminder_id = uuidv4();

		// Insert new reminder
		await rawQuery(`
			INSERT INTO "Reminders" (
				reminder_id,
				user_id,
				reminder_type,
				description,
				date_and_time,
				createdAt,
				updatedAt
			)
			VALUES (
				'${reminder_id}',
				'${user_id}',
				'${reminder_type}',
				'${description}',
				'${parsedDateTime.toISOString()}',
				CURRENT_TIMESTAMP,
				CURRENT_TIMESTAMP
			);
		`);

		toast.success("Reminder created successfully");
		return {
			success: true,
			message: "Reminder created successfully.",
		};
	} catch (error) {
		console.error("Error creating reminder:", error);
		throw error;
	}
}
