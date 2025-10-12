import { toast } from "react-toastify";
import rawQuery from "../../connect-to-db/renderer";

export const deleteTheme = async (id) => {
	try {
		// Check if theme exists
		const existingTheme = await rawQuery(
			`SELECT * FROM "Themes" WHERE theme_id = '${id}';`
		);

		if (!existingTheme || existingTheme.length === 0) {
			toast.error("Theme not found");
			throw new Error("Theme not found");
		}

		// Delete the theme
		await rawQuery(`DELETE FROM "Themes" WHERE theme_id = '${id}';`);

		toast.success("Theme deleted successfully");

		return { message: "Theme deleted successfully" };
	} catch (error) {
		console.error("Error deleting theme:", error);
		toast.error("Error deleting theme");
		throw error;
	}
};

export const deleteTier = async (id) => {
	try {
		if (!id) {
			toast.error("Tier ID is required");
			throw new Error("Tier ID is required");
		}

		// Check if the tier exists
		const existing = await rawQuery(
			`SELECT * FROM "Tiers" WHERE tier_id='${id}' LIMIT 1;`
		);

		if (!existing || existing.length === 0) {
			toast.error("Tier not found");
			throw new Error("Tier not found");
		}

		// Delete the tier
		await rawQuery(`DELETE FROM "Tiers" WHERE tier_id='${id}';`);

		toast.success("Tier deleted successfully");
		return { message: "Tier deleted successfully" };
	} catch (error) {
		console.error("Error deleting tier:", error);
		toast.error("Error deleting tier");
		throw error;
	}
};

export const deleteUser = async (id) => {
	try {
		if (!id) {
			toast.error("user_id is required");
			throw new Error("user_id is required");
		}

		const user = await rawQuery(
			`SELECT * FROM "Users" WHERE "user_id" = '${id}' LIMIT 1;`
		);

		if (!user || user.length === 0) {
			toast.error("User not found");
			throw new Error("User not found");
		}

		await rawQuery(`DELETE FROM "Payments" WHERE "user_id" = '${id}';`);
		await rawQuery(`DELETE FROM "Subscription" WHERE "user_id" = '${id}';`);
		await rawQuery(`DELETE FROM "Users" WHERE "user_id" = '${id}';`);

		toast.success("User deleted successfully");
		return {
			success: true,
			message: "User and associated data deleted successfully",
		};
	} catch (error) {
		toast.error("Error deleting user");
		console.error("Error deleting user:", error);
		return {
			success: false,
			message: error.message || "Internal server error",
		};
	}
};

export const deleteTrainer = async (admin_id) => {
	try {
		// --- Check if trainer exists ---
		const trainerResult = await rawQuery(`
			SELECT * FROM "Admins"
			WHERE admin_id = '${admin_id}' AND role = 'trainer';
		`);

		const trainer = trainerResult[0];
		if (!trainer) {
			throw new Error("Trainer not found");
		}

		// --- Delete trainer ---
		await rawQuery(`
			DELETE FROM "Admins"
			WHERE admin_id = '${admin_id}' AND role = 'trainer';
		`);

		return { message: "Trainer deleted successfully" };
	} catch (error) {
		console.error("Error deleting trainer:", error);
		throw new Error("Error deleting trainer");
	}
};

export const deleteReminder = async (id) => {
	try {
		if (!id) {
			throw new Error("Reminder ID is required.");
		}

		const existingReminder = await rawQuery(`
			SELECT * FROM "Reminders"
			WHERE reminder_id = '${id}';
		`);

		if (!existingReminder || existingReminder.length === 0) {
			throw new Error("Reminder not found.");
		}

		// Delete the reminder
		await rawQuery(`
			DELETE FROM "Reminders"
			WHERE reminder_id = '${id}';
		`);
		toast.success("Reminder deleted successfully");

		return { success: true, message: "Reminder deleted successfully." };
	} catch (error) {
		console.error("Error deleting reminder:", error);
		throw error;
	}
};
