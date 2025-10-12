import { safeReload } from "../connect-to-db/renderer";

export const generateRandomNoFromRange = (startNum, endNum) => {
	return Math.floor(Math.random() * (endNum - startNum + 1)) + startNum;
};

export const handelLogout = () => {
	localStorage.removeItem("token");
	// safeReload();
};

export const decodeJWT = () => {
	try {
		const token = localStorage.getItem("token");
		if (!token) return;
		return JSON.parse(token);
	} catch (error) {
		console.error("Error decoding JWT token:", error);
		return null;
	}
};

export const capitalizeFirstLetter = (string = "") => {
	if (string.length > 0) {
		return string?.charAt(0)?.toUpperCase() + string?.slice(1);
	}
	return string;
};

export function transformTiers(tiers) {
	return tiers.map((tier) => ({
		name: tier.name.charAt(0).toUpperCase() + tier.name.slice(1),
		id: `${tier.name.toLowerCase()}`,
		price: {
			monthly: `₹${tier.monthly}`,
			quarterly: `₹${tier.quarterly}`,
		},
		description:
			tier.description.charAt(0).toUpperCase() + tier.description.slice(1),
		mostPopular: tier.mostPopular,
		recommended: tier.recommended,
	}));
}

export function getHoverColor(color) {
	if (!color) return;

	// Helper function to convert hex to RGB
	const hexToRgb = (hex) => {
		let r = 0,
			g = 0,
			b = 0;
		if (hex.length === 4) {
			r = parseInt(hex[1] + hex[1], 16);
			g = parseInt(hex[2] + hex[2], 16);
			b = parseInt(hex[3] + hex[3], 16);
		} else if (hex.length === 7) {
			r = parseInt(hex[1] + hex[2], 16);
			g = parseInt(hex[3] + hex[4], 16);
			b = parseInt(hex[5] + hex[6], 16);
		}
		return { r, g, b, a: 1 };
	};

	// Helper function to parse RGBA
	const parseRgba = (rgba) => {
		const parts = rgba.match(
			/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d*\.?\d+)?\)/
		);
		return {
			r: parseInt(parts[1], 10),
			g: parseInt(parts[2], 10),
			b: parseInt(parts[3], 10),
			a: parts[4] ? parseFloat(parts[4]) : 1,
		};
	};

	// Darken the RGB color
	const darken = (rgb) => {
		const amount = 20; // Amount to darken by (you can adjust this)
		return {
			r: Math.max(0, rgb.r - amount),
			g: Math.max(0, rgb.g - amount),
			b: Math.max(0, rgb.b - amount),
			a: rgb.a,
		};
	};

	// Convert color to RGB and darken it
	let rgb;
	if (color.startsWith("#")) {
		rgb = hexToRgb(color);
	} else if (color.startsWith("rgba") || color.startsWith("rgb")) {
		rgb = parseRgba(color);
	} else {
		throw new Error("Invalid color format");
	}

	const hoverColor = darken(rgb);

	// Return the color in the original format
	if (color?.startsWith("#")) {
		return `#${(
			(1 << 24) +
			(hoverColor.r << 16) +
			(hoverColor.g << 8) +
			hoverColor.b
		)
			.toString(16)
			.slice(1)}`;
	} else {
		return `rgba(${hoverColor.r}, ${hoverColor.g}, ${hoverColor.b}, ${hoverColor.a})`;
	}
}

export function formatDate(inputDate) {
	if (!inputDate) {
		return;
	}

	if (inputDate?.includes("T")) {
		inputDate = inputDate?.split("T")[0];
	}

	// Define month names
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	// Parse the input date
	const [year, month, day] = inputDate?.split("-")?.map(Number);

	// Format the date
	const formattedDate = `${day} ${months[month - 1]} ${year}`;

	return formattedDate;
}

export function generatePassword(length = 8) {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
	let password = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		password += characters[randomIndex];
	}

	return password;
}

export const getTodayDate = () => {
	const today = new Date();
	return today.toISOString().split("T")[0];
};
