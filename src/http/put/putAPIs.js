import { toast } from "react-toastify";
import rawQuery from "../../connect-to-db/renderer";

export const updateThemeStatus = async (id) => {
	try {
		if (!id) {
			toast.error("Theme ID is required");
			throw new Error("Theme ID is required");
		}

		// deactivate all others first
		await rawQuery(`UPDATE "Themes" SET is_active = 0 WHERE is_active = 1;`);

		// Build update fields dynamically
		await rawQuery(`
  		UPDATE "Themes"
  		SET is_active = 1
  		WHERE theme_id = '${id}';
		`);

		toast.success("Theme updated successfully");
		return { message: "Theme updated successfully" };
	} catch (error) {
		console.error("Error updating theme:", error);
		toast.error("Error updating theme");
		throw error;
	}
};

export const updateTiers = async ({
	id,
	name,
	description,
	monthly,
	quarterly,
	halfyearly,
	yearly,
}) => {
	try {
		if (!id) {
			toast.error("Tier ID is required");
			throw new Error("Tier ID is required");
		}

		// Ensure at least one field to update
		if (
			!name &&
			!description &&
			!monthly &&
			!quarterly &&
			!halfyearly &&
			!yearly
		) {
			toast.error("At least one field must be provided for update");
			throw new Error("At least one field must be provided for update");
		}

		// Build dynamic update fields
		const updates = [];
		if (name) updates.push(`name='${name.trim().toLowerCase()}'`);
		if (description)
			updates.push(`description='${description.trim().toLowerCase()}'`);
		if (monthly) updates.push(`monthly=${monthly}`);
		if (quarterly) updates.push(`quarterly=${quarterly}`);
		if (halfyearly) updates.push(`halfyearly=${halfyearly}`);
		if (yearly) updates.push(`yearly=${yearly}`);
		updates.push(`updatedAt=CURRENT_TIMESTAMP`);

		// Construct SQL update query
		const query = `
			UPDATE "Tiers"
			SET ${updates.join(", ")}
			WHERE tier_id='${id}';
		`;

		await rawQuery(query);

		toast.success("Tier updated successfully");
		return { message: "Tier updated successfully" };
	} catch (error) {
		console.error("Error updating tier:", error);
		toast.error("Error updating tier");
		throw error;
	}
};

export const updateUser = async ({
	user_id,
	first_name,
	last_name,
	mobile_no,
	dob,
}) => {
	try {
		if (!user_id) {
			toast.error("user_id is required");
			throw new Error("user_id is required");
		}

		const user = await rawQuery(
			`SELECT * FROM "Users" WHERE "user_id" = '${user_id}' LIMIT 1;`
		);
		if (!user || user.length === 0) {
			toast.error("User not found");
			throw new Error("User not found");
		}

		const updateFields = [];
		if (first_name?.trim())
			updateFields.push(`"first_name"='${first_name.trim()}'`);
		if (last_name?.trim())
			updateFields.push(`"last_name"='${last_name.trim()}'`);
		if (mobile_no?.trim())
			updateFields.push(`"mobile_no"='${mobile_no.trim()}'`);
		if (dob) updateFields.push(`"dob"='${new Date(dob).toISOString()}'`);

		if (updateFields.length === 0) {
			throw new Error("No fields provided to update");
		}

		if (mobile_no?.trim()) {
			const mobileCheck = await rawQuery(`
				SELECT * FROM "Users"
				WHERE "mobile_no"='${mobile_no.trim()}'
				AND "user_id" != '${user_id}'
				LIMIT 1;
			`);

			if (mobileCheck && mobileCheck.length > 0) {
				toast.error("Mobile number already in use");
				throw new Error("Mobile number already in use");
			}
		}

		const updateQuery = `
			UPDATE "Users"
			SET ${updateFields.join(", ")}
			WHERE "user_id"='${user_id}';
		`;
		await rawQuery(updateQuery);

		const updatedUser = await rawQuery(
			`SELECT user_id, first_name, last_name, mobile_no, dob FROM "Users" WHERE "user_id"='${user_id}';`
		);

		toast.success("User updated successfully");
		return {
			success: true,
			message: "User details updated successfully",
			user: updatedUser[0],
		};
	} catch (error) {
		toast.error("Error updating user");
		console.error("Error updating user:", error);
		return { success: false, message: error.message };
	}
};

export const updateTrainer = async ({
	admin_id,
	first_name,
	last_name,
	username,
	mobile_no,
	password,
}) => {
	try {
		// --- Check if trainer exists and role is 'trainer' ---
		const trainerResult = await rawQuery(`
			SELECT * FROM "Admins"
			WHERE admin_id = '${admin_id}' AND role = 'trainer';
		`);

		const trainer = trainerResult[0];
		if (!trainer) {
			throw new Error("Trainer not found");
		}

		// --- Prepare new data ---
		let passwordHash = trainer.password_hash;
		let trigger_reset = trainer.trigger_reset;

		if (password) {
			passwordHash = password;
			trigger_reset = 1;
		}

		// --- Update trainer record ---
		await rawQuery(`
			UPDATE "Admins"
			SET
				username = '${username || trainer.username}',
				first_name = '${first_name || trainer.first_name}',
				last_name = '${last_name || trainer.last_name}',
				mobile_no = '${mobile_no || trainer.mobile_no}',
				password_hash = '${passwordHash}',
				trigger_reset = ${trigger_reset},
				updatedAt = CURRENT_TIMESTAMP
			WHERE admin_id = '${admin_id}' AND role = 'trainer';
		`);

		const [updatedTrainer] = await rawQuery(`
			SELECT id, admin_id, username, first_name, last_name, mobile_no, role, trigger_reset
			FROM "Admins"
			WHERE admin_id = '${admin_id}' AND role = 'trainer';
		`);

		toast.success("Trainer updated successfully");
		return {
			message: "Trainer updated successfully",
			trainer: updatedTrainer,
		};
	} catch (error) {
		console.error("Error updating trainer:", error);
		throw new Error("Error updating trainer");
	}
};
